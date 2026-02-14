import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    ArrowLeft, Loader2, Plus, AlertTriangle, Radio, CloudLightning,
    Droplets, Flame, Bug, ShieldAlert, Info, CheckCircle2, Eye,
    Filter, Map as MapIcon, List, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const crisisTypes = {
    cyclone: { label: 'Cyclone', icon: <CloudLightning size={16} />, color: '#A78BFA' },
    flood: { label: 'Flood', icon: <Droplets size={16} />, color: '#60A5FA' },
    drought: { label: 'Drought', icon: <Flame size={16} />, color: '#F97316' },
    fire: { label: 'Fire', icon: <Flame size={16} />, color: '#EF4444' },
    locust: { label: 'Locust', icon: <Bug size={16} />, color: '#FBBF24' },
    disease: { label: 'Disease', icon: <ShieldAlert size={16} />, color: '#F472B6' },
    other: { label: 'Other', icon: <AlertTriangle size={16} />, color: '#A7C7BC' },
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

const CrisisAlerts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [statusFilter, setStatusFilter] = useState('active');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchAlerts();
        // Real-time subscription
        const channel = supabase
            .channel('crisis-alerts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'crisis_alerts' }, () => fetchAlerts())
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('crisis_alerts')
                .select('*, creator:users!crisis_alerts_creator_id_fkey(name, avatar_url)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAlerts(data || []);
        } catch (error) {
            console.error('Error fetching crisis alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(a => {
            const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
            const matchesType = typeFilter === 'all' || a.crisis_type === typeFilter;
            return matchesStatus && matchesType;
        });
    }, [alerts, statusFilter, typeFilter]);

    const activeCount = alerts.filter(a => a.status === 'active').length;
    const criticalCount = alerts.filter(a => a.status === 'active' && (a.severity_level || 3) >= 4).length;

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: criticalCount > 0 ? 'rgba(127, 29, 29, 0.95)' : 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: `1px solid ${criticalCount > 0 ? '#EF4444' : '#2E7D67'}`,
                transition: 'background 0.3s'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Radio size={20} style={{ color: criticalCount > 0 ? '#EF4444' : '#F97316' }} />
                            Emergency Alerts
                        </h1>
                        {activeCount > 0 && (
                            <span style={{ 
                                background: '#EF4444', color: 'white', 
                                fontSize: 11, fontWeight: 'bold', padding: '2px 8px', borderRadius: 10,
                                animation: 'pulse 2s infinite'
                            }}>
                                {activeCount} ACTIVE
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                            onClick={() => navigate('/create-alert')}
                            style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                        >
                            <Plus size={18} /> Alert
                        </button>
                    </div>
                </div>

                {/* View Toggle & Filters */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 2 }}>
                        <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? '#4ADE80' : 'transparent', color: viewMode === 'list' ? '#0B3D2E' : '#A7C7BC', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold', fontSize: 13 }}>
                            <List size={16} /> List
                        </button>
                        <button onClick={() => setViewMode('map')} style={{ background: viewMode === 'map' ? '#4ADE80' : 'transparent', color: viewMode === 'map' ? '#0B3D2E' : '#A7C7BC', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 'bold', fontSize: 13 }}>
                            <MapIcon size={16} /> Map
                        </button>
                    </div>
                    <div style={{ flex: 1 }} />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', color: '#F2F1EE', border: '1px solid #2E7D67', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="monitoring">Monitoring</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Crisis Type Filter */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    <button onClick={() => setTypeFilter('all')} style={{ background: typeFilter === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', color: '#F2F1EE', border: 'none', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>
                        All
                    </button>
                    {Object.entries(crisisTypes).map(([key, cfg]) => (
                        <button key={key} onClick={() => setTypeFilter(key)} style={{ background: typeFilter === key ? `${cfg.color}33` : 'rgba(255,255,255,0.05)', color: typeFilter === key ? cfg.color : '#A7C7BC', border: typeFilter === key ? `1px solid ${cfg.color}` : '1px solid transparent', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {cfg.icon} {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                        <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : viewMode === 'map' ? (
                    /* Map View */
                    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #2E7D67', height: 500 }}>
                        <MapContainer 
                            center={[-18.9, 47.5]} 
                            zoom={6} 
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredAlerts.filter(a => a.latitude && a.longitude).map(alert => {
                                const ct = crisisTypes[alert.crisis_type] || crisisTypes.other;
                                const sColor = severityColors[alert.severity_level || 3] || '#FBBF24';
                                return (
                                    <React.Fragment key={alert.id}>
                                        {alert.affected_radius_km && (
                                            <Circle
                                                center={[alert.latitude, alert.longitude]}
                                                radius={alert.affected_radius_km * 1000}
                                                pathOptions={{ color: sColor, fillColor: sColor, fillOpacity: 0.1, weight: 1 }}
                                            />
                                        )}
                                        <CircleMarker
                                            center={[alert.latitude, alert.longitude]}
                                            radius={8 + ((alert.severity_level || 3) * 2)}
                                            pathOptions={{ color: sColor, fillColor: sColor, fillOpacity: 0.7, weight: 2 }}
                                        >
                                            <Popup>
                                                <div style={{ minWidth: 180 }}>
                                                    <strong>{alert.title}</strong><br />
                                                    <span style={{ fontSize: 12 }}>
                                                        {ct.label} · {severityLabels[alert.severity_level || 3]} · {alert.status}
                                                    </span><br />
                                                    <button 
                                                        onClick={() => navigate(`/crisis/${alert.id}`)}
                                                        style={{ marginTop: 6, background: '#0B3D2E', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
                                                    >
                                                        View Details →
                                                    </button>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    </React.Fragment>
                                );
                            })}
                        </MapContainer>
                    </div>
                ) : (
                    /* List View */
                    filteredAlerts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 60, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
                            <Radio size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p style={{ fontSize: 16 }}>No alerts found.</p>
                            <p style={{ fontSize: 13 }}>No active emergencies — stay prepared! 🛡️</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {filteredAlerts.map((alert, i) => {
                                const ct = crisisTypes[alert.crisis_type] || crisisTypes.other;
                                const at = alertTypes[alert.alert_type] || alertTypes.warning;
                                const sColor = severityColors[alert.severity_level || 3] || '#FBBF24';
                                const isActive = alert.status === 'active';

                                return (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => navigate(`/crisis/${alert.id}`)}
                                        style={{ 
                                            background: isActive ? 'rgba(239, 68, 68, 0.05)' : 'rgba(13, 77, 58, 0.4)', 
                                            borderRadius: 16, padding: 20,
                                            border: `1px solid ${isActive ? `${sColor}44` : '#2E7D67'}`,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, border-color 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = sColor; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isActive ? `${sColor}44` : '#2E7D67'; }}
                                    >
                                        {/* Top Row: Badges */}
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {isActive && (
                                                <span style={{ 
                                                    background: '#EF4444', color: 'white',
                                                    fontSize: 10, fontWeight: 'bold', padding: '3px 8px', borderRadius: 8,
                                                    textTransform: 'uppercase', animation: 'pulse 2s infinite',
                                                    display: 'flex', alignItems: 'center', gap: 4
                                                }}>
                                                    <Radio size={10} /> ACTIVE
                                                </span>
                                            )}
                                            <span style={{ background: `${ct.color}22`, color: ct.color, fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {ct.icon} {ct.label}
                                            </span>
                                            <span style={{ background: `${at.color}22`, color: at.color, fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 8 }}>
                                                {at.label}
                                            </span>
                                            <span style={{ 
                                                fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 8,
                                                background: `${sColor}22`, color: sColor
                                            }}>
                                                Severity: {alert.severity_level || 3}/5
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 style={{ margin: '0 0 6px 0', fontSize: 18, fontWeight: 'bold' }}>{alert.title}</h3>
                                        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#A7C7BC', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {alert.description}
                                        </p>

                                        {/* Bottom Meta */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#A7C7BC' }}>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                {alert.affected_area && <span>📍 {alert.affected_area}</span>}
                                                {alert.affected_radius_km && <span>↔ {alert.affected_radius_km}km radius</span>}
                                            </div>
                                            <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                .leaflet-container { background: #0B3D2E; }
            `}</style>
        </div>
    );
};

export default CrisisAlerts;
