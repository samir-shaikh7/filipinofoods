import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mbbvlutzmlnbdizsgltx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iYnZsdXR6bWxuYmRpenNnbHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDEyMzAsImV4cCI6MjA5ODkxNzIzMH0.tllqtutZ-uDP1A9uXew0H_bXdQC_x7KupA2gy6L1Kvw'
);

async function main() {
  const { data, error } = await supabase.from('menu_items').select('image').limit(5);
  console.log("Menu Items:", data);

  const { data: settings } = await supabase.from('settings').select('logo_url').limit(1);
  console.log("Settings:", settings);
}

main();
