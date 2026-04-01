import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Save, Loader2, Check, Lock, ChevronDown, LogOut, AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTractorsForAdmin, saveProductDetails } from '@/api/admin';
import { uploadImage } from '@/api/cloudinary';
import { supabase } from '@/lib/supabase';

// Feature options for checkboxes
const FEATURE_OPTIONS = [
    { id: 'power_steering', label: 'Power Steering', labelGu: 'પાવર સ્ટીયરિંગ' },
    { id: '4wd', label: '4WD', labelGu: '4 વ્હીલ ડ્રાઇવ' },
    { id: 'new_battery', label: 'New Battery', labelGu: 'નવી બેટરી' },
    { id: 'finance_available', label: 'Finance Available', labelGu: 'ફાઇનાન્સ ઉપલબ્ધ' },
    { id: 'single_owner', label: 'Single Owner', labelGu: 'એક માલિક' },
    { id: 'new_tyres', label: 'New Tyres', labelGu: 'નવા ટાયર' },
    { id: 'remould_tyres', label: 'Remould Tyres', labelGu: 'રીમોલ્ડ ટાયર' },
];

const CONDITION_OPTIONS = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'needs_repair', label: 'Needs Repair' },
];

const TYRE_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: '80+', label: '80%+' },
    { value: '50-80', label: '50–80%' },
    { value: 'below_50', label: 'Below 50%' },
    { value: 'remould', label: 'Remould' },
];

const ENGINE_OPTIONS = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'average', label: 'Average' },
    { value: 'needs_repairing', label: 'Needs Repairing' },
];

