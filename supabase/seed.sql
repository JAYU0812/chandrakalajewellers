-- PROJECT AURUM DATABASE SEED SCRIPT
-- Target schema: public

-- 1. SEED STORE SHOWROOMS
INSERT INTO public.store_locations (id, name, address, phone, email, google_maps_url, opening_hours) VALUES
('b39a3f2e-1b3a-4c5d-a6e7-7f8a9b0c1d2e', 'Chennai Flagship Showroom', '101 Cathedral Road, Alwarpet, Chennai - 600086', '+91 44 2811 4040', 'chennai@chandrakalajewellers.com', 'https://maps.google.com/?cid=12345', '{"monday_friday": "10:30 AM - 08:30 PM", "saturday_sunday": "10:30 AM - 09:00 PM"}'),
('c49a3f2e-2b4b-4c5d-a6e7-8f8a9b0c2d3e', 'Bengaluru Boutique', '45 Lavelle Road, Richmond Town, Bengaluru - 560001', '+91 80 4122 3030', 'blr@chandrakalajewellers.com', 'https://maps.google.com/?cid=67890', '{"monday_friday": "11:00 AM - 08:00 PM", "saturday_sunday": "11:00 AM - 08:30 PM"}')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED INITIAL COMMODITY RATES (Per Gram)
INSERT INTO public.metal_rates (id, metal_type, purity, rate_per_g, rate_date) VALUES
('d1aa3f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'gold', '24k', 7450.00, CURRENT_DATE),
('d2aa3f2e-4c5c-4c5d-a6e7-9f8a9b0c4d4e', 'gold', '22k', 6830.00, CURRENT_DATE),
('d3aa3f2e-5c5c-4c5d-a6e7-9f8a9b0c5d4e', 'gold', '18k', 5588.00, CURRENT_DATE),
('d4aa3f2e-6c5c-4c5d-a6e7-9f8a9b0c6d4e', 'silver', 'fine_silver', 92.50, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED EDITORIAL COLLECTIONS
INSERT INTO public.collections (id, name, slug, description, banner_storage_path) VALUES
('e1aa3f2e-7c5c-4c5d-a6e7-9f8a9b0c7d4e', 'The Bridal Heritage', 'bridal-heritage', 'Timeless gold sets handcrafted in deep vintage red gold profiles.', '/assets/images/bridal_heritage.jpg'),
('e2aa3f2e-8c5c-4c5d-a6e7-9f8a9b0c8d4e', 'Royal Antique Collection', 'royal-antique', 'South Indian temple jewelry designs featuring exquisite ruby trims.', '/assets/images/royal_antique.jpg'),
('e3aa3f2e-9c5c-4c5d-a6e7-9f8a9b0c9d4e', 'Modern Minimalist Line', 'modern-minimalist', 'Sleek 18K stackables featuring brilliant cut accent diamonds.', '/assets/images/minimalist_line.jpg')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PRODUCT CATEGORIES
INSERT INTO public.categories (id, name, slug, description, parent_category_id) VALUES
('f1aa3f2e-0c5c-4c5d-a6e7-9f8a9b0c0d4e', 'Necklaces', 'necklaces', 'Luxury bridal chokers, chains, and long harams.', NULL),
('f2aa3f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'Rings', 'rings', 'Traditional antique bands and engagement solitaires.', NULL),
('f3aa3f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'Bangles & Bracelets', 'bangles-bracelets', 'Stiff gold kada bands and stackable chain links.', NULL)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PRODUCTS (Matching assets)
INSERT INTO public.products (id, sku, name, description, metal_type, purity, weight_g, labor_charge_per_g, waste_pct, gemstone_value) VALUES
-- 1. Bridal Heritage Kundan Necklace (Gold 22k, 48.5g)
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'GLD-NK-001', 'Heritage Kundan Bridal Necklace', 'An heirloom bridal masterpiece featuring hand-pressed Kundan settings and micro-filigree borders.', 'gold', '22k', 48.500, 450.00, 12.00, 25000.00),

-- 2. Imperial Royal Antique Ring (Gold 22k, 12.2g)
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'GLD-RG-002', 'Imperial Royal Filigree Ruby Ring', 'Temple architecture details accenting a central hand-carved natural ruby gemstone.', 'gold', '22k', 12.200, 380.00, 8.50, 15000.00),

-- 3. Modern Minimalist geometric bangles stack (Gold 18k, 24.8g)
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'GLD-BG-003', 'Modern Minimalist Geometric Bangles', 'Sleek modular gold cuffs stackable to form modern geometric outlines.', 'gold', '18k', 24.800, 290.00, 5.00, 8500.00)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED CATALOG ASSIGNMENT MAPS
-- Category maps
INSERT INTO public.product_category_mapping (product_id, category_id) VALUES
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'f1aa3f2e-0c5c-4c5d-a6e7-9f8a9b0c0d4e'),
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'f2aa3f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e'),
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'f3aa3f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e')
ON CONFLICT DO NOTHING;

-- Collection maps
INSERT INTO public.product_collection_mapping (product_id, collection_id) VALUES
('a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', 'e1aa3f2e-7c5c-4c5d-a6e7-9f8a9b0c7d4e'),
('a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', 'e2aa3f2e-8c5c-4c5d-a6e7-9f8a9b0c8d4e'),
('a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', 'e3aa3f2e-9c5c-4c5d-a6e7-9f8a9b0c9d4e')
ON CONFLICT DO NOTHING;

-- 7. SEED CLIENT TESTIMONIALS
INSERT INTO public.testimonials (id, customer_name, rating, comment, is_verified, is_featured) VALUES
('c1003f2e-4c5c-4c5d-a6e7-9f8a9b0c4d4e', 'Ananya S.', 5, 'The bespoke service we received for my bridal gold jewelry was unmatched. A true luxury consultation.', true, true),
('c2003f2e-5c5c-4c5d-a6e7-9f8a9b0c5d4e', 'Vikram K.', 5, 'Transparent pricing matrices and authentic dynamic gold karat estimations. Excellent showroom experience.', true, true)
ON CONFLICT (id) DO NOTHING;
