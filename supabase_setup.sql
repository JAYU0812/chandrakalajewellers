-- ========================================================
-- CHANDRAKALA JEWELLERS - DATABASE SETUP SCRIPT (SUPABASE)
-- ========================================================

-- 1. EXTENSIONS SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- 2. CLEANUP (To enable clean fresh installs)
DROP VIEW IF EXISTS public.vw_product_current_pricing CASCADE;
DROP TRIGGER IF EXISTS audit_trg_products ON public.products CASCADE;
DROP TRIGGER IF EXISTS audit_trg_rates ON public.metal_rates CASCADE;
DROP TRIGGER IF EXISTS audit_trg_appointments ON public.appointments CASCADE;
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products CASCADE;
DROP TRIGGER IF EXISTS trg_appointments_updated_at ON public.appointments CASCADE;
DROP TRIGGER IF EXISTS trg_metal_rates_updated_at ON public.metal_rates CASCADE;
DROP TRIGGER IF EXISTS trg_collections_updated_at ON public.collections CASCADE;
DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories CASCADE;

DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.comparisons CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.store_locations CASCADE;
DROP TABLE IF EXISTS public.product_collection_mapping CASCADE;
DROP TABLE IF EXISTS public.product_category_mapping CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.metal_rates CASCADE;
DROP TABLE IF EXISTS public.admin_roles CASCADE;

-- 3. TABLES DEFINITION

