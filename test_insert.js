const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://hwyycyzoobdyhhsqmzaf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eXljeXpvb2JkeWhoc3FtemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzMzNTcsImV4cCI6MjA1NjcwOTM1N30.Tk-TH45ias_nTkXHcwogu4mRscLkqzoJ0pCmUxKPDvI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data to insert
const testData = {
  delivery_number: '654321',
  recipient_name: '測試用戶2',
  recipient_phone: '0987654321',
  delivery_address: '測試地址2',
  package_description: '測試包裹2',
  estimated_delivery_time: '2025-03-05T13:00',
  additional_notes: '測試備註2'
};

// Insert data into Supabase
async function insertData() {
  const { data, error } = await supabase
    .from('deliveries')
    .insert([testData]);

  console.log('Data:', data);
  console.error('Error:', error);
}

// Execute the insert function
insertData();
