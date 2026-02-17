import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Scale, AlertTriangle, Clock, CheckCircle2, XCircle,
    User, Users, MapPin, Calendar, ThumbsUp, ThumbsDown, Minus, Send, 
    Shield, FileText, MessageSquare, Upload, X, Camera, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
    open: { label: 'Open', color: '#FBBF24', icon: <AlertTriangle size={16} />, desc: 'Awaiting review and response' },
    under_review: { label: 'Under Review', color: '#60A5FA', icon: <Clock size={16} />, desc: 'Being reviewed by mediator' },
    mediation: { label: 'In Mediation', color: '#A78BFA', icon: <Scale size={16} />, desc: 'Parties are negotiating a resolution' },
    resolved: { label: 'Resolved', color: '#4ADE80', icon: <CheckCircle2 size={16} />, desc: 'Case resolved successfully' },
    dismissed: { label: 'Dismissed', color: '#EF4444', icon: <XCircle size={16} />, desc: 'Case dismissed' },
};

const priorityColors = {
    low: '#A7C7BC', medium: '#FBBF24', high: '#F97316', critical: '#EF4444',
};

const noteTypeConfig = {
    response: { label: 'Response', color: '#60A5FA', icon: <MessageSquare size={14} /> },
    note: { label: 'Note', color: '#A7C7BC', icon: <FileText size={14} /> },
    mediation: { label: 'Mediation', color: '#A78BFA', icon: <Scale size={14} /> },
    proposal: { label: 'Proposal', color: '#FBBF24', icon: <AlertCircle size={14} /> },
    decision: { label: 'Decision', color: '#4ADE80', icon: <CheckCircle2 size={14} /> },
    escalation: { label: 'Escalation', color: '#EF4444', icon: <AlertTriangle size={14} /> },
};

// Workflow transitions based on role
const getAvailableTransitions = (currentStatus, isReporter, isRespondent, isMediator) => {
    const transitions = [];
    if (currentStatus === 'open') {
        if (isMediator || isReporter) transitions.push('under_review');
    }
    if (currentStatus === 'under_review') {
        if (isMediator) transitions.push('mediation');
        if (isMediator) transitions.push('dismissed');
    }
    if (currentStatus === 'mediation') {
        if (isMediator || isReporter) transitions.push('resolved');
        if (isMediator) transitions.push('dismissed');
    }
    if (currentStatus === 'open' || currentStatus === 'under_review') {
        if (isMediator) transitions.push('mediation');
    }
    // Remove duplicates
    return [...new Set(transitions)];
};