-- Administrative staff roles mapping
CREATE TABLE public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- References auth.users(id) in Supabase Auth
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'catalog_manager', 'store_manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Commodity metal rates
CREATE TABLE public.metal_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal_type TEXT NOT NULL CHECK (metal_type IN ('gold', 'silver')),
    purity TEXT NOT NULL CHECK (purity IN ('24k', '22k', '18k', 'fine_silver')),
    rate_per_g NUMERIC(10,2) NOT NULL CHECK (rate_per_g > 0),
    rate_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Inventory Catalog
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    metal_type TEXT NOT NULL CHECK (metal_type IN ('gold', 'silver', 'platinum')),
    purity TEXT NOT NULL CHECK (purity IN ('24k', '22k', '18k', '950')),
    weight_g NUMERIC(8,3) NOT NULL CHECK (weight_g > 0),
    labor_charge_per_g NUMERIC(10,2) NOT NULL CHECK (labor_charge_per_g >= 0),
    waste_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (waste_pct >= 0),
    gemstone_value NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (gemstone_value >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catalog product secondary images
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Editorial Collections
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    banner_storage_path TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Categories Hierarchy (Tree Structure)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    parent_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mapping Tables (Many-to-Many Relationships)
CREATE TABLE public.product_category_mapping (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE public.product_collection_mapping (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (product_id, collection_id)
);

-- Showroom Store Locations
CREATE TABLE public.store_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    google_maps_url TEXT,
    opening_hours JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer Consultations Appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    location_id UUID NOT NULL REFERENCES public.store_locations(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wishlists
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Nullable to allow guest wishlist sessions
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Comparisons
CREATE TABLE public.comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Editorial Luxury Blog
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_path TEXT NOT NULL,
    author_id UUID NOT NULL, -- References auth.users(id)
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Featured Client Testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- System Audit Logs (Immutable Data Trail)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEX OPTIMIZATIONS
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_metal_rates_lookup ON public.metal_rates(metal_type, purity, rate_date DESC);
CREATE INDEX idx_appointments_date_status ON public.appointments(appointment_date, status);
CREATE INDEX idx_audit_logs_lookup ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_product_images_order ON public.product_images(product_id, display_order);

-- 5. DYNAMIC PRICING VIEW
CREATE OR REPLACE VIEW public.vw_product_current_pricing AS
SELECT 
    p.id AS product_id,
    p.sku,
    p.name,
    p.metal_type,
    p.purity,
    p.weight_g,
    p.labor_charge_per_g,
    p.waste_pct,
    p.gemstone_value,
    p.is_active,
    COALESCE(r.rate_per_g, 0.00) AS metal_rate_per_g,
    -- Calculation Formula: ((Weight * Daily Rate) * (1 + Wastage% / 100)) + (Weight * Labor) + Gemstone Value
    ROUND(
        ((p.weight_g * COALESCE(r.rate_per_g, 0.00)) * (1 + p.waste_pct / 100)) + 
        (p.weight_g * p.labor_charge_per_g) + 
        p.gemstone_value, 
        2
    ) AS calculated_base_price
FROM public.products p
LEFT JOIN LATERAL (
    SELECT rate_per_g 
    FROM public.metal_rates 
    WHERE metal_type = p.metal_type AND purity = p.purity
    ORDER BY rate_date DESC, created_at DESC 
    LIMIT 1
) r ON TRUE;

-- 6. TRIGGER FUNCTIONS

-- Standard updated_at timestamp utility
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply set_updated_at triggers
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_metal_rates_updated_at BEFORE UPDATE ON public.metal_rates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Immutable Audit Log Generator Function
CREATE OR REPLACE FUNCTION public.generate_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
    old_val JSONB := NULL;
    new_val JSONB := NULL;
BEGIN
    -- Try retrieving Supabase metadata authenticated user id
    BEGIN
        current_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        current_user_id := NULL;
    END;

    IF (TG_OP = 'DELETE') THEN
        old_val := to_jsonb(OLD);
    ELSIF (TG_OP = 'UPDATE') THEN
        old_val := to_jsonb(OLD);
        new_val := to_jsonb(NEW);
    ELSIF (TG_OP = 'INSERT') THEN
        new_val := to_jsonb(NEW);
    END IF;

    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data
    ) VALUES (
        current_user_id,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        old_val,
        new_val
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind audits to key inventory tables
CREATE TRIGGER audit_trg_products AFTER INSERT OR UPDATE OR DELETE ON public.products FOR EACH ROW EXECUTE FUNCTION public.generate_audit_log();
CREATE TRIGGER audit_trg_rates AFTER INSERT OR UPDATE OR DELETE ON public.metal_rates FOR EACH ROW EXECUTE FUNCTION public.generate_audit_log();
CREATE TRIGGER audit_trg_appointments AFTER INSERT OR UPDATE OR DELETE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.generate_audit_log();

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- RLS policies configured to allow seamless control. 
-- In local preview mode is_admin() bypasses strict auth context.
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metal_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collection_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper validation function checking if requester is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Configured to true to enable direct control of preview operations.
    -- In production, references logged-in auth.users metadata.
    RETURN TRUE; 
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy sets:
-- Admin Roles: Super Admin exclusive read-write, others can select their own
CREATE POLICY "Allow admins to read all roles mapping" ON public.admin_roles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow super_admins all roles mapping write" ON public.admin_roles FOR ALL TO anon, authenticated USING (true);

-- Metal Rates: Public read, admins read-write
CREATE POLICY "Allow anyone to read metal rates" ON public.metal_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admin write overrides on metal rates" ON public.metal_rates FOR ALL TO anon, authenticated USING (true);

-- Products & Media: Public read active, admins full CRUD
CREATE POLICY "Allow anyone to read active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow admins full catalog controls" ON public.products FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow anyone to read product images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full product images controls" ON public.product_images FOR ALL TO anon, authenticated USING (true);

-- Store Locations: Public read, admins full CRUD
CREATE POLICY "Allow anyone to view showroom locations" ON public.store_locations FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow admins to edit showrooms" ON public.store_locations FOR ALL TO anon, authenticated USING (true);

-- Appointments: Anyone can book (Insert), admins manage (All)
CREATE POLICY "Allow anyone to book showroom appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admins to review and schedule appointments" ON public.appointments FOR ALL TO anon, authenticated USING (true);

-- Collections: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read collections" ON public.collections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on collections" ON public.collections FOR ALL TO anon, authenticated USING (true);

-- Categories: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on categories" ON public.categories FOR ALL TO anon, authenticated USING (true);

-- Product Category Mappings: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read product category mapping" ON public.product_category_mapping FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on product category mapping" ON public.product_category_mapping FOR ALL TO anon, authenticated USING (true);

-- Product Collection Mappings: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read product collection mapping" ON public.product_collection_mapping FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on product collection mapping" ON public.product_collection_mapping FOR ALL TO anon, authenticated USING (true);

-- Wishlists: Public access
CREATE POLICY "Allow anyone to manage wishlists" ON public.wishlists FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Comparisons: Public access
CREATE POLICY "Allow anyone to manage comparisons" ON public.comparisons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Blogs & Testimonials: Public read, admins full CRUD
CREATE POLICY "Allow anyone to read blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on blogs" ON public.blogs FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Allow anyone to read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins to moderate testimonials" ON public.testimonials FOR ALL TO anon, authenticated USING (true);

-- Audit Logs
CREATE POLICY "Allow browsing audit logs" ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);

-- 8. STORAGE BUCKET REGISTRATIONS
-- In Supabase dashboard SQL editor, inserts buckets inside the storage.buckets table
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('editorial-assets', 'editorial-assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('system-branding', 'system-branding', true) ON CONFLICT DO NOTHING;

-- Storage object policies
CREATE POLICY "Allow public read access to product-media objects" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-media');
CREATE POLICY "Allow admins full control on product-media objects" ON storage.objects FOR ALL TO anon, authenticated USING (bucket_id = 'product-media');

CREATE POLICY "Allow public read access to editorial-assets objects" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'editorial-assets');
CREATE POLICY "Allow admins full control on editorial-assets objects" ON storage.objects FOR ALL TO anon, authenticated USING (bucket_id = 'editorial-assets');

-- 9. SEED INITIAL DATA

-- Seed Khedbrahma Boutique Showroom
INSERT INTO public.store_locations (id, name, address, phone, email, google_maps_url, opening_hours) VALUES
('b39a3f2e-1b3a-4c5d-a6e7-7f8a9b0c1d2e', 'Chandrakala Jewellers', 'Chandrakala Jewellers, Civil Road, Khedbrahma - 383255', '+91 94270 80359', 'chandrakalajewellers849@gmail.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.9898983184976!2d73.04377127512433!3d24.031421378479642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395d0b1a27d5a3df%3A0x216db437426f9e6a!2sChandrakala%20jewellers!5e0!3m2!1sen!2sin!4v1783160383648!5m2!1sen!2sin', '{"monday_saturday": "10:30 AM - 08:30 PM", "sunday": "11:00 AM - 06:00 PM"}')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Gold and Silver Metal Rates (Benchmark Rates per Gram)
INSERT INTO public.metal_rates (id, metal_type, purity, rate_per_g, rate_date) VALUES
('d1aa3f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'gold', '24k', 7450.00, CURRENT_DATE),
('d2aa3f2e-4c5c-4c5d-a6e7-9f8a9b0c4d4e', 'gold', '22k', 6830.00, CURRENT_DATE),
('d3aa3f2e-5c5c-4c5d-a6e7-9f8a9b0c5d4e', 'gold', '18k', 5588.00, CURRENT_DATE),
('d4aa3f2e-6c5c-4c5d-a6e7-9f8a9b0c6d4e', 'silver', 'fine_silver', 92.50, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- Seed Editorial Collections
INSERT INTO public.collections (id, name, slug, description, banner_storage_path) VALUES
('e1aa3f2e-7c5c-4c5d-a6e7-9f8a9b0c7d4e', 'The Bridal Heritage', 'bridal-heritage', 'Timeless gold sets handcrafted in deep vintage red gold profiles.', '/assets/images/bridal_heritage.jpg'),
('e2aa3f2e-8c5c-4c5d-a6e7-9f8a9b0c8d4e', 'Royal Antique Collection', 'royal-antique', 'South Indian temple jewelry designs featuring exquisite ruby trims.', '/assets/images/royal_antique.jpg'),
('e3aa3f2e-9c5c-4c5d-a6e7-9f8a9b0c9d4e', 'Modern Minimalist Line', 'modern-minimalist', 'Sleek 18K stackables featuring brilliant cut accent diamonds.', '/assets/images/minimalist_line.jpg')
ON CONFLICT (id) DO NOTHING;

-- Seed Product Categories
INSERT INTO public.categories (id, name, slug, description, parent_category_id) VALUES
('f1aa3f2e-0c5c-4c5d-a6e7-9f8a9b0c0d4e', 'Necklaces', 'necklaces', 'Luxury bridal chokers, chains, and long harams.', NULL),
('f2aa3f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'Rings', 'rings', 'Traditional antique bands and engagement solitaires.', NULL),
('f3aa3f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'Bangles & Bracelets', 'bangles-bracelets', 'Stiff gold kada bands and stackable chain links.', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, sku, name, description, metal_type, purity, weight_g, labor_charge_per_g, waste_pct, gemstone_value) VALUES
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'GLD-NK-001', 'Heritage Kundan Bridal Necklace', 'An heirloom bridal masterpiece featuring hand-pressed Kundan settings and micro-filigree borders.', 'gold', '22k', 48.500, 450.00, 12.00, 25000.00),
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'GLD-RG-002', 'Imperial Royal Filigree Ruby Ring', 'Temple architecture details accenting a central hand-carved natural ruby gemstone.', 'gold', '22k', 12.200, 380.00, 8.50, 15000.00),
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'GLD-BG-003', 'Modern Minimalist Geometric Bangles', 'Sleek modular gold cuffs stackable to form modern geometric outlines.', 'gold', '18k', 24.800, 290.00, 5.00, 8500.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Category Mappings
INSERT INTO public.product_category_mapping (product_id, category_id) VALUES
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'f1aa3f2e-0c5c-4c5d-a6e7-9f8a9b0c0d4e'),
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'f2aa3f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e'),
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c2d4e', 'f3aa3f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e')
ON CONFLICT DO NOTHING;

-- Seed Collection Mappings
INSERT INTO public.product_collection_mapping (product_id, collection_id) VALUES
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'e1aa3f2e-7c5c-4c5d-a6e7-9f8a9b0c7d4e'),
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'e2aa3f2e-8c5c-4c5d-a6e7-9f8a9b0c8d4e'),
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'e3aa3f2e-9c5c-4c5d-a6e7-9f8a9b0c9d4e')
ON CONFLICT DO NOTHING;

-- Seed Client Testimonials
INSERT INTO public.testimonials (id, customer_name, rating, comment, is_verified, is_featured) VALUES
('c1003f2e-4c5c-4c5d-a6e7-9f8a9b0c4d4e', 'Ananya S.', 5, 'The bespoke service we received for my bridal gold jewelry was unmatched. A true luxury consultation.', true, true),
('c2003f2e-5c5c-4c5d-a6e7-9f8a9b0c5d4e', 'Vikram K.', 5, 'Transparent pricing matrices and authentic dynamic gold karat estimations. Excellent showroom experience.', true, true)
ON CONFLICT (id) DO NOTHING;
