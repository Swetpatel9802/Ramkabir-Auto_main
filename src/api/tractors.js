import { supabase } from '@/lib/supabase';

// Helper to parse images from various DB formats
const parseImages = (images) => {
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
        try {
            return JSON.parse(images);
        } catch (e) {
            return [images];
        }
    }
    return [];
};

// Feature ID to display label mapping
const featureLabels = {
    en: {
        power_steering: 'Power Steering', '4wd': '4WD', new_battery: 'New Battery',
        recently_serviced: 'Recently Serviced', finance_available: 'Finance Available',
        single_owner: 'Single Owner', new_tyres: 'New Tyres', ac_cabin: 'AC Cabin',
        warranty: 'Warranty Available', verified: 'Verified Inspection',
    },
    gu: {
        power_steering: 'પાવર સ્ટીયરિંગ', '4wd': '4WD', new_battery: 'નવી બેટરી',
        recently_serviced: 'તાજેતરમાં સર્વિસ', finance_available: 'ફાઇનાન્સ ઉપલબ્ધ',
        single_owner: 'એક માલિક', new_tyres: 'નવા ટાયર', ac_cabin: 'AC કેબિન',
        warranty: 'વોરંટી ઉપલબ્ધ', verified: 'ચકાસાયેલ નિરીક્ષણ',
    }
};

// Helper to map DB row to UI-friendly object
const mapTractorToUI = (tractor) => {
    const details = tractor.product_details || {};
    const hasCustomFeatures = details.features && details.features.length > 0;

    // Build features from product_details if available
    const buildFeatures = (lang) => {
        if (hasCustomFeatures) {
            return details.features.map(fId => featureLabels[lang]?.[fId] || fId);
        }
        // Fallback to auto-generated
        return lang === 'en'
            ? [`Model Year: ${tractor.manufacturing_date || 'N/A'}`, `Engine Hours: ${tractor.engine_hours || 'N/A'}`, "Verified Inspection", "Finance Available"]
            : [`મોડેલ વર્ષ: ${tractor.manufacturing_date || 'N/A'}`, `એન્જિન કલાકો: ${tractor.engine_hours || 'N/A'}`, "ચકાસાયેલ નિરીક્ષણ", "ફાઇનાન્સ ઉપલબ્ધ"];
    };

    return {
        id: tractor.id,
        vehicleType: tractor.vehicle_type || 'Other',
        brand: tractor.make || 'Unknown Brand',
        numberPlate: tractor.number_plate || '',
        model: {
            en: tractor.model_number || tractor.model_name || 'Unknown Model',
            gu: tractor.model_number || tractor.model_name || 'અજ્ઞાત મોડેલ'
        },
        images: parseImages(tractor.images).length > 0
            ? parseImages(tractor.images)
            : ['/images/placeholder.jpg'],
        specs: {
            manufacturing_date: tractor.manufacturing_date || tractor.parsing_year || 'N/A',
            engine_hours: tractor.engine_hours || 'N/A'
        },
        features: {
            en: buildFeatures('en'),
            gu: buildFeatures('gu'),
        },
        productDetails: details,
    };
};

// Fetch all available products (original function)
export const fetchTractors = async () => {
    const { data, error } = await supabase
        .from('tractors')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapTractorToUI);
};

// Fetch distinct brands for a given vehicle_type (Tractor, Trolley, Other)
export const fetchBrandsByCategory = async (vehicleType) => {
    const { data, error } = await supabase
        .from('tractors')
        .select('make')
        .eq('vehicle_type', vehicleType)
        .eq('status', 'available');

    if (error) throw new Error(error.message);

    // Extract unique brand names
    const brands = [...new Set(data.map(item => item.make).filter(Boolean))];
    return brands.sort();
};

// Fetch all available products grouped by vehicle_type
export const fetchAllInventory = async () => {
    const { data, error } = await supabase
        .from('tractors')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    const grouped = { Tractor: [], Trolley: [], Other: [] };
    data.forEach(item => {
        const type = item.vehicle_type || 'Other';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(mapTractorToUI(item));
    });
    return grouped;
};

// Fetch all available products for a specific brand & vehicle type
export const fetchProductsByBrand = async (vehicleType, brand) => {
    const { data, error } = await supabase
        .from('tractors')
        .select('*')
        .eq('vehicle_type', vehicleType)
        .eq('make', brand)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapTractorToUI);
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
    const { data, error } = await supabase
        .from('tractors')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return mapTractorToUI(data);
};
