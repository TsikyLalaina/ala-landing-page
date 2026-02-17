import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Circle, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    ArrowLeft, Loader2, Radio, AlertTriangle, CloudLightning,
    Droplets, Flame, Bug, ShieldAlert, MapPin, Calendar,
    Send, Heart, HelpingHand, PackageOpen, Info, CheckCircle2,
    Users, Clock, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const crisisTypes = {
    cyclone: { label: 'Cyclone', icon: <CloudLightning size={18} />, color: '#A78BFA' },
    flood: { label: 'Flood', icon: <Droplets size={18} />, color: '#60A5FA' },
    drought: { label: 'Drought', icon: <Flame size={18} />, color: '#F97316' },
    fire: { label: 'Fire', icon: <Flame size={18} />, color: '#EF4444' },
    locust: { label: 'Locust', icon: <Bug size={18} />, color: '#FBBF24' },
    disease: { label: 'Disease', icon: <ShieldAlert size={18} />, color: '#F472B6' },
    other: { label: 'Other', icon: <AlertTriangle size={18} />, color: '#A7C7BC' },
};

const alertTypes = {
    info: { label: 'Info', color: '#60A5FA' },
    warning: { label: 'Warning', color: '#FBBF24' },
    emergency: { label: 'Emergency', color: '#F97316' },
    critical: { label: 'Critical', color: '#EF4444' },
    all_clear: { label: 'All Clear', color: '#4ADE80' },
};

const severityLabels = ['', 'Low', 'Moderate', 'Serious', 'Severe', 'Catastrophic'];
const severityColors = ['', '#4ADE80', '#FBBF24', '#F97316', '#EF4444', '#DC2626'];

const responseTypes = [
    { value: 'info', label: 'Info Update', icon: <Info size={16} />, color: '#60A5FA' },
    { value: 'need_help', label: 'Need Help', icon: <HelpingHand size={16} />, color: '#EF4444' },
    { value: 'offering_help', label: 'Offering Help', icon: <Heart size={16} />, color: '#4ADE80' },
    { value: 'status_update', label: 'Status Update', icon: <Radio size={16} />, color: '#FBBF24' },
    { value: 'resource_available', label: 'Resource Available', icon: <PackageOpen size={16} />, color: '#A78BFA' },
];

const CrisisDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [alert, setAlert] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newResponse, setNewResponse] = useState('');
    const [responseType, setResponseType] = useState('info');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAll();
        // Real-time subscription for responses
        const channel = supabase
            .channel(`crisis-${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'crisis_responses', filter: `alert_id=eq.${id}` }, () => fetchResponses())
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, [id]);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchAlert(), fetchResponses()]);
        setLoading(false);
    };

    const fetchAlert = async () => {
        const { data, error } = await supabase
            .from('crisis_alerts')
            .select('*, creator:users!crisis_alerts_creator_id_fkey(id, name, avatar_url)')
            .eq('id', id).single();
        if (!error) setAlert(data);
    };

    const fetchResponses = async () => {
        const { data } = await supabase
            .from('crisis_responses')
            .select('*, author:users!crisis_responses_user_id_fkey(name, avatar_url)')
            .eq('alert_id', id)
            .order('created_at', { ascending: true });
        setResponses(data || []);
    };

    const handleAddResponse = async (e) => {
        e.preventDefault();
        if (!newResponse.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('crisis_responses').insert({
                alert_id: id, user_id: user.id,
                content: newResponse.trim(), response_type: responseType,
            });
            if (error) throw error;
            setNewResponse('');
            fetchResponses(); // Immediate refresh
            toast.success('Response posted');
        } catch (error) {
            toast.error('Failed to post response');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const updates = { status: newStatus, updated_at: new Date().toISOString() };
            if (newStatus === 'resolved') updates.resolved_at = new Date().toISOString();
            const { error } = await supabase.from('crisis_alerts').update(updates).eq('id', id);
            if (error) throw error;
            fetchAlert();
            toast.success(`Status: ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!alert) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', padding: 20 }}>
                <p>Alert not found.</p>
                <button onClick={() => navigate('/crisis')} style={{ color: '#4ADE80', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
        );
    }

    const ct = crisisTypes[alert.crisis_type] || crisisTypes.other;
    const at = alertTypes[alert.alert_type] || alertTypes.warning;
    const sColor = severityColors[alert.severity_level || 3] || '#FBBF24';
    const isCreator = user?.id === alert.created_by;
    const isActive = alert.status === 'active';

    const needHelpCount = responses.filter(r => r.response_type === 'need_help').length;
    const offeringHelpCount = responses.filter(r => r.response_type === 'offering_help').length;

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: isActive ? 'rgba(127, 29, 29, 0.95)' : 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: `1px solid ${isActive ? '#EF4444' : '#2E7D67'}`,
                display: 'flex', alignItems: 'center', gap: 16
            }}>
                <button onClick={() => navigate('/crisis')} style={{ background: 'transparent', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {alert.title}
                </h1>
                {isActive && (
                    <span style={{ background: '#EF4444', color: 'white', fontSize: 10, padding: '3px 8px', borderRadius: 8, animation: 'pulse 2s infinite', fontWeight: 'bold' }}>
                        ACTIVE
                    </span>
                )}
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>

                {/* Severity Banner */}
                <div style={{ 
                    background: `${sColor}15`, border: `1px solid ${sColor}44`, borderRadius: 16, padding: 20, marginBottom: 20,
                    display: 'flex', alignItems: 'center', gap: 16
                }}>
                    <div style={{ fontSize: 48, lineHeight: 1 }}>{ct.icon ? React.cloneElement(ct.icon, { size: 40, color: ct.color }) : null}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                            <span style={{ background: `${ct.color}22`, color: ct.color, fontSize: 12, fontWeight: 'bold', padding: '3px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {ct.icon} {ct.label}
                            </span>
                            <span style={{ background: `${at.color}22`, color: at.color, fontSize: 12, fontWeight: 'bold', padding: '3px 10px', borderRadius: 8 }}>
                                {at.label}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 'bold', color: sColor }}>
                                Severity {alert.severity_level || 3}/5 — {severityLabels[alert.severity_level || 3]}
                            </span>
                        </div>
                        {/* Severity Bar */}
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${((alert.severity_level || 3) / 5) * 100}%`, background: sColor, borderRadius: 3, transition: 'width 0.5s' }} />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 14, border: '1px solid #2E7D67', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#EF4444' }}>{needHelpCount}</div>
                        <div style={{ fontSize: 11, color: '#A7C7BC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <HelpingHand size={12} /> Need Help
                        </div>
                    </div>
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 14, border: '1px solid #2E7D67', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4ADE80' }}>{offeringHelpCount}</div>
                        <div style={{ fontSize: 11, color: '#A7C7BC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <Heart size={12} /> Offering Help
                        </div>
                    </div>
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 14, border: '1px solid #2E7D67', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#60A5FA' }}>{responses.length}</div>
                        <div style={{ fontSize: 11, color: '#A7C7BC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <Users size={12} /> Responses
                        </div>
                    </div>
                </div>

                {/* Title & Meta */}
                <h2 style={{ fontSize: 26, fontWeight: 'bold', margin: '0 0 12px', lineHeight: 1.3 }}>{alert.title}</h2>
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 13, color: '#A7C7BC', flexWrap: 'wrap' }}>
                    {alert.affected_area && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {alert.affected_area}</span>}
                    {alert.affected_radius_km && <span>↔ {alert.affected_radius_km}km radius</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {new Date(alert.created_at).toLocaleString()}</span>
                    {alert.creator && <span>by {alert.creator.name}</span>}
                </div>

                {/* Map */}
                {alert.latitude && alert.longitude && (
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #2E7D67', height: 280, marginBottom: 20 }}>
                        <MapContainer center={[alert.latitude, alert.longitude]} zoom={9} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {alert.affected_radius_km && (
                                <Circle center={[alert.latitude, alert.longitude]} radius={alert.affected_radius_km * 1000} pathOptions={{ color: sColor, fillColor: sColor, fillOpacity: 0.15, weight: 2 }} />
                            )}
                            <CircleMarker center={[alert.latitude, alert.longitude]} radius={10} pathOptions={{ color: sColor, fillColor: sColor, fillOpacity: 0.8, weight: 2 }} />
                        </MapContainer>
                    </div>
                )}

                {/* Image */}
                {alert.image_url && (
                    <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid #2E7D67' }}>
                        <img src={alert.image_url} alt={alert.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                )}

                {/* Description */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 24, borderRadius: 16, border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginTop: 0, marginBottom: 10 }}>Situation Report</h3>
                    <p style={{ color: '#D1D5D8', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontSize: 15 }}>{alert.description}</p>
                </div>

                {/* Safety Instructions */}
                {alert.instructions && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#EF4444', marginTop: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Shield size={16} /> Safety Instructions
                        </h3>
                        <p style={{ color: '#FCA5A5', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', fontSize: 14 }}>{alert.instructions}</p>
                    </div>
                )}

                {/* Status Management */}
                {isCreator && alert.status !== 'resolved' && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, border: '1px solid #2E7D67', marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#A7C7BC', fontWeight: 'bold', marginRight: 8 }}>Update Status:</span>
                        {[
                            { status: 'monitoring', label: '👁️ Monitoring', color: '#60A5FA' },
                            { status: 'resolved', label: '✅ Resolved', color: '#4ADE80' },
                        ].filter(s => s.status !== alert.status).map(s => (
                            <button key={s.status} onClick={() => handleStatusUpdate(s.status)} style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}33`, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: 12 }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Coordination / Responses */}
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={18} /> Coordination Feed ({responses.length})
                    </h3>

                    {/* Response Type Selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
                        {responseTypes.map(rt => (
                            <button key={rt.value} type="button" onClick={() => setResponseType(rt.value)} style={{
                                background: responseType === rt.value ? `${rt.color}22` : 'rgba(255,255,255,0.05)',
                                color: responseType === rt.value ? rt.color : '#A7C7BC',
                                border: responseType === rt.value ? `1px solid ${rt.color}44` : '1px solid transparent',
                                borderRadius: 20, padding: '6px 14px', cursor: 'pointer',
                                fontSize: 12, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap'
                            }}>
                                {rt.icon} {rt.label}
                            </button>
                        ))}
                    </div>

                    {/* New Response Form */}
                    <form onSubmit={handleAddResponse} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <textarea value={newResponse} onChange={e => setNewResponse(e.target.value)} placeholder="Post a coordination update..." rows={2} style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14, resize: 'vertical' }} />
                        <button type="submit" disabled={submitting || !newResponse.trim()} style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 12, padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: submitting || !newResponse.trim() ? 0.5 : 1 }}>
                            <Send size={18} />
                        </button>
                    </form>

                    {/* Response Feed */}
                    {responses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 30, color: '#A7C7BC', fontSize: 13, fontStyle: 'italic', background: 'rgba(13,77,58,0.3)', borderRadius: 12 }}>
                            No coordination responses yet. Be the first to respond!
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {responses.map((resp, i) => {
                                const rt = responseTypes.find(r => r.value === resp.response_type) || responseTypes[0];
                                return (
                                    <motion.div
                                        key={resp.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        style={{ background: 'rgba(13, 77, 58, 0.3)', borderRadius: 12, padding: 14, border: `1px solid ${rt.color}22` }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 11, background: `${rt.color}22`, color: rt.color, padding: '2px 8px', borderRadius: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    {rt.icon} {rt.label}
                                                </span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    {resp.author?.avatar_url ? (
                                                        <img src={resp.author.avatar_url} style={{ width: 20, height: 20, borderRadius: '50%' }} alt="" />
                                                    ) : (
                                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2E7D67' }} />
                                                    )}
                                                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{resp.author?.name || 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: 11, color: '#A7C7BC' }}>
                                                {new Date(resp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 14, color: '#D1D5D8', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{resp.content}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .leaflet-container { background: #0B3D2E; }
            `}</style>
        </div>
    );
};

export default CrisisDetails;
