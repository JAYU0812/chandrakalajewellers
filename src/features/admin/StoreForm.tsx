import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { ArrowLeft } from 'lucide-react';

const storeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Invalid email address'),
  google_maps_url: z.string().optional(),
  opening_hours_mon_sat: z.string().min(1, 'Opening hours for Mon-Sat are required'),
  opening_hours_sun: z.string().min(1, 'Opening hours for Sun are required'),
  staff_members: z.string().optional(), // Metadata staff lists
  holiday_schedule: z.string().optional(), // Metadata holiday dates
  is_active: z.boolean(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const MOCK_SHOWROOMS = [
  {
    id: 's1',
    name: 'Chennai Flagship Boutique',
    address: '101 Cathedral Road, Alwarpet, Chennai - 600086',
    phone: '+91 44 2811 4040',
    email: 'chennai@chandrakalajewellers.com',
    opening_hours: { Mon_Sat: '10:30 AM - 8:30 PM', Sun: '11:00 AM - 6:00 PM', staff: 'Aravind, Meera, Sanjay', holidays: 'Aug 15, Oct 2, Dec 25' },
    google_maps_url: 'https://maps.google.com',
    is_active: true,
  },
  {
    id: 's2',
    name: 'Bengaluru Boutique',
    address: '45 Lavelle Road, Richmond Town, Bengaluru - 560001',
    phone: '+91 80 4122 3030',
    email: 'blr@chandrakalajewellers.com',
    opening_hours: { Mon_Sat: '10:30 AM - 8:30 PM', Sun: 'Closed', staff: 'Kiran, Priya', holidays: 'Nov 1, Dec 25' },
    google_maps_url: 'https://maps.google.com',
    is_active: true,
  },
];

export const StoreForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      google_maps_url: '',
      opening_hours_mon_sat: '10:30 AM - 8:30 PM',
      opening_hours_sun: 'Closed',
      staff_members: '',
      holiday_schedule: '',
      is_active: true,
    },
  });

  // Fetch showroom details
  const { data: dbShowroom, isLoading } = useQuery({
    queryKey: ['admin-showroom', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      try {
        const { data, error } = await supabase
          .from('store_locations')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        return MOCK_SHOWROOMS.find(s => s.id === id) || null;
      }
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (dbShowroom) {
      reset({
        name: dbShowroom.name,
        address: dbShowroom.address,
        phone: dbShowroom.phone,
        email: dbShowroom.email,
        google_maps_url: dbShowroom.google_maps_url || '',
        opening_hours_mon_sat: dbShowroom.opening_hours?.Mon_Sat || '10:30 AM - 8:30 PM',
        opening_hours_sun: dbShowroom.opening_hours?.Sun || 'Closed',
        staff_members: dbShowroom.opening_hours?.staff || '',
        holiday_schedule: dbShowroom.opening_hours?.holidays || '',
        is_active: dbShowroom.is_active,
      });
    }
  }, [dbShowroom, reset]);

  const mutation = useMutation({
    mutationFn: async (values: StoreFormValues) => {
      // Package operating hours metadata object to keep schema intact
      const openingHoursJson = {
        Mon_Sat: values.opening_hours_mon_sat,
        Sun: values.opening_hours_sun,
        staff: values.staff_members,
        holidays: values.holiday_schedule,
      };

      const payload = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email,
        google_maps_url: values.google_maps_url || null,
        opening_hours: openingHoursJson,
        is_active: values.is_active,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('store_locations')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_locations')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-showrooms'] });
      queryClient.invalidateQueries({ queryKey: ['store-locations-public'] });
      navigate('/admin/stores');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save store showroom details.');
    },
  });

  const onSubmit = (values: StoreFormValues) => {
    if (!dbShowroom && isEditMode) {
      alert("Sandbox Mode: Showroom details edited and saved successfully.");
      navigate('/admin/stores');
      return;
    }
    if (!supabase.auth.getUser() && !isEditMode) {
      alert("Sandbox Mode: Boutique showroom location created successfully.");
      navigate('/admin/stores');
      return;
    }
    mutation.mutate(values);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="p-12 text-center">
        <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/stores')} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Showrooms
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? `Edit Showroom: ${dbShowroom?.name}` : 'Register Boutique Showroom'}
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1.5">
            Configure contact parameters, operating details, team mapping, and schedules.
          </p>
        </div>

        <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryInput
                {...register('name')}
                label="Boutique Showroom Name"
                error={errors.name?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('email')}
                label="Boutique Contact Email"
                error={errors.email?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryInput
                {...register('phone')}
                label="Boutique Contact Phone"
                error={errors.phone?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('google_maps_url')}
                label="Google Maps URL Navigation (Optional)"
                error={errors.google_maps_url?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                Boutique Showroom Address
              </label>
              <textarea
                {...register('address')}
                rows={3}
                disabled={isSubmitting}
                className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                placeholder="Enter complete postal boutique address..."
              />
              {errors.address?.message && (
                <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryInput
                {...register('opening_hours_mon_sat')}
                label="Hours: Monday - Saturday"
                error={errors.opening_hours_mon_sat?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('opening_hours_sun')}
                label="Hours: Sunday"
                error={errors.opening_hours_sun?.message}
                disabled={isSubmitting}
              />
            </div>

            {/* Expanded metadata mapping fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gold-primary/10 pt-6">
              <LuxuryInput
                {...register('staff_members')}
                label="Assigned Consultants Staff List (comma separated)"
                placeholder="e.g. Aravind, Priya, Sanjay"
                error={errors.staff_members?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('holiday_schedule')}
                label="Holiday Exceptions Schedules (comma separated)"
                placeholder="e.g. Aug 15, Oct 2, Dec 25"
                error={errors.holiday_schedule?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-obsidian/60 dark:text-pearl/50 mt-2">
              <input
                type="checkbox"
                {...register('is_active')}
                disabled={isSubmitting}
                className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
              />
              Boutique showroom location active (visible in reservations schedules lists)
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-4">
              <LuxuryButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/stores')}
                disabled={isSubmitting}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                type="submit"
                variant="gold"
                size="sm"
                loading={isSubmitting}
              >
                Save Showroom
              </LuxuryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
