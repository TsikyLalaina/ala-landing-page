import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Upload, ShoppingBag, X } from 'lucide-react';

const CreateListing = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'MGA',
        category: 'vanilla',
        listing_type: 'fixed',
        quantity: '',
        min_order_quantity: '1',
        expires_at: '',
        image_urls: []
    });

    const categories = ['vanilla', 'spices', 'crafts', 'services'];
    const currencies = ['MGA', 'EUR', 'USD'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('marketplace')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('marketplace')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image_urls: [...prev.image_urls, data.publicUrl]
            }));
            
            toast.success('Image uploaded!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed (though unlikely immediately)
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price) {
            toast.error('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            const updates = {
                seller_id: user.id,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                currency: formData.currency,
                category: formData.category,
                listing_type: formData.listing_type,
                min_order_quantity: parseFloat(formData.min_order_quantity) || 1,
                image_urls: formData.image_urls.length > 0 ? formData.image_urls : null,
                status: 'active',
                quantity: formData.quantity ? parseFloat(formData.quantity) : null,
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
            };

            const { error } = await supabase
                .from('marketplace_listings')
                .insert(updates);

            if (error) throw error;
            toast.success('Listing created successfully!');
            navigate('/marketplace');
        } catch (error) {
            console.error('Error creating listing:', error);
            toast.error('Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 10, 
                background: 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', gap: 16
            }}>
                <button onClick={() => navigate('/marketplace')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Create Listing</h1>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    {/* Image Upload */}
                    <div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                        />
                        
                        {/* Image Preview Grid */}
                        {formData.image_urls.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginBottom: 16 }}>
                                {formData.image_urls.map((url, index) => (
                                    <div key={index} style={{ position: 'relative', height: 100, borderRadius: 12, overflow: 'hidden' }}>
                                        <img src={url} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            style={{
                                                position: 'absolute', top: 4, right: 4,
                                                background: 'transparent',
                                                border: 'none',
                                                padding: 4,
                                                cursor: 'pointer',
                                                zIndex: 10,
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                                            }}
                                        >
                                            <X size={24} color="white" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        <div 
                            onClick={handleImageUploadClick}
                            style={{ 
                                height: 120, 
                                background: 'rgba(13, 77, 58, 0.4)', 
                                border: '2px dashed #2E7D67', 
                                borderRadius: 16, 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#A7C7BC',
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin" size={32} />
                            ) : (
                                <>
                                    <Upload size={32} style={{ marginBottom: 8 }} />
                                    <span>{formData.image_urls.length > 0 ? 'Add Another Image' : 'Upload Product Image'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Premium Bourbon Vanilla"
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            required
                        />
                    </div>

                    {/* Unit Price & Currency */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Unit Price (per {formData.category === 'vanilla' || formData.category === 'spices' ? 'kg' : 'item'}) *
                            </label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g., 25000"
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                                required
                            />
                            <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>
                                Price for one {formData.category === 'vanilla' || formData.category === 'spices' ? 'kilogram' : 'item'}
                            </div>
                        </div>
                        <div style={{ flex: '1 1 120px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            >
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>



                    {/* Quantity & Minimum Order */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Total Quantity Available ({formData.category === 'vanilla' || formData.category === 'spices' ? 'kg' : 'items'})
                            </label>
                            <input
                                name="quantity"
                                type="number"
                                step="0.001"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="e.g., 5"
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            />
                            <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>
                                Total stock you have
                            </div>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Minimum Order ({formData.category === 'vanilla' || formData.category === 'spices' ? 'kg' : 'items'})
                            </label>
                            <input
                                name="min_order_quantity"
                                type="number"
                                step="0.001"
                                value={formData.min_order_quantity}
                                onChange={handleInputChange}
                                placeholder="e.g., 1"
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            />
                            <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>
                                Minimum amount a buyer can purchase
                            </div>
                        </div>
                    </div>

                    {/* Total Price Calculation (if quantity is set) */}
                    {formData.price && formData.quantity && (
                        <div style={{ 
                            background: 'rgba(74, 222, 128, 0.1)', 
                            border: '1px solid #4ADE80', 
                            borderRadius: 12, 
                            padding: 16,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: 14, color: '#A7C7BC', marginBottom: 4 }}>Total Value</div>
                                <div style={{ fontSize: 12, color: '#A7C7BC' }}>
                                    {formData.quantity} × {parseFloat(formData.price).toLocaleString()} {formData.currency}
                                </div>
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4ADE80' }}>
                                {(parseFloat(formData.price) * parseFloat(formData.quantity)).toLocaleString()} {formData.currency}
                            </div>
                        </div>
                    )}

                    {/* Category & Type */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Listing Type</label>
                            <select
                                name="listing_type"
                                value={formData.listing_type}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                            >
                                <option value="fixed">Fixed Price</option>
                                <option value="auction">Auction (Bidding)</option>
                            </select>
                        </div>
                    </div>

                    {/* Expires At (Auction Only or Optional for Fixed) */}
                    {formData.listing_type === 'auction' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Auction Ends At *</label>
                            <input
                                name="expires_at"
                                type="datetime-local"
                                value={formData.expires_at}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' }}
                                required={formData.listing_type === 'auction'}
                            />
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your item..."
                            rows={5}
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, resize: 'vertical', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || uploading}
                        style={{ 
                            background: '#4ADE80', color: '#0B3D2E', border: 'none', 
                            borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            opacity: (loading || uploading) ? 0.7 : 1
                        }}
                    >
                         {loading ? <Loader2 className="animate-spin" /> : <ShoppingBag />}
                         List Item
                    </button>
                </form>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default CreateListing;
