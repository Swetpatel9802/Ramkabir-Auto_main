import { supabase } from '@/lib/supabase';

// Submit a new review
export const submitReview = async ({ name, location, text, rating }) => {
    const { data, error } = await supabase
        .from('reviews')
        .insert([{ name, location, text, rating }])
        .select();

    if (error) throw new Error(error.message);
    return data[0];
};

// Fetch all reviews, newest first
export const fetchReviews = async () => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};
