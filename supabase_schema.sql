-- 1. Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 3) NOT NULL,
    category TEXT NOT NULL,
    section_id TEXT,
    section_slug TEXT,
    section_name TEXT,
    image TEXT,
    badge TEXT,
    spice_level INTEGER DEFAULT 1,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    veg BOOLEAN DEFAULT false
);

-- 2. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY, -- e.g., 'main_config'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    whatsapp_number TEXT,
    call_number TEXT,
    support_email TEXT
);

-- 3. Insert Initial Settings
INSERT INTO settings (id, whatsapp_number, call_number, support_email)
VALUES (
    'main_config', 
    '639999999999', 
    '+63 999 999 9999', 
    'kumusta@filipinofood.ph'
) ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Access Policies (Read Only)
CREATE POLICY "Public Read Access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON settings FOR SELECT USING (true);

-- 6. Create Admin Policies (Full Access for Authenticated Users)
CREATE POLICY "Admin Full Access" ON menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access" ON settings FOR ALL TO authenticated USING (true);

-- 7. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON reviews FOR ALL TO authenticated USING (true);

