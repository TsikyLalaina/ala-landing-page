import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    Calendar, MapPin, Clock, Users, Plus, X, Loader2, 
    ArrowLeft, Share2, CheckCircle2, Ticket
} from 'lucide-react';

const Events = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    
    // Create Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        is_virtual: false,
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Fetch events with organizer and my participation status
            const { data, error } = await supabase
                .from('events')
                .select(`
                    *,
                    organizer:organizer_id(name, avatar_url),
                    participants:event_participants(user_id, status)
                `)
                .order('start_time', { ascending: true });

            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { error } = await supabase.from('events').insert({
                organizer_id: user.id,
                ...formData
            });
            if (error) throw error;
            toast.success('Event created!');
            setShowCreate(false);
            setFormData({ title: '', description: '', location: '', start_time: '', end_time: '', is_virtual: false });
            fetchEvents();
        } catch (error) {
            toast.error('Failed to create event');
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = async (eventId, currentStatus) => {
        const newStatus = currentStatus === 'going' ? 'not_going' : 'going';
        try {
            if (currentStatus) {
                // Update or Delete
                if (newStatus === 'not_going') {
                    await supabase.from('event_participants').delete().eq('event_id', eventId).eq('user_id', user.id);
                } else {
                    await supabase.from('event_participants').update({ status: newStatus }).eq('event_id', eventId).eq('user_id', user.id);
                }
            } else {
                // Insert
                await supabase.from('event_participants').insert({ event_id: eventId, user_id: user.id, status: 'going' });
            }
            fetchEvents();
            toast.success(newStatus === 'going' ? 'You are going!' : 'Removed from event');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={20} style={{ color: '#FBBF24' }} /> Events
                    </h1>
                </div>
                <button 
                    onClick={() => setShowCreate(true)}
                    style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                    <Plus size={18} /> Create
                </button>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center' }}><Loader2 className="animate-spin" /></div>
                ) : events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#A7C7BC' }}>
                        <Calendar size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <p>No upcoming events.</p>
                        <button onClick={() => setShowCreate(true)} style={{ color: '#4ADE80', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>Create the first one!</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 20 }}>
                        {events.map(event => {
                            const isGoing = event.participants.some(p => p.user_id === user.id && p.status === 'going');
                            const participantCount = event.participants.filter(p => p.status === 'going').length;
                            const isOrganizer = event.organizer_id === user.id;

                            return (
                                <div key={event.id} style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, overflow: 'hidden', border: '1px solid #2E7D67' }}>
                                    {event.image_url && (
                                        <div style={{ height: 160, overflow: 'hidden' }}>
                                            <img src={event.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <div style={{ fontSize: 12, color: '#FBBF24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                {new Date(event.start_time).toLocaleDateString(undefined, { month: 'long', day: 'numeric', weekday: 'short' })}
                                            </div>
                                            {isOrganizer && <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 10 }}>Host</span>}
                                        </div>
                                        
                                        <h3 style={{ fontSize: 20, fontWeight: 'bold', margin: '0 0 8px 0' }}>{event.title}</h3>
                                        <p style={{ color: '#A7C7BC', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px 0' }}>{event.description}</p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D1D5D8' }}>
                                                <Clock size={16} color="#4ADE80" />
                                                {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                                {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                            </div>
                                            {event.location && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D1D5D8' }}>
                                                    <MapPin size={16} color="#F97316" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ display: 'flex', marginRight: 4 }}>
                                                    {/* Avatars placeholder */}
                                                    {participantCount > 0 && (
                                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#4ADE80', color: '#0B3D2E', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                            {participantCount}
                                                        </div>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: 12, color: '#A7C7BC' }}>{participantCount} {participantCount === 1 ? 'Going' : 'Going'}</span>
                                            </div>
                                            
                                            <button 
                                                onClick={() => handleJoin(event.id, isGoing ? 'going' : null)}
                                                style={{ 
                                                    background: isGoing ? 'none' : '#FBBF24', 
                                                    color: isGoing ? '#FBBF24' : '#0B3D2E', 
                                                    border: isGoing ? '1px solid #FBBF24' : 'none', 
                                                    borderRadius: 20, padding: '8px 20px', fontWeight: 'bold', fontSize: 14, cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: 6
                                                }}
                                            >
                                                {isGoing ? <CheckCircle2 size={16} /> : <Ticket size={16} />}
                                                {isGoing ? 'Going' : 'Join'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: '#0B3D2E', borderRadius: 20, width: '100%', maxWidth: 500, border: '1px solid #2E7D67', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ padding: 20, borderBottom: '1px solid #2E7D67', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>Create Event</h2>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreate} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Title</label>
                                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Start</label>
                                    <input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>End</label>
                                    <input type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>Location</label>
                                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Community Center or Online" style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white' }} />
                            </div>
                            <button type="submit" disabled={creating} style={{ background: '#4ADE80', color: '#0B3D2E', padding: 16, borderRadius: 12, fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: 10, display: 'flex', justifyContent: 'center' }}>
                                {creating ? <Loader2 className="animate-spin" /> : 'Create Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
