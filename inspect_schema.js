import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mansiokdenoabynekagp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbnNpb2tkZW5vYWJ5bmVrYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTI5OTUsImV4cCI6MjA4MjYyODk5NX0.ybctugXomq-4_cixTRWgGrjFfdaiy2FEoubHSq5sSlY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    const { data, error } = await supabase
        .from('tractors')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        if (data.length > 0) {
            console.log('Keys in "tractors" table:');
            console.log(Object.keys(data[0]));
            console.log('Sample Data:', data[0]);
        } else {
            console.log('Table "tractors" is empty.');
        }
    }
}

inspectSchema();
