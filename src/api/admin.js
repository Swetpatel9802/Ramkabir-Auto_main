import { supabase } from '@/lib/supabase';

/**
 * Fetch all tractors for admin dropdown (all statuses, not just available)
 */
export const fetchAllTractorsForAdmin = async () => {
    const { data, error } = await supabase
        .from('tractors')
        .select('id, make, model_number, manufacturing_date, number_plate, images, product_details, vehicle_type')
        .eq('status', 'available')
        .order('make', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
};

/**
 * Save product images and details for a specific tractor
 */
export const saveProductDetails = async (tractorId, images, productDetails) => {
    const { data, error } = await supabase
        .from('tractors')
        .update({
            images: images,
            product_details: productDetails,
        })
        .eq('id', tractorId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};
