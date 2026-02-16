import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, ShoppingBag, Gavel, User, Clock, 
    SendHorizontal, Check, X, Ban, Package, AlertTriangle 
} from 'lucide-react';

const STATUS_COLORS = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', label: 'Pending' },
    accepted: { bg: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', label: 'Accepted' },
    denied: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', label: 'Denied' },
    completed: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA', label: 'Completed' },
    cancelled: { bg: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', label: 'Cancelled' },
};

const UNIT_LABEL = (category) => 
    category === 'vanilla' || category === 'spices' || category === 'mining' ? 'kg' : 'items';

const ListingDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [listing, setListing] = useState(null);
    const [bids, setBids] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [purchaseQuantity, setPurchaseQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [showOrders, setShowOrders] = useState(false);

    useEffect(() => {
        fetchListingDetails();
        
        const channel = supabase
            .channel(`listing_${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `listing_id=eq.${id}` }, () => {
                fetchTransactions();
                fetchListingDetails();
            })
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
                .select('*, seller:users!marketplace_listings_seller_id_fkey(id, name, avatar_url, location)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setListing(data);
            if (data.min_order_quantity) setPurchaseQuantity(data.min_order_quantity);
            if (data.listing_type === 'auction') fetchBids();
            fetchTransactions();
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

    const fetchTransactions = async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, buyer:users!transactions_buyer_id_fkey(id, name, avatar_url)')
            .eq('listing_id', id)
            .order('created_at', { ascending: false });
        if (!error) setTransactions(data || []);
    };

    // Check if the listing is expired
    const isExpired = listing?.expires_at && new Date(listing.expires_at) < new Date();
    const isOwner = user && listing && user.id === listing.seller_id;
    const isSold = listing?.status === 'sold';
    const isClosed = listing?.status === 'closed';
    const isActive = listing?.status === 'active' && !isExpired;
    const hasPendingTransactions = transactions.some(t => t.status === 'pending' || t.status === 'accepted');

    const handleSendRequest = async () => {
        if (!user) {
            toast.error('Please login to purchase');
            return;
        }

        const qty = parseFloat(purchaseQuantity);
        const minQty = listing.min_order_quantity || 1;

        if (isNaN(qty) || qty < minQty) {
            toast.error(`Minimum order is ${minQty} ${UNIT_LABEL(listing.category)}`);
            return;
        }

        if (listing.quantity && qty > listing.quantity) {
            toast.error(`Only ${listing.quantity} ${UNIT_LABEL(listing.category)} available`);
            return;
        }

        setProcessing(true);
        try {
            const totalAmount = qty * listing.price;

            const { error } = await supabase
                .from('transactions')
                .insert({
                    listing_id: id,
                    seller_id: listing.seller_id,
                    buyer_id: user.id,
                    amount: totalAmount,
                    quantity: qty,
                    currency: listing.currency,
                    status: 'pending'
                });

            if (error) throw error;
            toast.success('Purchase request sent! The seller will review it.');
            fetchTransactions();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to send purchase request');
        } finally {
            setProcessing(false);
        }
    };

    const handleTransactionAction = async (txId, action) => {
        setProcessing(true);
        try {
            const tx = transactions.find(t => t.id === txId);
            
            if (action === 'accept') {
                // Check stock availability
                if (listing.quantity && tx.quantity > listing.quantity) {
                    toast.error('Insufficient stock for this order');
                    setProcessing(false);
                    return;
                }

                const { error: txError } = await supabase
                    .from('transactions')
                    .update({ status: 'accepted', updated_at: new Date().toISOString() })
                    .eq('id', txId);
                if (txError) throw txError;

                // Reduce stock
                if (listing.quantity) {
                    const newQty = listing.quantity - tx.quantity;
                    const updateData = {
                        quantity: Math.max(0, newQty),
                        ...(newQty <= 0 ? { status: 'sold', sold_at: new Date().toISOString() } : {})
                    };
                    await supabase.from('marketplace_listings').update(updateData).eq('id', id);
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

            fetchTransactions();
            fetchListingDetails();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Action failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleCloseListing = async () => {
        if (hasPendingTransactions) {
            toast.error('Cannot close listing: there are pending or accepted transactions. Please resolve them first.');
            return;
        }

        setProcessing(true);
        try {
            const { error } = await supabase
                .from('marketplace_listings')
                .update({ status: 'closed' })
                .eq('id', id);

            if (error) throw error;
            toast.success('Listing closed.');
            fetchListingDetails();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to close listing');
        } finally {
            setProcessing(false);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount);
        const currentHighest = bids.length > 0 ? bids[0].amount : listing.price;
        if (amount <= currentHighest) {
            toast.error(`Bid must be higher than ${currentHighest} ${listing.currency}`);
            return;
        }

        setProcessing(true);
        try {
            const { error } = await supabase
                .from('bids')
                .insert({ listing_id: id, bidder_id: user.id, amount: amount });
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

    const unit = UNIT_LABEL(listing.category);
    const statusLabel = isSold ? 'Sold Out' : isClosed ? 'Closed' : isExpired ? 'Expired' : listing.listing_type;
    const statusColor = isSold || isClosed ? '#EF4444' : isExpired ? '#F59E0B' : '#4ADE80';
    const canPurchase = !isOwner && isActive && !isSold && !isClosed;
    const myPendingRequest = transactions.find(t => t.buyer?.id === user?.id && t.status === 'pending');

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
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, flex: 1 }}>Item Details</h1>
                {isOwner && (
                    <button 
                        onClick={() => setShowOrders(!showOrders)}
                        style={{ 
                            background: showOrders ? '#4ADE80' : 'rgba(255,255,255,0.1)', 
                            color: showOrders ? '#0B3D2E' : '#A7C7BC', 
                            border: 'none', borderRadius: 20, padding: '8px 14px', 
                            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                            fontSize: 13
                        }}
                    >
                        <Package size={16} /> Orders {transactions.filter(t => t.status === 'pending').length > 0 && `(${transactions.filter(t => t.status === 'pending').length})`}
                    </button>
                )}
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>

                {/* Seller Orders Panel */}
                {isOwner && showOrders && (
                    <div style={{ marginBottom: 24, background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px solid #2E7D67', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(46,125,103,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: 16 }}>Purchase Requests & Orders</h3>
                            <span style={{ fontSize: 12, color: '#A7C7BC' }}>{transactions.length} total</span>
                        </div>

                        {transactions.length === 0 ? (
                            <div style={{ padding: 24, textAlign: 'center', color: '#A7C7BC' }}>No orders yet.</div>
                        ) : (
                            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                {transactions.map(tx => {
                                    const st = STATUS_COLORS[tx.status] || STATUS_COLORS.pending;
                                    return (
                                        <div key={tx.id} style={{ padding: '14px 20px', borderBottom: '1px solid rgba(46,125,103,0.2)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            {tx.buyer?.avatar_url ? (
                                                <img src={tx.buyer.avatar_url} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} alt="" />
                                            ) : (
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <User size={14} color="#A7C7BC" />
                                                </div>
                                            )}
                                            <div style={{ flex: '1 1 150px', minWidth: 0 }}>
                                                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{tx.buyer?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: 12, color: '#A7C7BC' }}>
                                                    {tx.quantity} {unit} • {tx.amount?.toLocaleString()} {tx.currency}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#A7C7BC' }}>{new Date(tx.created_at).toLocaleString()}</div>
                                            </div>
                                            <span style={{ 
                                                background: st.bg, color: st.color, 
                                                fontSize: 11, fontWeight: 'bold', 
                                                padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase' 
                                            }}>
                                                {st.label}
                                            </span>
                                            {tx.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button 
                                                        onClick={() => handleTransactionAction(tx.id, 'accept')}
                                                        disabled={processing}
                                                        style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid #4ADE80', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#4ADE80', fontSize: 12, fontWeight: 'bold' }}
                                                    >
                                                        <Check size={14} /> Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => handleTransactionAction(tx.id, 'deny')}
                                                        disabled={processing}
                                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#EF4444', fontSize: 12, fontWeight: 'bold' }}
                                                    >
                                                        <X size={14} /> Deny
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
                    
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
                        {/* Status Badge */}
                        <span style={{ 
                            background: statusColor, 
                            color: statusColor === '#4ADE80' ? '#0B3D2E' : 'white', 
                            fontSize: 12, fontWeight: 'bold', padding: '4px 10px', borderRadius: 12,
                            textTransform: 'uppercase', marginBottom: 12, display: 'inline-block'
                        }}>
                            {statusLabel}
                        </span>

                        {isExpired && listing.status === 'active' && (
                            <span style={{ 
                                background: '#F59E0B', color: '#0B3D2E',
                                fontSize: 12, fontWeight: 'bold', padding: '4px 10px', borderRadius: 12,
                                textTransform: 'uppercase', marginLeft: 8, display: 'inline-block'
                            }}>
                                Expired
                            </span>
                        )}

                        <h2 style={{ fontSize: 28, fontWeight: 'bold', margin: '0 0 12px 0' }}>{listing.title}</h2>
                        
                        {/* Seller */}
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

                        {/* Description & Details */}
                        <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 20, borderRadius: 16, border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 24 }}>
                            <p style={{ color: '#A7C7BC', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
                            
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 24, fontSize: 14, flexWrap: 'wrap' }}>
                                {listing.quantity != null && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>Available</span>
                                        <span style={{ color: '#F2F1EE' }}>{listing.quantity} {unit}</span>
                                    </div>
                                )}
                                {listing.min_order_quantity > 1 && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>Min Order</span>
                                        <span style={{ color: '#F2F1EE' }}>{listing.min_order_quantity} {unit}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>Category</span>
                                    <span style={{ color: '#F2F1EE', textTransform: 'capitalize' }}>{listing.category}</span>
                                </div>
                                {listing.expires_at && (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#A7C7BC', fontWeight: 'bold' }}>{isExpired ? 'Expired On' : 'Expires'}</span>
                                        <span style={{ color: isExpired ? '#F59E0B' : '#F2F1EE' }}>{new Date(listing.expires_at).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price & Action */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 16, border: '1px solid #2E7D67' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ color: '#A7C7BC' }}>
                                    {listing.listing_type === 'auction' ? 'Current Bid' : 'Unit Price'} 
                                    {listing.listing_type !== 'auction' && ` (per ${unit})`}
                                </span>
                                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#4ADE80' }}>
                                    {listing.listing_type === 'auction' && bids.length > 0 ? bids[0].amount.toLocaleString() : listing.price?.toLocaleString()} {listing.currency}
                                </span>
                            </div>

                            {/* Total Stock Value */}
                            {listing.quantity && listing.listing_type === 'fixed' && (
                                <div style={{ 
                                    background: 'rgba(74, 222, 128, 0.05)', padding: 12, borderRadius: 8, 
                                    marginBottom: 16, border: '1px solid rgba(74, 222, 128, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: '#A7C7BC', marginBottom: 2 }}>Total Stock Value</div>
                                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>
                                                {listing.quantity} {unit} × {listing.price?.toLocaleString()} {listing.currency}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4ADE80' }}>
                                            {(listing.price * listing.quantity).toLocaleString()} {listing.currency}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buyer: Send Purchase Request */}
                            {canPurchase && !myPendingRequest && user && (
                                <>
                                    {listing.listing_type === 'fixed' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                                <div style={{ flex: '1 1 120px' }}>
                                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 'bold', color: '#A7C7BC' }}>
                                                        Quantity ({unit})
                                                    </label>
                                                    <input 
                                                        type="number"
                                                        step="0.001"
                                                        value={purchaseQuantity}
                                                        onChange={(e) => setPurchaseQuantity(e.target.value)}
                                                        min={listing.min_order_quantity || 1}
                                                        max={listing.quantity}
                                                        style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
                                                    />
                                                </div>
                                                <div style={{ paddingBottom: 12, fontSize: 16, fontWeight: 'bold', color: '#4ADE80' }}>
                                                    = {(purchaseQuantity * listing.price).toLocaleString()} {listing.currency}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleSendRequest}
                                                disabled={processing}
                                                style={{ width: '100%', background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.7 : 1 }}
                                            >
                                                <SendHorizontal size={20} /> Send Purchase Request
                                            </button>
                                            <div style={{ fontSize: 12, color: '#A7C7BC', textAlign: 'center' }}>
                                                The seller will review your request before confirming the sale.
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: 10 }}>
                                            <input 
                                                type="number" 
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min ${bids.length > 0 ? bids[0].amount + 1 : listing.price}`}
                                                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', boxSizing: 'border-box' }}
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

                            {/* Buyer: Pending request notice */}
                            {myPendingRequest && (
                                <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                                    <div style={{ color: '#FBBF24', fontWeight: 'bold', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <Clock size={16} /> Purchase Request Pending
                                    </div>
                                    <div style={{ fontSize: 13, color: '#A7C7BC', marginBottom: 12 }}>
                                        You requested {myPendingRequest.quantity} {unit} for {myPendingRequest.amount?.toLocaleString()} {myPendingRequest.currency}. Waiting for seller approval.
                                    </div>
                                    <button 
                                        onClick={() => handleTransactionAction(myPendingRequest.id, 'cancel')}
                                        disabled={processing}
                                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: '#EF4444', fontSize: 12, fontWeight: 'bold' }}
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            )}

                            {/* Not available messages */}
                            {isOwner && !isSold && !isClosed && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                                    <div style={{ textAlign: 'center', color: '#A7C7BC', fontStyle: 'italic' }}>
                                        You are the seller of this item. 
                                        {transactions.filter(t => t.status === 'pending').length > 0 && ` You have ${transactions.filter(t => t.status === 'pending').length} pending request(s).`}
                                    </div>
                                    <button 
                                        onClick={handleCloseListing}
                                        disabled={processing || hasPendingTransactions}
                                        title={hasPendingTransactions ? 'Resolve all pending/accepted transactions before closing' : 'Close this listing'}
                                        style={{ 
                                            width: '100%', 
                                            background: hasPendingTransactions ? 'rgba(156,163,175,0.2)' : 'rgba(239,68,68,0.15)', 
                                            color: hasPendingTransactions ? '#9CA3AF' : '#EF4444', 
                                            border: `1px solid ${hasPendingTransactions ? '#9CA3AF' : '#EF4444'}`, 
                                            borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 'bold', 
                                            cursor: hasPendingTransactions ? 'not-allowed' : 'pointer', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
                                        }}
                                    >
                                        <Ban size={16} /> Close Listing
                                    </button>
                                    {hasPendingTransactions && (
                                        <div style={{ fontSize: 11, color: '#F59E0B', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <AlertTriangle size={12} /> Resolve pending or accepted orders first
                                        </div>
                                    )}
                                </div>
                            )}

                            {isSold && (
                                <div style={{ textAlign: 'center', color: '#EF4444', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                                    This item has been sold out.
                                </div>
                            )}
                            {isClosed && (
                                <div style={{ textAlign: 'center', color: '#EF4444', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                                    This listing has been closed by the seller.
                                </div>
                            )}
                            {isExpired && !isSold && !isClosed && (
                                <div style={{ textAlign: 'center', color: '#F59E0B', fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>
                                    This listing has expired and is no longer available for purchase.
                                </div>
                            )}
                        </div>

                        {/* Buyer's past transactions on this listing */}
                        {user && !isOwner && transactions.filter(t => t.buyer?.id === user.id).length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Package size={16} /> Your Orders
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {transactions.filter(t => t.buyer?.id === user.id).map(tx => {
                                        const st = STATUS_COLORS[tx.status] || STATUS_COLORS.pending;
                                        return (
                                            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'rgba(13, 77, 58, 0.4)', borderRadius: 8, flexWrap: 'wrap', gap: 8 }}>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>{tx.quantity} {unit} • {tx.amount?.toLocaleString()} {tx.currency}</div>
                                                    <div style={{ fontSize: 11, color: '#A7C7BC' }}>{new Date(tx.created_at).toLocaleString()}</div>
                                                </div>
                                                <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 12, textTransform: 'uppercase' }}>
                                                    {st.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