const GrievanceDetails = () => {
    const { id } = useParams();
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [grievance, setGrievance] = useState(null);
    const [notes, setNotes] = useState([]);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [noteType, setNoteType] = useState('response');
    const [submitting, setSubmitting] = useState(false);
    const [voting, setVoting] = useState(false);
    const [resolutionText, setResolutionText] = useState('');
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [noteEvidence, setNoteEvidence] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => { fetchAll(); }, [id]);

    useEffect(() => {
        if (grievance && user) {
            const isReporter = user.id === grievance.reporter_id;
            const isMediator = user.id === grievance.mediator_id;
            if (isMediator || isAdmin) setNoteType('mediation');
            else if (isReporter) setNoteType('note');
            else setNoteType('response');
        }
    }, [grievance, user, isAdmin]);

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
                    mediator:users!grievances_mediator_id_fkey(id, name, avatar_url),
                    group:groups!grievances_group_id_fkey(id, name)
                `)
                .eq('id', id)
                .single();
            if (error) throw error;
            setGrievance(data);
        } catch (error) { console.error('Error fetching grievance:', error); }
    };

    const fetchNotes = async () => {
        const { data } = await supabase
            .from('resolution_notes')
            .select('*, author:users!resolution_notes_author_id_fkey(id, name, avatar_url)')
            .eq('grievance_id', id)
            .order('created_at', { ascending: true });
        setNotes(data || []);
    };

    const fetchVotes = async () => {
        const { data } = await supabase.from('grievance_votes').select('*').eq('grievance_id', id);
        setVotes(data || []);
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setSubmitting(true);
        try {
            const payload = { 
                grievance_id: id, author_id: user.id, content: newNote.trim(), note_type: noteType 
            };
            if (noteEvidence.length > 0) payload.evidence_urls = noteEvidence;
            const { error } = await supabase.from('resolution_notes').insert(payload);
            if (error) throw error;
            setNewNote('');
            setNoteEvidence([]);
            fetchNotes();
            toast.success('Response added');
        } catch (error) {
            toast.error('Failed to add response');
        } finally { setSubmitting(false); }
    };

    const handleNoteEvidenceUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage.from('grievances').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('grievances').getPublicUrl(fileName);
            setNoteEvidence(prev => [...prev, data.publicUrl]);
            toast.success('Evidence attached');
        } catch (error) {
            toast.error('Failed to upload');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleVote = async (voteValue) => {
        setVoting(true);
        try {
            const existingVote = votes.find(v => v.user_id === user.id);
            if (existingVote) { toast.info('You have already voted'); return; }
            const { error } = await supabase.from('grievance_votes').insert({ grievance_id: id, user_id: user.id, vote: voteValue });
            if (error) throw error;
            fetchVotes();
            toast.success('Vote recorded');
        } catch (error) { toast.error('Failed to vote'); }
        finally { setVoting(false); }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === 'resolved') {
            setShowResolveModal(true);
            return;
        }
        try {
            const updates = { status: newStatus, updated_at: new Date().toISOString() };
            const { error } = await supabase.from('grievances').update(updates).eq('id', id);
            if (error) throw error;
            // Auto-add status change note
            await supabase.from('resolution_notes').insert({
                grievance_id: id, author_id: user.id, 
                content: `Status changed to "${statusConfig[newStatus]?.label}"`,
                note_type: newStatus === 'dismissed' ? 'decision' : 'mediation'
            });
            fetchAll();
            toast.success(`Status updated to ${statusConfig[newStatus]?.label}`);
        } catch (error) { toast.error('Failed to update status'); }
    };

    const handleResolve = async () => {
        if (!resolutionText.trim()) {
            toast.error('Please describe the resolution');
            return;
        }
        try {
            const { error } = await supabase.from('grievances').update({
                status: 'resolved',
                resolution_text: resolutionText.trim(),
                resolved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
            await supabase.from('resolution_notes').insert({
                grievance_id: id, author_id: user.id,
                content: `✅ Case resolved: ${resolutionText.trim()}`,
                note_type: 'decision'
            });
            setShowResolveModal(false);
            setResolutionText('');
            fetchAll();
            toast.success('Case resolved! Resolution recorded.');
        } catch (error) { toast.error('Failed to resolve'); }
    };

    const handleAssignMediator = async () => {
        // Self-assign as mediator (in a full system, this would be admin-assigned)
        try {
            const { error } = await supabase.from('grievances').update({
                mediator_id: user.id, updated_at: new Date().toISOString()
            }).eq('id', id);
            if (error) throw error;
            await supabase.from('resolution_notes').insert({
                grievance_id: id, author_id: user.id,
                content: 'Assigned as mediator for this case',
                note_type: 'mediation'
            });
            fetchAll();
            toast.success('You are now the mediator for this case');
        } catch (error) { toast.error('Failed to assign mediator'); }
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
    const canManage = isMediator || isAdmin;
    const isInvolved = isReporter || isRespondent || isMediator || isAdmin;
    const isClosed = grievance.status === 'resolved' || grievance.status === 'dismissed';
    const availableTransitions = getAvailableTransitions(grievance.status, isReporter, isRespondent, canManage);

    const supportReporter = votes.filter(v => v.vote === 'support_reporter').length;
    const supportRespondent = votes.filter(v => v.vote === 'support_respondent').length;
    const neutralVotes = votes.filter(v => v.vote === 'neutral').length;
    const userVote = votes.find(v => v.user_id === user?.id);



    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 10, 
                background: 'rgba(11, 61, 46, 0.95)', backdropFilter: 'blur(10px)',
                padding: '12px 16px', borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', gap: 10
            }}>
                <button onClick={() => navigate('/grievances')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4 }}>
                    <ArrowLeft size={22} />
                </button>
                <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Case Details
                </h1>
                {isInvolved && (
                    <span style={{ background: `${cfg.color}22`, color: cfg.color, fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 10, border: `1px solid ${cfg.color}44`, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        {isReporter ? 'Reporter' : isRespondent ? 'Respondent' : 'Mediator'}
                    </span>
                )}
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
                
                {/* Workflow Progress Bar */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                    {['open', 'under_review', 'mediation', 'resolved'].map((s, i) => {
                        const sCfg = statusConfig[s];
                        const steps = ['open', 'under_review', 'mediation', 'resolved'];
                        const currentIdx = steps.indexOf(grievance.status);
                        const isActive = i <= currentIdx && grievance.status !== 'dismissed';
                        return (
                            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ height: 4, borderRadius: 2, background: isActive ? sCfg.color : 'rgba(255,255,255,0.08)', marginBottom: 6, transition: 'background 0.3s' }} />
                                <div style={{ fontSize: 10, color: isActive ? sCfg.color : '#A7C7BC', fontWeight: isActive ? 'bold' : 'normal' }}>{sCfg.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Status & Priority Bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44`, fontSize: 13, fontWeight: 'bold', padding: '5px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {cfg.icon} {cfg.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 'bold', padding: '5px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: priorityColors[grievance.priority], textTransform: 'uppercase' }}>
                        {grievance.priority} priority
                    </span>
                    {grievance.category && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: 12, color: '#A7C7BC', textTransform: 'capitalize' }}>
                            {grievance.category.replace(/_/g, ' ')}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 22, fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: 1.3 }}>{grievance.title}</h2>

                {/* Parties */}
                <div className="grievance-parties" style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                    {/* Reporter */}
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 14, border: '1px solid #2E7D67' }}>
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
                    <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 14, border: '1px solid #2E7D67' }}>
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
                        ) : grievance.group ? (
                             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F97316', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Users size={18} color="white" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{grievance.group.name}</div>
                                    <div style={{ fontSize: 11, color: '#A7C7BC' }}>Group / Co-op</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>General grievance — no specific respondent</div>
                        )}
                    </div>
                </div>

                {/* Mediator */}
                <div style={{ background: grievance.mediator ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, border: `1px solid ${grievance.mediator ? 'rgba(167, 139, 250, 0.3)' : '#2E7D67'}`, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Shield size={18} style={{ color: '#A78BFA' }} />
                        {grievance.mediator ? (
                            <span style={{ fontSize: 13, color: '#A7C7BC' }}>Mediator: <strong style={{ color: '#F2F1EE' }}>{grievance.mediator.name}</strong></span>
                        ) : (
                            <span style={{ fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>No mediator assigned yet</span>
                        )}
                    </div>

                </div>

                {/* Location & Date */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 13, color: '#A7C7BC', flexWrap: 'wrap' }}>
                    {grievance.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} /> {grievance.location}</span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> Filed {new Date(grievance.created_at).toLocaleDateString()}</span>
                    {grievance.resolved_at && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ADE80' }}><CheckCircle2 size={14} /> Resolved {new Date(grievance.resolved_at).toLocaleDateString()}</span>
                    )}
                </div>

                {/* Description */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', padding: 20, borderRadius: 16, border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginTop: 0, marginBottom: 10 }}>Description</h3>
                    <p style={{ color: '#D1D5D8', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontSize: 14 }}>{grievance.description}</p>
                </div>

                {/* Evidence */}
                {grievance.evidence_urls && grievance.evidence_urls.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginBottom: 10 }}>Evidence ({grievance.evidence_urls.length})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                            {grievance.evidence_urls.map((url, idx) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: 100, borderRadius: 10, overflow: 'hidden', border: '1px solid #2E7D67' }}>
                                    <img src={url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resolution (if resolved) */}
                {grievance.status === 'resolved' && grievance.resolution_text && (
                    <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#4ADE80', marginTop: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={16} /> Resolution
                        </h3>
                        <p style={{ margin: 0, color: '#D1D5D8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{grievance.resolution_text}</p>
                    </div>
                )}

                {/* Community Vote */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 18, border: '1px solid #2E7D67', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 'bold', marginTop: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ThumbsUp size={16} /> Community Vote ({votes.length})
                    </h3>
                    
                    {/* Vote Counts */}
                    <div className="vote-grid" style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                        <div style={{ textAlign: 'center', padding: 10, background: 'rgba(74, 222, 128, 0.1)', borderRadius: 10, border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4ADE80' }}>{supportReporter}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Support Reporter</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 10, background: 'rgba(167, 199, 188, 0.1)', borderRadius: 10, border: '1px solid rgba(167, 199, 188, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#A7C7BC' }}>{neutralVotes}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Neutral</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: 10, background: 'rgba(251, 191, 36, 0.1)', borderRadius: 10, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FBBF24' }}>{supportRespondent}</div>
                            <div style={{ fontSize: 11, color: '#A7C7BC' }}>Support Respondent</div>
                        </div>
                    </div>

                    {/* Vote Buttons */}
                    {!userVote && !isReporter && !isRespondent && !isClosed ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleVote('support_reporter')} disabled={voting} style={{ flex: 1, background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 10, padding: '8px 6px', cursor: 'pointer', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <ThumbsUp size={14} /> Reporter
                            </button>
                            <button onClick={() => handleVote('neutral')} disabled={voting} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#A7C7BC', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 6px', cursor: 'pointer', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <Minus size={14} /> Neutral
                            </button>
                            <button onClick={() => handleVote('support_respondent')} disabled={voting} style={{ flex: 1, background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 10, padding: '8px 6px', cursor: 'pointer', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <ThumbsDown size={14} /> Respondent
                            </button>
                        </div>
                    ) : userVote ? (
                        <div style={{ textAlign: 'center', fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>
                            You voted: <strong style={{ color: '#F2F1EE' }}>{userVote.vote.replace(/_/g, ' ')}</strong>
                        </div>
                    ) : (isReporter || isRespondent) ? (
                        <div style={{ textAlign: 'center', fontSize: 13, color: '#A7C7BC', fontStyle: 'italic' }}>
                            Involved parties cannot vote
                        </div>
                    ) : null}
                </div>

                {/* Status Management */}
                {!isClosed && availableTransitions.length > 0 && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 16, border: '1px solid #2E7D67', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginTop: 0, marginBottom: 10 }}>Advance Case</h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {availableTransitions.map(key => {
                                const scfg = statusConfig[key];
                                return (
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
                                        {scfg.icon} {key === 'resolved' ? 'Mark Resolved' : scfg.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Resolution Log / Timeline */}
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={16} /> Resolution Log ({notes.length})
                    </h3>

                    {notes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 30, color: '#A7C7BC', fontSize: 13, fontStyle: 'italic', background: 'rgba(13,77,58,0.3)', borderRadius: 12 }}>
                            {isRespondent ? 'No responses yet. Add your response below.' : 'No resolution notes yet. Be the first to respond.'}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {notes.map((note, i) => {
                                const ntCfg = noteTypeConfig[note.note_type] || noteTypeConfig.note;
                                const uid = note.author?.id;
                                let roleCfg = { label: 'Participant', color: '#A7C7BC', bg: 'rgba(255,255,255,0.05)' };
                                
                                if (uid === grievance.mediator_id) {
                                    roleCfg = { label: 'Mediator', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' };
                                } else if (uid === grievance.reporter_id) {
                                    roleCfg = { label: 'Reporter', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.08)' };
                                } else if (uid === grievance.against_user_id || (grievance.group && uid !== grievance.reporter_id && uid !== grievance.mediator_id)) {
                                    roleCfg = { label: 'Respondent', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.08)' };
                                }

                                return (
                                    <motion.div key={note.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} style={{ display: 'flex', gap: 10 }}>
                                        {/* Timeline dot */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: roleCfg.color, flexShrink: 0, marginTop: 14 }} />
                                            {i < notes.length - 1 && <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.08)' }} />}
                                        </div>
                                        {/* Content */}
                                        <div style={{ flex: 1, background: roleCfg.bg, borderRadius: 12, padding: 12, marginBottom: 8, border: `1px solid ${roleCfg.color}44`, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 'bold' }}>{note.author?.name || 'System'}</span>

                                                    <span style={{ fontSize: 10, color: ntCfg.color, display: 'flex', alignItems: 'center', gap: 3, opacity: 0.8 }}>
                                                        {ntCfg.icon} {ntCfg.label}
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: 10, color: '#A7C7BC' }}>
                                                    {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: 13, color: '#F2F1EE', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{note.content}</p>
                                            {note.evidence_urls && note.evidence_urls.length > 0 && (
                                                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                                    {note.evidence_urls.map((url, ei) => (
                                                        <a key={ei} href={url} target="_blank" rel="noopener noreferrer">
                                                            <img src={url} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid #2E7D67' }} />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add Note/Response Form */}
                    {!isClosed && (
                        <form onSubmit={handleAddNote} style={{ marginTop: 14 }}>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                                {Object.entries(noteTypeConfig).filter(([key]) => {
                                    if (canManage) return ['mediation', 'decision'].includes(key);
                                    if (isReporter) return ['note', 'escalation'].includes(key);
                                    return ['response', 'proposal'].includes(key);
                                }).map(([key, ntCfg]) => (
                                    <button key={key} type="button" onClick={() => setNoteType(key)}
                                        style={{
                                            background: noteType === key ? `${ntCfg.color}22` : 'rgba(255,255,255,0.05)',
                                            color: noteType === key ? ntCfg.color : '#A7C7BC',
                                            border: noteType === key ? `1px solid ${ntCfg.color}44` : '1px solid transparent',
                                            borderRadius: 8, padding: '3px 8px', cursor: 'pointer',
                                            fontSize: 11, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 3
                                        }}
                                    >
                                        {ntCfg.icon} {ntCfg.label}
                                    </button>
                                ))}
                            </div>

                            {/* Attached evidence preview */}
                            {noteEvidence.length > 0 && (
                                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                                    {noteEvidence.map((url, i) => (
                                        <div key={i} style={{ position: 'relative', width: 50, height: 50 }}>
                                            <img src={url} alt="" style={{ width: '100%', height: '100%', borderRadius: 6, objectFit: 'cover' }} />
                                            <button type="button" onClick={() => setNoteEvidence(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -4, right: -4, background: '#EF4444', border: 'none', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                                                <X size={10} color="white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="file" ref={fileInputRef} onChange={handleNoteEvidenceUpload} style={{ display: 'none' }} accept="image/*,.pdf,video/*" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2E7D67', borderRadius: 10, padding: '0 12px', cursor: 'pointer', color: '#A7C7BC', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                    {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={16} />}
                                </button>
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    placeholder={isRespondent ? 'Add your response, counter-evidence, or proposal...' : isMediator ? 'Add mediation notes or decisions...' : 'Add a note or comment...'}
                                    rows={2}
                                    style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
                                />
                                <button type="submit" disabled={submitting || !newNote.trim()} style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 10, padding: '0 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: submitting || !newNote.trim() ? 0.5 : 1, flexShrink: 0 }}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Resolve Modal */}
            {showResolveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: '#0D4D3A', borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', border: '1px solid #2E7D67' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle2 size={20} style={{ color: '#4ADE80' }} /> Mark as Resolved
                        </h3>
                        <p style={{ color: '#A7C7BC', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                            Describe the resolution — e.g., what actions were agreed upon, repairs funded, buffer zones established, or other outcomes.
                        </p>
                        <textarea
                            value={resolutionText}
                            onChange={e => setResolutionText(e.target.value)}
                            placeholder="e.g., Miners agreed to fund repairs for damaged rice fields. A 50m buffer zone was established between the mine and farmland. Monthly water quality testing will begin."
                            rows={5}
                            style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }}
                        />
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setShowResolveModal(false); setResolutionText(''); }} style={{ background: 'rgba(255,255,255,0.08)', color: '#A7C7BC', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cancel
                            </button>
                            <button onClick={handleResolve} disabled={!resolutionText.trim()} style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', opacity: !resolutionText.trim() ? 0.5 : 1 }}>
                                Confirm Resolution
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-parties { grid-template-columns: 1fr; }
                .vote-grid { grid-template-columns: 1fr 1fr 1fr; }
                @media (min-width: 480px) {
                    .grievance-parties { grid-template-columns: 1fr 1fr; }
                }
            `}</style>
        </div>
    );
};

export default GrievanceDetails;
