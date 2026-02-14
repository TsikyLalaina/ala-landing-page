import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, ShoppingBag, Gavel, User, DollarSign, Clock } from 'lucide-react';

const ListingDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchListingDetails();
        
        // Subscribe to bids
        const channel = supabase
            .channel('bids')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `listing_id=eq.${id}` }, () => {
                fetchBids();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const fetchListingDetails = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('marketplace_listings')
                .select('*, seller:users!marketplace_listings_seller_id_fkey(name, avatar_url, location)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setListing(data);
            if (data.listing_type === 'auction') {
                fetchBids();
            }
        } catch (error) {
            console.error('Error fetching listing:', error);
            toast.error('Could not load listing');
        } finally {
            setLoading(false);
        }
    };

    const fetchBids = async () => {
        const { data, error } = await supabase
            .from('bids')
            .select('*, bidder:users!bids_bidder_id_fkey(name)')
            .eq('listing_id', id)
            .order('amount', { ascending: false });
        
        if (!error) setBids(data || []);
    };

    const handleBuyNow = async () => {
        if (!user) {
            toast.error('Please login to buy items');
            return;
        }
        setProcessing(true);
        try {
            // 1. Create Transaction Log
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    listing_id: id,
                    seller_id: listing.seller_id,
                    buyer_id: user.id,
                    amount: listing.price,
                    currency: listing.currency
                });
            if (txError) throw txError;

            // 2. Update Listing Status
            const { error: updateError } = await supabase
                .from('marketplace_listings')
                .update({ 
                    status: 'sold',
                    sold_at: new Date().toISOString()
                })
                .eq('id', id);
            
            if (updateError) throw updateError;

            toast.success('Item purchased successfully!');
            fetchListingDetails(); // Refresh to show sold status
        } catch (error) {
            console.error('Error purchasing:', error);
            toast.error('Purchase failed');
        } finally {
            setProcessing(false);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount);
        
        // Simple Validation
        const currentHighest = bids.length > 0 ? bids[0].amount : listing.price;
        if (amount <= currentHighest) {
            toast.error(`Bid must be higher than ${currentHighest} ${listing.currency}`);
            return;
        }

        setProcessing(true);
        try {
            const { error } = await supabase
                .from('bids')
                .insert({
                    listing_id: id,
                    bidder_id: user.id,
                    amount: amount
                });
            
            if (error) throw error;
            toast.success('Bid placed!');
            setBidAmount('');
            fetchBids();
        } catch (error) {
            console.error('Error bidding:', error);
            toast.error('Failed to place bid');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
         return (
             <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
             </div>
         );
    }

    if (!listing) return <div style={{ background: '#0B3D2E', minHeight: '100vh', color: 'white', padding: 20 }}>Listing not found</div>;

    const isOwner = user && user.id === listing.seller_id;
    const isSold = listing.status === 'sold';

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
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Item Details</h1>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: 24, alignItems: 'start' }}>
                    
                    {/* Image Section */}
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #2E7D67' }}>
                         {listing.image_urls && listing.image_urls[0] ? (
                            <img src={listing.image_urls[0]} alt={listing.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        ) : (
                            <div style={{ height: 300, background: 'rgba(13, 77, 58, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingBag size={64} color="rgba(255,255,255,0.2)" />
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div>
                         <span style={{ 
                            background: listing.status === 'sold' ? '#EF4444' : '#4ADE80', 
                            color: listing.status === 'sold' ? 'white' : '#0B3D2E', 
                            fontSize: 12, fontWeight: 'bold', padding: '4px 10px', borderRadius: 12,
                            textTransform: 'uppercase', marginBottom: 12, display: 'inline-block'
                        }}>
                            {listing.status === 'sold' ? 'Sold' : listing.listing_type}
                        </span>

                        <h2 style={{ fontSize: 28, fontWeight: 'bold', margin: '0 0 12px 0' }}>{listing.title}</h2>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                             {listing.seller?.avatar_url ? (
                                <img src={listing.seller.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="" />
                            ) : (
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <User size={20} color="#A7C7BC" />
                                </div>
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{listing.seller?.name || 'Unknown Seller'}</div>
                                <div style={{ fontSize: 12, color: '#A7C7BC' }}>{listing.seller?.location || 'Unknown Location'}</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 20, borderRadius: 16, border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 24 }}>
                            <p style={{ color: '#A7C7BC', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
                            
                            {/* Additional Details */}
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 24, fontSize: 14 }}>
                                {listing.quantity && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>Quantity</span>
                                        <span style={{ color: '#F2F1EE' }}>{listing.quantity} {listing.category === 'vanilla' || listing.category === 'spices' ? 'kg' : 'items'}</span>
                                    </div>
                                )}
                                {listing.expires_at && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>{listing.listing_type === 'auction' ? 'Auction Ends' : 'Expires'}</span>
                                        <span style={{ color: '#F2F1EE' }}>{new Date(listing.expires_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price & Action */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 16, border: '1px solid #2E7D67' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <span style={{ color: '#A7C7BC' }}>
                                    {listing.listing_type === 'auction' ? 'Current Bid' : 'Unit Price'} 
                                    {listing.listing_type !== 'auction' && ` (per ${listing.category === 'vanilla' || listing.category === 'spices' ? 'kg' : 'item'})`}
                                </span>
                                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#4ADE80' }}>
                                    {listing.listing_type === 'auction' && bids.length > 0 ? bids[0].amount.toLocaleString() : listing.price.toLocaleString()} {listing.currency}
                                </span>
                            </div>

                            {/* Total Value (if quantity is set and it's fixed price) */}
                            {listing.quantity && listing.listing_type === 'fixed' && (
                                <div style={{ 
                                    background: 'rgba(74, 222, 128, 0.05)', 
                                    padding: 12, 
                                    borderRadius: 8, 
                                    marginBottom: 16,
                                    border: '1px solid rgba(74, 222, 128, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: '#A7C7BC', marginBottom: 2 }}>Total Value</div>
                                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>
                                                {listing.quantity} {listing.category === 'vanilla' || listing.category === 'spices' ? 'kg' : 'items'} × {listing.price.toLocaleString()} {listing.currency}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4ADE80' }}>
                                            {(listing.price * listing.quantity).toLocaleString()} {listing.currency}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isOwner && !isSold && (
                                <>
                                    {listing.listing_type === 'fixed' ? (
                                        <button 
                                            onClick={handleBuyNow}
                                            disabled={processing}
                                            style={{ width: '100%', background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                                        >
                                            <ShoppingBag /> Buy Now
                                        </button>
                                    ) : (
                                        <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: 10 }}>
                                            <input 
                                                type="number" 
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min ${bids.length > 0 ? bids[0].amount + 1 : listing.price}`}
                                                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                                required
                                            />
                                            <button 
                                                type="submit"
                                                disabled={processing}
                                                style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 12, padding: '0 24px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                Bid
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}

                             {isOwner && !isSold && (
                                <div style={{ textAlign: 'center', color: '#A7C7BC', fontStyle: 'italic', marginTop: 10 }}>
                                    You are the seller of this item.
                                </div>
                            )}

                             {isSold && (
                                <div style={{ textAlign: 'center', color: '#EF4444', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                                    This item has been sold.
                                </div>
                            )}
                        </div>

                        {/* Recent Bids (Auction Only) */}
                        {listing.listing_type === 'auction' && (
                            <div style={{ marginTop: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Clock size={18} /> Bid History
                                </h3>
                                {bids.length === 0 ? (
                                    <p style={{ color: '#A7C7BC', fontStyle: 'italic' }}>No bids yet. Be the first!</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {bids.map(bid => (
                                            <div key={bid.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'rgba(13, 77, 58, 0.4)', borderRadius: 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontWeight: 'bold' }}>{bid.bidder.name}</span>
                                                    <span style={{ fontSize: 12, color: '#A7C7BC' }}>{new Date(bid.created_at).toLocaleTimeString()}</span>
                                                </div>
                                                <div style={{ color: '#4ADE80', fontWeight: 'bold' }}>{bid.amount.toLocaleString()} {listing.currency}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ListingDetails;