export default function Admin() {
    // Auth state
    const [session, setSession] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    // Data state
    const [tractors, setTractors] = useState([]);
    const [selectedTractorId, setSelectedTractorId] = useState('');
    const [loading, setLoading] = useState(true);

    // Image state
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Product details state
    const [condition, setCondition] = useState('');
    const [tyreCondition, setTyreCondition] = useState('');
    const [engineCondition, setEngineCondition] = useState('');
    const [hp, setHp] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [customNotes, setCustomNotes] = useState('');

    // Save state
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Restore session on mount + listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setLoginError('Invalid email or password. Please try again.');
            setPassword('');
        }
        setLoginLoading(false);
    };

    // Sign out handler
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSelectedTractorId('');
        setImages([]);
        setTractors([]);
    };

    // Load tractors once authenticated
    useEffect(() => {
        if (!session) return;
        setLoading(true);
        const load = async () => {
            try {
                const data = await fetchAllTractorsForAdmin();
                setTractors(data);
            } catch (err) {
                console.error('Failed to load tractors:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [session]);

    // When a tractor is selected, load its existing data
    useEffect(() => {
        if (!selectedTractorId) return;
        const tractor = tractors.find(t => t.id === selectedTractorId);
        if (!tractor) return;

        // Load existing images
        setImages(Array.isArray(tractor.images) ? tractor.images : []);

        // Load existing product_details
        const details = tractor.product_details || {};
        setCondition(details.condition || '');
        setTyreCondition(details.tyre_condition || '');
        setEngineCondition(details.engine_condition || '');
        setHp(details.hp || '');
        setSelectedFeatures(details.features || []);
        setCustomNotes(details.custom_notes || '');
        setSaveSuccess(false);
        setSaveError('');
    }, [selectedTractorId, tractors]);

    // Image upload
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const tractor = tractors.find(t => t.id === selectedTractorId);
            const tractorInfo = {
                make: tractor?.make || '',
                model: tractor?.model_number || '',
                year: tractor?.manufacturing_date || '',
            };
            const uploadedUrls = [];
            for (const file of files) {
                const url = await uploadImage(file, tractorInfo);
                uploadedUrls.push(url);
            }
            setImages(prev => [...prev, ...uploadedUrls]);
        } catch (err) {
            alert('Image upload failed: ' + err.message);
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Toggle feature
    const toggleFeature = (featureId) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId)
                ? prev.filter(f => f !== featureId)
                : [...prev, featureId]
        );
    };

    // Save
    const handleSave = async () => {
        if (!selectedTractorId) return;
        setSaving(true);
        setSaveSuccess(false);
        setSaveError('');

        const productDetails = {
            condition,
            tyre_condition: tyreCondition,
            engine_condition: engineCondition,
            hp,
            features: selectedFeatures,
            custom_notes: customNotes,
        };

        try {
            await saveProductDetails(selectedTractorId, images, productDetails);
            setSaveSuccess(true);
            // Update local state
            setTractors(prev => prev.map(t =>
                t.id === selectedTractorId
                    ? { ...t, images, product_details: productDetails }
                    : t
            ));
            // Show success briefly, then reset to product selector
            setTimeout(() => {
                setSaveSuccess(false);
                setSelectedTractorId('');
                setImages([]);
                setCondition('');
                setTyreCondition('');
                setEngineCondition('');
                setHp('');
                setSelectedFeatures([]);
                setCustomNotes('');
            }, 1500);
        } catch (err) {
            setSaveError('Failed to save: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Checking session on first load
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#1e3a5f] animate-spin" />
            </div>
        );
    }

    // Login Gate
    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-black text-center mb-8"
                    style={{
                        background: 'linear-gradient(135deg, #2d5a3d 0%, #1e3a5f 40%, #60a5fa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Ramkabir<br />Auto
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm"
                >
                    <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-[#1e3a5f] mb-1 text-center">Admin Access</h1>
                    <p className="text-slate-500 text-sm mb-6 text-center">Sign in to manage products</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full border-2 border-slate-200 focus:border-[#1e3a5f] rounded-xl px-4 py-3 outline-none transition-colors text-sm font-medium"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border-2 border-slate-200 focus:border-[#1e3a5f] rounded-xl px-4 py-3 outline-none transition-colors text-sm font-medium"
                            />
                        </div>

                        {loginError && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-[#1e3a5f] hover:bg-[#152a45] disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {loginLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-[#1e3a5f] text-sm font-medium transition-colors py-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    const selectedTractor = tractors.find(t => t.id === selectedTractorId);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
            {/* Header */}
            <div className="bg-[#1e3a5f] text-white px-6 py-6">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black">🚜 Product Manager</h1>
                        <p className="text-white/60 text-sm mt-1">{session?.user?.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Tractor Selector */}
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Select Product</label>
                    {loading ? (
                        <div className="flex items-center gap-2 text-slate-400 py-3">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={selectedTractorId}
                                onChange={(e) => setSelectedTractorId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium text-[#1e3a5f] focus:border-[#1e3a5f] outline-none transition-colors"
                            >
                                <option value="">— Choose a product —</option>
                                {tractors.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.make} {t.model_number} • {t.manufacturing_date || 'N/A'}{t.number_plate ? ` • ${t.number_plate}` : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Rest of form — only when a tractor is selected */}
                <AnimatePresence>
                    {selectedTractorId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="space-y-6"
                        >
                            {/* Photos Section */}
                            <div className="bg-white rounded-2xl shadow-md p-5">
                                <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">📸 Photos</h2>

                                {/* Image Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Photo Button */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#e85d04] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#e85d04] transition-colors"
                                    >
                                        {uploading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Camera className="w-6 h-6" />
                                                <span className="text-xs font-medium">Add</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <p className="text-xs text-slate-400">Tap "Add" to take a photo or pick from gallery</p>
                            </div>

                            {/* Product Details Form */}
                            <div className="bg-white rounded-2xl shadow-md p-5 space-y-5">
                                <h2 className="text-lg font-bold text-[#1e3a5f]">📋 Product Details</h2>

                                {/* Condition Dropdowns */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Overall Condition */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Overall Condition</label>
                                        <select
                                            value={condition}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-[#1e3a5f] outline-none"
                                        >
                                            <option value="">Select...</option>
                                            {CONDITION_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tyre Condition */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tyre Condition</label>
                                        <select
                                            value={tyreCondition}
                                            onChange={(e) => setTyreCondition(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-[#1e3a5f] outline-none"
                                        >
                                            <option value="">Select...</option>
                                            {TYRE_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Engine Condition */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Engine Condition</label>
                                        <select
                                            value={engineCondition}
                                            onChange={(e) => setEngineCondition(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:border-[#1e3a5f] outline-none"
                                        >
                                            <option value="">Select...</option>
                                            {ENGINE_OPTIONS.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* HP */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Horsepower (HP)</label>
                                    <input
                                        type="text"
                                        value={hp}
                                        onChange={(e) => setHp(e.target.value)}
                                        placeholder="e.g. 34 HP"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#1e3a5f] outline-none"
                                    />
                                </div>

                                {/* Features Checkboxes */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">Features</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {FEATURE_OPTIONS.map(feature => (
                                            <button
                                                key={feature.id}
                                                type="button"
                                                onClick={() => toggleFeature(feature.id)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${selectedFeatures.includes(feature.id)
                                                    ? 'bg-[#2d5a3d]/10 text-[#2d5a3d] border border-[#2d5a3d]/30'
                                                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${selectedFeatures.includes(feature.id)
                                                    ? 'bg-[#2d5a3d] text-white'
                                                    : 'bg-white border border-slate-300'
                                                    }`}>
                                                    {selectedFeatures.includes(feature.id) && <Check className="w-3 h-3" />}
                                                </div>
                                                {feature.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Notes */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Custom Notes</label>
                                    <textarea
                                        value={customNotes}
                                        onChange={(e) => setCustomNotes(e.target.value)}
                                        placeholder="Any additional details... (e.g. Rotavator included, single owner, etc.)"
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#1e3a5f] outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={saving}
                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 ${saveSuccess
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[#e85d04] hover:bg-[#d14f00] text-white shadow-[#e85d04]/30'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : saveSuccess ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Saved Successfully!
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Details
                                    </>
                                )}
                            </motion.button>

                            {saveError && (
                                <p className="text-red-500 text-sm text-center">{saveError}</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
