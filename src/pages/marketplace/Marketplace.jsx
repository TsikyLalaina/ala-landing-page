import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, ArrowLeft, MoreHorizontal, ShoppingBag, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const Marketplace = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all'); // all, vanilla, spices, crafts, services

    useEffect(() => {
        fetchListings();
    }, [category]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('marketplace_listings')
                .select('*, seller:users!marketplace_listings_seller_id_fkey(name, avatar_url, location)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) throw error;
            setListings(data || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
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
                padding: '12px 16px',
                borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 8
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4 }}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap' }}>Marketplace</h1>
                </div>
                {user && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button 
                            onClick={() => navigate('/my-orders')}
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#A7C7BC', border: 'none', borderRadius: 20, padding: '7px 10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12 }}
                        >
                            <Package size={15} /> <span>Orders</span>
                        </button>
                        <button 
                            onClick={() => navigate('/create-listing')}
                            style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 20, padding: '7px 10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12 }}
                        >
                            <Plus size={16} /> <span>Sell</span>
                        </button>
                    </div>
                )}
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                {/* Categories */}
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
                    {['all', 'vanilla', 'spices', 'mining', 'crafts', 'services'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            style={{
                                background: category === cat ? '#4ADE80' : 'rgba(255, 255, 255, 0.1)',
                                color: category === cat ? '#0B3D2E' : '#A7C7BC',
                                border: 'none', borderRadius: 20, padding: '8px 16px',
                                cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'capitalize', fontWeight: 'bold'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Listings Grid */}
                {loading ? (
                     <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Loader2 style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : listings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
                        <ShoppingBag size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p>No listings found in this category.</p>
                        {user && <button onClick={() => navigate('/create-listing')} style={{ marginTop: 16, background: 'transparent', border: '1px solid #4ADE80', color: '#4ADE80', padding: '8px 16px', borderRadius: 20, cursor: 'pointer' }}>List an item</button>}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {listings.map(item => {
                            const isExpired = item.expires_at && new Date(item.expires_at) < new Date();
                            return (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/listing/${item.id}`)}
                                style={{
                                    background: 'rgba(13, 77, 58, 0.6)', borderRadius: 16, overflow: 'hidden',
                                    border: '1px solid rgba(46, 125, 103, 0.5)', cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    opacity: isExpired ? 0.6 : 1
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div style={{ height: 180, background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                                    {item.image_urls && item.image_urls[0] ? (
                                        <img src={item.image_urls[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <ShoppingBag size={48} color="rgba(255,255,255,0.2)" />
                                    )}
                                    {isExpired && (
                                        <div style={{ position: 'absolute', top: 8, left: 8, background: '#F59E0B', color: '#0B3D2E', fontSize: 10, fontWeight: 'bold', padding: '2px 8px', borderRadius: 8, textTransform: 'uppercase' }}>Expired</div>
                                    )}
                                </div>
                                <div style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, color: '#F2F1EE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{item.title}</h3>
                                        <span style={{ background: isExpired ? '#F59E0B' : '#4ADE80', color: '#0B3D2E', fontSize: 12, fontWeight: 'bold', padding: '2px 8px', borderRadius: 12 }}>
                                            {isExpired ? 'Expired' : item.listing_type === 'auction' ? 'Bid' : 'Buy'}
                                        </span>
                                    </div>
                                    <p style={{ color: '#A7C7BC', fontSize: 14, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 40 }}>
                                        {item.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: 18, color: '#4ADE80' }}>
                                            {item.price.toLocaleString()} <span style={{ fontSize: 12 }}>{item.currency}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            Listing by {item.seller?.name?.split(' ')[0]}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
