import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Scale, AlertTriangle, Clock, CheckCircle2, XCircle,
    User, MapPin, Calendar, ThumbsUp, ThumbsDown, Minus, Send, 
    Shield, FileText, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
    open: { label: 'Open', color: '#FBBF24', icon: <AlertTriangle size={16} /> },
    under_review: { label: 'Under Review', color: '#60A5FA', icon: <Clock size={16} /> },
    mediation: { label: 'In Mediation', color: '#A78BFA', icon: <Scale size={16} /> },
    resolved: { label: 'Resolved', color: '#4ADE80', icon: <CheckCircle2 size={16} /> },
    dismissed: { label: 'Dismissed', color: '#EF4444', icon: <XCircle size={16} /> },
};

const priorityColors = {
    low: '#A7C7BC', medium: '#FBBF24', high: '#F97316', critical: '#EF4444',
};

const noteTypeConfig = {
    note: { label: 'Note', color: '#A7C7BC', icon: <FileText size={14} /> },
    mediation: { label: 'Mediation', color: '#A78BFA', icon: <Scale size={14} /> },
    decision: { label: 'Decision', color: '#4ADE80', icon: <CheckCircle2 size={14} /> },
    escalation: { label: 'Escalation', color: '#EF4444', icon: <AlertTriangle size={14} /> },
};

const GrievanceDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [grievance, setGrievance] = useState(null);
    const [notes, setNotes] = useState([]);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [noteType, setNoteType] = useState('note');
    const [submitting, setSubmitting] = useState(false);
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        fetchAll();
    }, [id]);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchGrievance(), fetchNotes(), fetchVotes()]);
        setLoading(false);
    };

    const fetchGrievance = async () => {
        try {
            const { data, error } = await supabase
                .from('grievances')
                .select(`
                    *,
                    reporter:users!grievances_reporter_id_fkey(id, name, avatar_url, location),
                    respondent:users!grievances_against_user_id_fkey(id, name, avatar_url, location),
                    mediator:users!grievances_mediator_id_fkey(id, name, avatar_url)
                `)
                .eq('id', id)
                .single();
            if (error) throw error;
            setGrievance(data);
        } catch (error) {
            console.error('Error fetching grievance:', error);
        }
    };

    const fetchNotes = async () => {
        const { data } = await supabase
            .from('resolution_notes')
            .select('*, author:users!resolution_notes_author_id_fkey(name, avatar_url)')
            .eq('grievance_id', id)
            .order('created_at', { ascending: true });
        setNotes(data || []);
    };

    const fetchVotes = async () => {
        const { data } = await supabase
            .from('grievance_votes')
            .select('*')
            .eq('grievance_id', id);
        setVotes(data || []);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('resolution_notes')
                .insert({ grievance_id: id, author_id: user.id, content: newNote.trim(), note_type: noteType });
            if (error) throw error;
            setNewNote('');
            fetchNotes();
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (voteValue) => {
        setVoting(true);
        try {
            const existingVote = votes.find(v => v.user_id === user.id);
            if (existingVote) {
                toast.info('You have already voted on this case');
                return;
            }
            const { error } = await supabase
                .from('grievance_votes')
                .insert({ grievance_id: id, user_id: user.id, vote: voteValue });
            if (error) throw error;
            fetchVotes();
            toast.success('Vote recorded');
        } catch (error) {
            console.error(error);
            toast.error('Failed to vote');
        } finally {
            setVoting(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const updates = { status: newStatus, updated_at: new Date().toISOString() };
            if (newStatus === 'resolved') updates.resolved_at = new Date().toISOString();

            const { error } = await supabase
                .from('grievances')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            fetchGrievance();
            toast.success(`Status updated to ${statusConfig[newStatus]?.label || newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!grievance) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', padding: 20 }}>
                <p>Grievance not found.</p>
                <button onClick={() => navigate('/grievances')} style={{ color: '#4ADE80', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
            </div>
        );
    }

    const cfg = statusConfig[grievance.status] || statusConfig.open;
    const isReporter = user?.id === grievance.reporter_id;
    const isRespondent = user?.id === grievance.against_user_id;
    const isMediator = user?.id === grievance.mediator_id;
    const isInvolved = isReporter || isRespondent || isMediator;

    const supportReporter = votes.filter(v => v.vote === 'support_reporter').length;
    const supportRespondent = votes.filter(v => v.vote === 'support_respondent').length;
    const neutralVotes = votes.filter(v => v.vote === 'neutral').length;
    const userVote = votes.find(v => v.user_id === user?.id);

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
                <button onClick={() => navigate('/grievances')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Case Details
                </h1>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                
                {/* Status & Priority Bar */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ 
                        background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44`,
                        fontSize: 13, fontWeight: 'bold', padding: '5px 14px', borderRadius: 12,
                        display: 'flex', alignItems: 'center', gap: 6
                    }}>
                        {cfg.icon} {cfg.label}
                    </span>
                    <span style={{ 
                        fontSize: 12, fontWeight: 'bold', padding: '5px 12px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.05)',
                        color: priorityColors[grievance.priority] || '#A7C7BC',
                        textTransform: 'uppercase'
                    }}>
                        {grievance.priority} priority
                    </span>
                    {grievance.category && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: 12, color: '#A7C7BC', textTransform: 'capitalize' }}>
                            {grievance.category.replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 26, fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.3 }}>{grievance.title}</h2>

                {/* Parties */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    {/* Reporter */}
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 16, border: '1px solid #2E7D67' }}>
                        <div style={{ fontSize: 11, color: '#A7C7BC', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' }}>Reporter</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {grievance.reporter?.avatar_url ? (
                                <img src={grievance.reporter.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%' }} alt="" />
                            ) : (
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <User size={18} color="#A7C7BC" />
                                </div>
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{grievance.reporter?.name || 'Anonymous'}</div>
                                {grievance.reporter?.location && <div style={{ fontSize: 11, color: '#A7C7BC' }}>{grievance.reporter.location}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Respondent */}
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 16, border: '1px solid #2E7D67' }}>
                        <div style={{ fontSize: 11, color: '#A7C7BC', fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' }}>Respondent</div>
                        {grievance.respondent ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                {grievance.respondent?.avatar_url ? (
                                    <img src={grievance.respondent.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%' }} alt="" />
                                ) : (
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <User size={18} color="#A7C7BC" />
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{grievance.respondent.name}</div>
                                    {grievance.respondent?.location && <div style={{ fontSize: 11, color: '#A7C7BC' }}>{grievance.respondent.location}</div>}
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>No specific respondent</div>
                        )}
                    </div>
                </div>

                {/* Mediator */}
                {grievance.mediator && (
                    <div style={{ background: 'rgba(167, 139, 250, 0.1)', borderRadius: 12, padding: 14, border: '1px solid rgba(167, 139, 250, 0.3)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Shield size={18} style={{ color: '#A78BFA' }} />
                        <span style={{ fontSize: 13, color: '#A7C7BC' }}>Mediator: <strong style={{ color: '#F2F1EE' }}>{grievance.mediator.name}</strong></span>
                    </div>
                )}

                {/* Location & Date */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: 13, color: '#A7C7BC' }}>
                    {grievance.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={14} /> {grievance.location}
                        </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={14} /> Filed {new Date(grievance.created_at).toLocaleDateString()}
                    </span>
                </div>

                {/* Description */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 24, borderRadius: 16, border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginTop: 0, marginBottom: 12 }}>Description</h3>
                    <p style={{ color: '#D1D5D8', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontSize: 15 }}>{grievance.description}</p>
                </div>

                {/* Evidence */}
                {grievance.evidence_urls && grievance.evidence_urls.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginBottom: 12 }}>Evidence ({grievance.evidence_urls.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                            {grievance.evidence_urls.map((url, idx) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: 120, borderRadius: 12, overflow: 'hidden', border: '1px solid #2E7D67' }}>
                                    <img src={url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Community Vote */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 20, border: '1px solid #2E7D67', marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 'bold', marginTop: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ThumbsUp size={18} /> Community Vote
                    </h3>
                    
                    {/* Vote Counts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                        <div style={{ textAlign: 'center', padding: 12, background: 'rgba(74, 222, 128, 0.1)', borderRadius: 10, border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4ADE80' }}>{supportReporter}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Support Reporter</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: 'rgba(167, 199, 188, 0.1)', borderRadius: 10, border: '1px solid rgba(167, 199, 188, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#A7C7BC' }}>{neutralVotes}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Neutral</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 12, background: 'rgba(251, 191, 36, 0.1)', borderRadius: 10, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FBBF24' }}>{supportRespondent}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Support Respondent</div>
                        </div>
                    </div>

                    {/* Vote Buttons */}
                    {!userVote && !isReporter && !isRespondent ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleVote('support_reporter')} disabled={voting} style={{ flex: 1, background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <ThumbsUp size={16} /> Reporter
                            </button>
                            <button onClick={() => handleVote('neutral')} disabled={voting} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#A7C7BC', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Minus size={16} /> Neutral
                            </button>
                            <button onClick={() => handleVote('support_respondent')} disabled={voting} style={{ flex: 1, background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <ThumbsDown size={16} /> Respondent
                            </button>
                        </div>
                    ) : userVote ? (
                        <div style={{ textAlign: 'center', fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>
                            You voted: <strong style={{ color: '#F2F1EE' }}>{userVote.vote.replace('_', ' ')}</strong>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>
                            Involved parties cannot vote
                        </div>
                    )}
                </div>

                {/* Status Management (for involved parties) */}
                {isInvolved && grievance.status !== 'resolved' && grievance.status !== 'dismissed' && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 20, border: '1px solid #2E7D67', marginBottom: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginTop: 0, marginBottom: 12 }}>Update Status</h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {Object.entries(statusConfig).map(([key, scfg]) => (
                                key !== grievance.status && (
                                    <button
                                        key={key}
                                        onClick={() => handleStatusUpdate(key)}
                                        style={{
                                            background: `${scfg.color}15`, color: scfg.color,
                                            border: `1px solid ${scfg.color}33`, borderRadius: 10,
                                            padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold',
                                            fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
                                        }}
                                    >
                                        {scfg.icon} {scfg.label}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Resolution Notes / Timeline */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={18} /> Resolution Log ({notes.length})
                    </h3>

                    {notes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 30, color: '#A7C7BC', fontSize: 13, fontStyle: 'italic', background: 'rgba(13,77,58,0.3)', borderRadius: 12 }}>
                            No resolution notes yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {notes.map((note, i) => {
                                const ntCfg = noteTypeConfig[note.note_type] || noteTypeConfig.note;
                                return (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ display: 'flex', gap: 12 }}
                                    >
                                        {/* Timeline Line */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ntCfg.color, flexShrink: 0, marginTop: 16 }} />
                                            {i < notes.length - 1 && <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.08)' }} />}
                                        </div>
                                        {/* Content */}
                                        <div style={{ flex: 1, background: 'rgba(13, 77, 58, 0.3)', borderRadius: 12, padding: 14, marginBottom: 8, border: `1px solid ${ntCfg.color}22` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 11, background: `${ntCfg.color}22`, color: ntCfg.color, padding: '2px 8px', borderRadius: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        {ntCfg.icon} {ntCfg.label}
                                                    </span>
                                                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{note.author?.name || 'System'}</span>
                                                </div>
                                                <span style={{ fontSize: 11, color: '#A7C7BC' }}>
                                                    {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: 14, color: '#D1D5D8', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add Note Form */}
                    <form onSubmit={handleAddNote} style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            {Object.entries(noteTypeConfig).map(([key, ntCfg]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setNoteType(key)}
                                    style={{
                                        background: noteType === key ? `${ntCfg.color}22` : 'rgba(255,255,255,0.05)',
                                        color: noteType === key ? ntCfg.color : '#A7C7BC',
                                        border: noteType === key ? `1px solid ${ntCfg.color}44` : '1px solid transparent',
                                        borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                                        fontSize: 12, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4
                                    }}
                                >
                                    {ntCfg.icon} {ntCfg.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <textarea
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                placeholder="Add a resolution note..."
                                rows={2}
                                style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14, resize: 'vertical' }}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newNote.trim()}
                                style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 12, padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: submitting || !newNote.trim() ? 0.5 : 1 }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Resolution Text (if resolved) */}
                {grievance.status === 'resolved' && grievance.resolution_text && (
                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#4ADE80', marginTop: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={16} /> Resolution
                        </h3>
                        <p style={{ margin: 0, color: '#D1D5D8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{grievance.resolution_text}</p>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default GrievanceDetails;
