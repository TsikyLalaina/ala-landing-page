import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Shield, User, Search, X, CheckCircle2, AlertTriangle, Users, Award, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminGrievances = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null); // ID of grievance being assigned
    const [availableMediators, setAvailableMediators] = useState([]);
    const [excludedIds, setExcludedIds] = useState(new Set());
    const [selectedMediatorId, setSelectedMediatorId] = useState('');
    const [mediatorBadgeId, setMediatorBadgeId] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/feed');
            return;
        }
        fetchGrievances();
        fetchMediatorBadgeId();
    }, [isAdmin]);

    useEffect(() => {
        if (mediatorBadgeId) fetchMediators();
    }, [mediatorBadgeId]);

    const fetchMediatorBadgeId = async () => {
        const { data } = await supabase.from('badges').select('id').eq('name', 'Mediator').single();
        if (data) setMediatorBadgeId(data.id);
    };

    const fetchMediators = async () => {
        try {
            const { data } = await supabase
                .from('users')
                .select('id, name, avatar_url, user_badges!inner(badge_id)')
                .eq('user_badges.badge_id', mediatorBadgeId);
            setAvailableMediators(data || []);
        } catch (error) { console.error('Error fetching mediators:', error); }
    };

    const fetchGrievances = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('grievances')
                .select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(name, avatar_url),
                    respondent:users!grievances_against_user_id_fkey(name, avatar_url),
                    mediator:users!grievances_mediator_id_fkey(name, avatar_url),
                    group:groups!grievances_group_id_fkey(name)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setGrievances(data || []);
        } catch (error) {
            console.error('Error fetching admin grievances:', error);
            toast.error('Failed to load grievances');
        } finally {
            setLoading(false);
        }
    };

    const handleStartAssign = async (grievance) => {
        if (assigningId === grievance.id) {
            setAssigningId(null);
            setSelectedMediatorId('');
            setExcludedIds(new Set());
            return;
        }

        setAssigningId(grievance.id);
        setSelectedMediatorId(''); 
        
        const exclude = new Set();
        if (grievance.reporter_id) exclude.add(grievance.reporter_id);
        if (grievance.against_user_id) exclude.add(grievance.against_user_id);

        if (grievance.group_id) {
            try {
                const { data } = await supabase.from('group_members').select('user_id').eq('group_id', grievance.group_id);
                (data || []).forEach(m => exclude.add(m.user_id));
            } catch (e) { console.error(e); }
        }
        setExcludedIds(exclude);
    };

    const handleAssignMediator = async () => {
        if (!assigningId || !selectedMediatorId) return;
        try {
            const mediatorName = availableMediators.find(u => u.id === selectedMediatorId)?.name || 'Unknown';
            const { error } = await supabase
                .from('grievances')
                .update({ 
                    mediator_id: selectedMediatorId,
                    status: 'under_review',
                    updated_at: new Date().toISOString()
                })
                .eq('id', assigningId);

            if (error) throw error;
            
            await supabase.from('resolution_notes').insert({
                grievance_id: assigningId, author_id: user.id,
                content: `Admin assigned mediator: ${mediatorName}`,
                note_type: 'mediation'
            });

            toast.success('Mediator assigned');
            setAssigningId(null);
            setSelectedMediatorId('');
            setExcludedIds(new Set());
            fetchGrievances();
        } catch (error) { toast.error('Failed to assign'); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 10, 
                background: 'rgba(11, 61, 46, 0.95)', backdropFilter: 'blur(10px)',
                padding: '16px 20px', borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4 }}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={18} style={{ color: '#F97316' }} /> Admin Grievance Panel
                    </h1>
                </div>
                <button onClick={() => navigate('/admin/users')} style={{ background: 'rgba(255,255,255,0.05)', color: '#A7C7BC', border: '1px solid #2E7D67', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={14} style={{ color: '#FBBF24' }} /> Manage Badges
                </button>
            </div>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
                {grievances.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC', fontStyle: 'italic' }}>No grievances found.</div>
                ) : (
                    <div style={{ display: 'grid', gap: 16 }}>
                        {grievances.map(g => (
                            <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                                style={{ background: 'rgba(13, 77, 58, 0.4)', border: '1px solid #2E7D67', borderRadius: 12, padding: 16 }}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: '#2E7D67', fontWeight: 'bold', textTransform: 'uppercase' }}>{g.status.replace('_', ' ')}</span>
                                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#A7C7BC' }}>{g.priority}</span>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>{g.title}</h3>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: 12, color: '#A7C7BC' }}>
                                        {new Date(g.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#A7C7BC', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <User size={14} /> Reporter: <span style={{ color: 'white' }}>{g.reporter?.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {g.group ? <Users size={14} /> : <User size={14} />} 
                                        Respondent: <span style={{ color: 'white' }}>{g.group ? g.group.name : (g.respondent?.name || 'General')}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                                    {/* Mediator Section */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                        <Shield size={16} style={{ color: '#A78BFA' }} />
                                        {g.mediator ? (
                                            <span style={{ fontSize: 13 }}>Mediator: <strong>{g.mediator.name}</strong></span>
                                        ) : (
                                            <span style={{ fontSize: 13, color: '#F97316', fontStyle: 'italic' }}>No mediator assigned</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => navigate(`/grievance/${g.id}`)} style={{ background: 'transparent', border: '1px solid #2E7D67', color: '#A7C7BC', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                                            View Details
                                        </button>
                                        <button onClick={() => handleStartAssign(g)} style={{ background: assigningId === g.id ? '#F97316' : '#2E7D67', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                                            {g.mediator ? 'Reassign' : 'Assign Mediator'}
                                        </button>
                                    </div>
                                </div>

                                {/* Assign Interface (Collapsible) */}
                                {assigningId === g.id && (
                                    <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid #F97316' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontWeight: 'bold', fontSize: 13, color: '#F97316' }}>Select Mediator</span>
                                            <button onClick={() => setAssigningId(null)} style={{ background: 'none', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}><X size={14} /></button>
                                        </div>
                                        
                                        <div style={{ position: 'relative', marginBottom: 12 }}>
                                            <div style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none' }}><ChevronDown size={14} color="#A7C7BC"/></div>
                                            <select 
                                                value={selectedMediatorId}
                                                onChange={e => setSelectedMediatorId(e.target.value)}
                                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid #2E7D67', color: 'white', appearance: 'none', fontSize: 13 }}
                                            >
                                                <option value="">Select a certified mediator...</option>
                                                {availableMediators.filter(u => !excludedIds.has(u.id)).map(u => (
                                                    <option key={u.id} value={u.id}>
                                                        {u.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {availableMediators.filter(u => !excludedIds.has(u.id)).length === 0 && (
                                             <div style={{ marginBottom: 10, fontSize: 12, color: '#F97316', fontStyle: 'italic', display: 'flex', gap: 6, alignItems: 'center' }}>
                                                <AlertTriangle size={14}/> No eligible mediators found.
                                             </div>
                                        )}

                                        <button 
                                            onClick={handleAssignMediator} 
                                            disabled={!selectedMediatorId}
                                            style={{ width: '100%', background: selectedMediatorId ? '#F97316' : 'rgba(255,255,255,0.05)', color: selectedMediatorId ? 'white' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 10, fontWeight: 'bold', cursor: selectedMediatorId ? 'pointer' : 'default', transition: 'all 0.2s' }}
                                        >
                                            Confirm Assignment
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGrievances;
