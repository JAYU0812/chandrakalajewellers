-- PROJECT AURUM DATABASE INITIALIZATION MIGRATION
-- Migration Version: 20260704000000_init_schema
-- Target Schema: public, storage

-- 1. EXTENSIONS SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- 2. SCHEMA DEFINITIONS & TABLES

-- Administrative staff roles mapping
CREATE TABLE public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- References auth.users(id) in production Supabase Auth
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

-- Wishlists (Guest session caching supported in localstorage)
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Nullable to allow guest wishlist sessions to associate later
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

-- 3. INDEX OPTIMIZATIONS
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_metal_rates_lookup ON public.metal_rates(metal_type, purity, rate_date DESC);
CREATE INDEX idx_appointments_date_status ON public.appointments(appointment_date, status);
CREATE INDEX idx_audit_logs_lookup ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_product_images_order ON public.product_images(product_id, display_order);

-- 4. DYNAMIC PRICING VIEW
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
    -- Calculation: ((Weight * Daily Rate) * (1 + Wastage% / 100)) + (Weight * Labor) + Gemstone Value
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

-- 5. TRIGGER FUNCTIONS

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

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
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
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy sets:
-- Admin Roles: Super Admin exclusive read-write, others can select their own
CREATE POLICY "Allow admins to read all roles mapping" ON public.admin_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Allow users to read own roles mapping" ON public.admin_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow super_admins all roles mapping write" ON public.admin_roles FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Metal Rates: Public read, admins read-write
CREATE POLICY "Allow anyone to read metal rates" ON public.metal_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admin write overrides on metal rates" ON public.metal_rates FOR ALL TO authenticated USING (public.is_admin());

-- Products & Media: Public read active, admins full CRUD
CREATE POLICY "Allow anyone to read active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow admins full catalog controls" ON public.products FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Allow anyone to read product images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full product images controls" ON public.product_images FOR ALL TO authenticated USING (public.is_admin());

-- Store Locations: Public read, admins full CRUD
CREATE POLICY "Allow anyone to view showroom locations" ON public.store_locations FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow admins to edit showrooms" ON public.store_locations FOR ALL TO authenticated USING (public.is_admin());

-- Appointments: Anyone can book (Insert), admins manage (All)
CREATE POLICY "Allow anyone to book showroom appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admins to review and schedule appointments" ON public.appointments FOR ALL TO authenticated USING (public.is_admin());

-- Collections: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read collections" ON public.collections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on collections" ON public.collections FOR ALL TO authenticated USING (public.is_admin());

-- Categories: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin());

-- Product Category Mappings: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read product category mapping" ON public.product_category_mapping FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on product category mapping" ON public.product_category_mapping FOR ALL TO authenticated USING (public.is_admin());

-- Product Collection Mappings: Public read, admin full CRUD
CREATE POLICY "Allow anyone to read product collection mapping" ON public.product_collection_mapping FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on product collection mapping" ON public.product_collection_mapping FOR ALL TO authenticated USING (public.is_admin());

-- Wishlists: Public access
CREATE POLICY "Allow anyone to manage wishlists" ON public.wishlists FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Comparisons: Public access
CREATE POLICY "Allow anyone to manage comparisons" ON public.comparisons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Blogs & Testimonials: Public read, admins full CRUD
CREATE POLICY "Allow anyone to read blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins full control on blogs" ON public.blogs FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Allow anyone to read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admins to moderate testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin());

-- Audit Logs: Super Admin exclusive view, no updates/deletes permitted
CREATE POLICY "Allow super_admins to browse audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- 7. STORAGE BUCKET REGISTRATIONS
-- Registers buckets inside Supabase Storage core schema tables
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('editorial-assets', 'editorial-assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('system-branding', 'system-branding', true) ON CONFLICT DO NOTHING;

-- Storage object policies
CREATE POLICY "Allow public read access to product-media objects" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-media');
CREATE POLICY "Allow admins full control on product-media objects" ON storage.objects FOR ALL TO authenticated USING (
    bucket_id = 'product-media' AND public.is_admin()
);

CREATE POLICY "Allow public read access to editorial-assets objects" ON storage.objects FOR SELECT TO public USING (bucket_id = 'editorial-assets');
CREATE POLICY "Allow admins full control on editorial-assets objects" ON storage.objects FOR ALL TO authenticated USING (
    bucket_id = 'editorial-assets' AND public.is_admin()
);
