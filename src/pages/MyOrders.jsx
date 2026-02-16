import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Package, ShoppingBag, Store, 
    Check, X, Clock, User, ChevronRight
} from 'lucide-react';

const STATUS_COLORS = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', label: 'Pending' },
    accepted: { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', label: 'Accepted' },
    denied: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', label: 'Denied' },
    completed: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA', label: 'Completed' },
    cancelled: { bg: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', label: 'Cancelled' },
};

const MyOrders = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [tab, setTab] = useState('purchases'); // 'purchases' or 'sales'
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user, tab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('transactions')
                .select(`
                    *,
                    listing:marketplace_listings!transactions_listing_id_fkey(id, title, image_urls, category, price, currency),
                    buyer:users!transactions_buyer_id_fkey(id, name, avatar_url),
                    seller:users!transactions_seller_id_fkey(id, name, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (tab === 'purchases') {
                query = query.eq('buyer_id', user.id);
            } else {
                query = query.eq('seller_id', user.id);
            }

            const { data, error } = await query;
            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (txId, action) => {
        try {
            const tx = transactions.find(t => t.id === txId);

            if (action === 'accept') {
                const { error: txError } = await supabase
                    .from('transactions')
                    .update({ status: 'accepted', updated_at: new Date().toISOString() })
                    .eq('id', txId);
                if (txError) throw txError;

                // Reduce stock
                if (tx.listing) {
                    const { data: currentListing } = await supabase
                        .from('marketplace_listings')
                        .select('quantity')
                        .eq('id', tx.listing.id)
                        .single();
                    
                    if (currentListing?.quantity != null) {
                        const newQty = Math.max(0, currentListing.quantity - tx.quantity);
                        await supabase.from('marketplace_listings').update({
                            quantity: newQty,
                            ...(newQty <= 0 ? { status: 'sold', sold_at: new Date().toISOString() } : {})
                        }).eq('id', tx.listing.id);
                    }
                }

                toast.success('Order accepted! Stock updated.');
            } else if (action === 'deny') {
                const { error } = await supabase
                    .from('transactions')
                    .update({ status: 'denied', updated_at: new Date().toISOString() })
                    .eq('id', txId);
                if (error) throw error;
                toast.success('Order denied.');
            } else if (action === 'cancel') {
                const { error } = await supabase
                    .from('transactions')
                    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                    .eq('id', txId);
                if (error) throw error;
                toast.success('Request cancelled.');
            }

            fetchOrders();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Action failed');
        }
    };

    const unit = (category) => 
        category === 'vanilla' || category === 'spices' || category === 'mining' ? 'kg' : 'items';

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
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>My Orders</h1>
            </div>

            <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 }}>
                    <button 
                        onClick={() => setTab('purchases')}
                        style={{ 
                            flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', 
                            background: tab === 'purchases' ? '#4ADE80' : 'transparent', 
                            color: tab === 'purchases' ? '#0B3D2E' : '#A7C7BC',
                            fontWeight: 'bold', fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        <ShoppingBag size={16} /> My Purchases
                    </button>
                    <button 
                        onClick={() => setTab('sales')}
                        style={{ 
                            flex: 1, padding: '12px 16px', borderRadius: 10, border: 'none', 
                            background: tab === 'sales' ? '#4ADE80' : 'transparent', 
                            color: tab === 'sales' ? '#0B3D2E' : '#A7C7BC',
                            fontWeight: 'bold', fontSize: 14, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}
                    >
                        <Store size={16} /> My Sales
                    </button>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Loader2 style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
                        <Package size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p>{tab === 'purchases' ? 'No purchases yet.' : 'No incoming orders yet.'}</p>
                        {tab === 'purchases' && (
                            <button onClick={() => navigate('/marketplace')} style={{ marginTop: 16, background: 'transparent', border: '1px solid #4ADE80', color: '#4ADE80', padding: '8px 16px', borderRadius: 20, cursor: 'pointer' }}>
                                Browse Marketplace
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {transactions.map(tx => {
                            const st = STATUS_COLORS[tx.status] || STATUS_COLORS.pending;
                            const counterparty = tab === 'purchases' ? tx.seller : tx.buyer;
                            const listingUnit = unit(tx.listing?.category);

                            return (
                                <div 
                                    key={tx.id} 
                                    style={{ 
                                        background: 'rgba(13, 77, 58, 0.5)', borderRadius: 16,
                                        border: '1px solid rgba(46, 125, 103, 0.4)', overflow: 'hidden'
                                    }}
                                >
                                    <div 
                                        onClick={() => tx.listing && navigate(`/listing/${tx.listing.id}`)}
                                        style={{ display: 'flex', gap: 14, padding: 16, cursor: tx.listing ? 'pointer' : 'default', alignItems: 'center' }}
                                    >
                                        {/* Listing Thumbnail */}
                                        <div style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {tx.listing?.image_urls?.[0] ? (
                                                <img src={tx.listing.image_urls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ShoppingBag size={24} color="rgba(255,255,255,0.3)" />
                                            )}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {tx.listing?.title || 'Deleted Listing'}
                                            </div>
                                            <div style={{ fontSize: 13, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                <span>{tx.quantity} {listingUnit}</span>
                                                <span>•</span>
                                                <span style={{ fontWeight: 'bold', color: '#4ADE80' }}>{tx.amount?.toLocaleString()} {tx.currency}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: '#A7C7BC', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {counterparty?.avatar_url ? (
                                                    <img src={counterparty.avatar_url} style={{ width: 14, height: 14, borderRadius: '50%' }} alt="" />
                                                ) : (
                                                    <User size={10} />
                                                )}
                                                {tab === 'purchases' ? 'Seller' : 'Buyer'}: {counterparty?.name || 'Unknown'}
                                                <span style={{ marginLeft: 8 }}>{new Date(tx.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                                            <span style={{ 
                                                background: st.bg, color: st.color, 
                                                fontSize: 11, fontWeight: 'bold', 
                                                padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase' 
                                            }}>
                                                {st.label}
                                            </span>
                                            <ChevronRight size={16} color="#A7C7BC" />
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    {tx.status === 'pending' && (
                                        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                            {tab === 'sales' && (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleAction(tx.id, 'accept'); }}
                                                        style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid #4ADE80', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#4ADE80', fontSize: 12, fontWeight: 'bold' }}
                                                    >
                                                        <Check size={14} /> Accept
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleAction(tx.id, 'deny'); }}
                                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: 12, fontWeight: 'bold' }}
                                                    >
                                                        <X size={14} /> Deny
                                                    </button>
                                                </>
                                            )}
                                            {tab === 'purchases' && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleAction(tx.id, 'cancel'); }}
                                                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: 12, fontWeight: 'bold' }}
                                                >
                                                    <X size={14} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default MyOrders;
