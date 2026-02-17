import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Plus, Scale, AlertTriangle, Clock, 
    CheckCircle2, XCircle, Filter, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
    open: { label: 'Open', color: '#FBBF24', icon: <AlertTriangle size={14} /> },
    under_review: { label: 'Under Review', color: '#60A5FA', icon: <Clock size={14} /> },
    mediation: { label: 'In Mediation', color: '#A78BFA', icon: <Scale size={14} /> },
    resolved: { label: 'Resolved', color: '#4ADE80', icon: <CheckCircle2 size={14} /> },
    dismissed: { label: 'Dismissed', color: '#EF4444', icon: <XCircle size={14} /> },
};

const priorityColors = {
    low: '#A7C7BC',
    medium: '#FBBF24',
    high: '#F97316',
    critical: '#EF4444',
};

const Grievances = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('all'); // 'all', 'mine', 'against_me', 'mediating'

    useEffect(() => {
        fetchGrievances();
    }, [viewMode]);

    const fetchGrievances = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('grievances')
                .select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(name, avatar_url),
                    respondent:users!grievances_against_user_id_fkey(name, avatar_url),
                    mediator:users!grievances_mediator_id_fkey(name, avatar_url),
                    resolution_notes(count),
                    grievance_votes(count)
                `)
                .order('created_at', { ascending: false });

            if (viewMode === 'mine') {
                query = query.eq('reporter_id', user.id);
            } else if (viewMode === 'against_me') {
                query = query.eq('against_user_id', user.id);
            } else if (viewMode === 'mediating') {
                query = query.eq('mediator_id', user.id);
            }

            const { data, error } = await query;
            if (error) throw error;
            setGrievances(data || []);
        } catch (error) {
            console.error('Error fetching grievances:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGrievances = grievances.filter(g => 
        statusFilter === 'all' || g.status === statusFilter
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 10, 
                background: 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #2E7D67',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                            <ArrowLeft size={22} />
                        </button>
                        <h1 style={{ fontSize: 17, fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Scale size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                            Conflict Resolution
                        </h1>
                    </div>
                    {user && (
                        <button 
                            onClick={() => navigate('/file-grievance')}
                            style={{ background: '#F97316', color: 'white', border: 'none', borderRadius: 20, padding: '7px 12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12, flexShrink: 0, whiteSpace: 'nowrap' }}
                        >
                            <Plus size={16} /> File Issue
                        </button>
                    )}
                </div>

                {/* View Mode Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                    {[
                        { value: 'all', label: 'All Cases' },
                        { value: 'mine', label: 'My Filed' },
                        { value: 'against_me', label: 'Against Me' },
                        { value: 'mediating', label: 'Mediating' },
                    ].map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setViewMode(tab.value)}
                            style={{
                                background: viewMode === tab.value ? '#4ADE80' : 'rgba(255,255,255,0.08)',
                                color: viewMode === tab.value ? '#0B3D2E' : '#A7C7BC',
                                border: 'none', borderRadius: 20, padding: '6px 14px',
                                cursor: 'pointer', fontWeight: 'bold', fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    <button
                        onClick={() => setStatusFilter('all')}
                        style={{
                            background: statusFilter === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                            color: statusFilter === 'all' ? '#F2F1EE' : '#A7C7BC',
                            border: 'none', borderRadius: 20, padding: '4px 12px',
                            cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap'
                        }}
                    >
                        All
                    </button>
                    {Object.entries(statusConfig).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            style={{
                                background: statusFilter === key ? `${cfg.color}33` : 'rgba(255,255,255,0.05)',
                                color: statusFilter === key ? cfg.color : '#A7C7BC',
                                border: statusFilter === key ? `1px solid ${cfg.color}` : '1px solid transparent',
                                borderRadius: 20, padding: '4px 12px',
                                cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap',
                                display: 'flex', alignItems: 'center', gap: 4
                            }}
                        >
                            {cfg.icon} {cfg.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                {/* Stats Summary */}
                <div className="grievance-stats" style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                    {['open', 'under_review', 'mediation', 'resolved'].map(status => {
                        const count = grievances.filter(g => g.status === status).length;
                        const cfg = statusConfig[status];
                        return (
                            <div key={status} style={{ 
                                background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: '12px 10px',
                                border: '1px solid #2E7D67', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: 22, fontWeight: 'bold', color: cfg.color }}>{count}</div>
                                <div style={{ fontSize: 11, color: '#A7C7BC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                    {cfg.icon} {cfg.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grievance List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                        <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : filteredGrievances.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
                        <Scale size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p style={{ fontSize: 16 }}>No grievances found.</p>
                        <p style={{ fontSize: 13 }}>The community is at peace 🕊️</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredGrievances.map((grievance, i) => {
                            const cfg = statusConfig[grievance.status] || statusConfig.open;
                            return (
                                <motion.div
                                    key={grievance.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => navigate(`/grievance/${grievance.id}`)}
                                    style={{ 
                                        background: 'rgba(13, 77, 58, 0.4)', 
                                        borderRadius: 16, padding: 18,
                                        border: '1px solid #2E7D67',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = cfg.color}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#2E7D67'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                                                <span style={{ 
                                                    background: `${cfg.color}22`, color: cfg.color,
                                                    fontSize: 11, fontWeight: 'bold', padding: '3px 10px', borderRadius: 10,
                                                    display: 'flex', alignItems: 'center', gap: 4,
                                                    border: `1px solid ${cfg.color}44`
                                                }}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                                <span style={{ 
                                                    fontSize: 11, fontWeight: 'bold', padding: '3px 8px', borderRadius: 10,
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: priorityColors[grievance.priority] || '#A7C7BC',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {grievance.priority}
                                                </span>
                                                {grievance.category && (
                                                    <span style={{ fontSize: 11, color: '#A7C7BC', textTransform: 'capitalize' }}>
                                                        {grievance.category.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 'bold' }}>{grievance.title}</h3>
                                            <p style={{ margin: 0, fontSize: 13, color: '#A7C7BC', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {grievance.description}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} style={{ color: '#A7C7BC', flexShrink: 0, marginLeft: 8 }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#A7C7BC', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <span>Filed by: <strong style={{ color: '#F2F1EE' }}>{grievance.reporter?.name || 'Anonymous'}</strong></span>
                                            {grievance.respondent && (
                                                <span>Against: <strong style={{ color: '#F2F1EE' }}>{grievance.respondent?.name}</strong></span>
                                            )}
                                        </div>
                                        <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-stats { grid-template-columns: repeat(2, 1fr); }
                @media (min-width: 480px) {
                    .grievance-stats { grid-template-columns: repeat(4, 1fr); }
                }
            `}</style>
        </div>
    );
};

export default Grievances;
