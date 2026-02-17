import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Upload, X, AlertTriangle, MapPin, Camera, Users, User } from 'lucide-react';

const categories = [
    { value: 'land_encroachment', label: '🏗️ Land Encroachment' },
    { value: 'mining_pollution', label: '⛏️ Mining Pollution' },
    { value: 'crop_damage', label: '🌿 Crop Damage' },
    { value: 'health_impact', label: '🏥 Health Impact (dust/chemicals)' },
    { value: 'water_contamination', label: '💧 Water Contamination' },
    { value: 'land_dispute', label: '📄 Land Dispute' },
    { value: 'contract_breach', label: '📝 Contract Breach' },
    { value: 'price_dispute', label: '💰 Price Dispute' },
    { value: 'theft', label: '🔒 Theft / Vandalism' },
    { value: 'labor', label: '👷 Labor Issue' },
    { value: 'environmental', label: '🌍 Environmental Damage' },
    { value: 'general', label: '📋 General Grievance' },
];

const FileGrievance = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [groups, setGroups] = useState([]);
    const [againstType, setAgainstType] = useState('user'); // 'user', 'group', 'general'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        against_user_id: null,
        against_user_name: '',
        group_id: null,
        group_name: '',
        location: '',
        evidence_urls: [],
    });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const { data } = await supabase.from('groups').select('id, name').order('name');
        setGroups(data || []);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchUser = async (query) => {
        setSearchUser(query);
        if (query.length < 2) { setUserResults([]); return; }
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, name, avatar_url')
                .ilike('name', `%${query}%`)
                .neq('id', user.id)
                .limit(5);
            if (error) {
                console.error('User search error:', error);
                // Fallback: try without ilike, use a broader match
                const { data: fallbackData } = await supabase
                    .from('users')
                    .select('id, name, avatar_url')
                    .neq('id', user.id)
                    .limit(20);
                const filtered = (fallbackData || []).filter(u => 
                    u.name && u.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);
                setUserResults(filtered);
            } else {
                setUserResults(data || []);
            }
        } catch (err) { console.error('User search exception:', err); }
    };

    const selectUser = (u) => {
        setFormData(prev => ({ ...prev, against_user_id: u.id, against_user_name: u.name }));
        setSearchUser('');
        setUserResults([]);
    };

    const handleEvidenceUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage.from('grievances').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('grievances').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, evidence_urls: [...prev.evidence_urls, data.publicUrl] }));
            toast.success('Evidence uploaded!');
        } catch (error) {
            console.error('Error uploading evidence:', error);
            toast.error('Failed to upload evidence');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeEvidence = (index) => {
        setFormData(prev => ({ ...prev, evidence_urls: prev.evidence_urls.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error('Please provide a title and description');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                reporter_id: user.id,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority,
                location: formData.location || null,
                evidence_urls: formData.evidence_urls.length > 0 ? formData.evidence_urls : null,
                status: 'open',
            };

            if (againstType === 'user' && formData.against_user_id) {
                payload.against_user_id = formData.against_user_id;
            }
            if (againstType === 'group' && formData.group_id) {
                payload.group_id = formData.group_id;
            }

            const { error } = await supabase.from('grievances').insert(payload);
            if (error) throw error;
            toast.success('Grievance filed successfully! Involved parties will be notified.');
            navigate('/grievances');
        } catch (error) {
            console.error('Error filing grievance:', error);
            toast.error('Failed to file grievance');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 15, boxSizing: 'border-box' };

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 10, 
                background: 'rgba(11, 61, 46, 0.95)', backdropFilter: 'blur(10px)',
                padding: '12px 16px', borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', gap: 12
            }}>
                <button onClick={() => navigate('/grievances')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4 }}>
                    <ArrowLeft size={22} />
                </button>
                <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>File a Grievance</h1>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px' }}>
                {/* Workflow Info */}
                <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F97316', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={16} /> How it works
                    </div>
                    <div style={{ fontSize: 13, color: '#A7C7BC', lineHeight: 1.6 }}>
                        <strong>1.</strong> File your complaint with evidence below<br/>
                        <strong>2.</strong> The respondent is notified and can respond<br/>
                        <strong>3.</strong> A mediator facilitates fair resolution<br/>
                        <strong>4.</strong> Community votes on proposals — majority wins<br/>
                        <strong>5.</strong> Resolution tracked and archived for transparency
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Issue Title *</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Graphite mining damaging my rice fields" style={inputStyle} required />
                    </div>

                    {/* Category & Priority */}
                    <div className="grievance-form-row">
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleInputChange} style={inputStyle}>
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🟠 High</option>
                                <option value="critical">🔴 Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Against Party Type Selector */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Filed Against</label>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                            {[
                                { value: 'user', label: 'A Person', icon: <User size={14} /> },
                                { value: 'group', label: 'A Group/Co-op', icon: <Users size={14} /> },
                                { value: 'general', label: 'General', icon: <AlertTriangle size={14} /> },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        setAgainstType(opt.value);
                                        setFormData(prev => ({ ...prev, against_user_id: null, against_user_name: '', group_id: null, group_name: '' }));
                                    }}
                                    style={{
                                        flex: 1, padding: '8px 6px', borderRadius: 10, border: 'none',
                                        background: againstType === opt.value ? '#F97316' : 'rgba(255,255,255,0.08)',
                                        color: againstType === opt.value ? 'white' : '#A7C7BC',
                                        cursor: 'pointer', fontWeight: 'bold', fontSize: 12,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                                    }}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Against User */}
                        {againstType === 'user' && (
                            formData.against_user_id ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid #2E7D67' }}>
                                    <span style={{ fontWeight: 'bold' }}>{formData.against_user_name}</span>
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, against_user_id: null, against_user_name: '' }))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <input value={searchUser} onChange={e => handleSearchUser(e.target.value)} placeholder="Search for a user..." style={inputStyle} />
                                    {userResults.length > 0 && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0D4D3A', borderRadius: '0 0 12px 12px', border: '1px solid #2E7D67', borderTop: 'none', zIndex: 5, maxHeight: 200, overflowY: 'auto' }}>
                                            {userResults.map(u => (
                                                <div key={u.id} onClick={() => selectUser(u)} style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    {u.avatar_url ? (
                                                        <img src={u.avatar_url} style={{ width: 28, height: 28, borderRadius: '50%' }} alt="" />
                                                    ) : (
                                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2E7D67' }} />
                                                    )}
                                                    <span style={{ fontSize: 14 }}>{u.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        {/* Against Group */}
                        {againstType === 'group' && (
                            <select 
                                value={formData.group_id || ''} 
                                onChange={e => setFormData(prev => ({ ...prev, group_id: e.target.value || null }))}
                                style={inputStyle}
                            >
                                <option value="">Select a group or co-op...</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        )}

                        {againstType === 'general' && (
                            <div style={{ fontSize: 12, color: '#A7C7BC', fontStyle: 'italic' }}>
                                No specific party — this will be a general community grievance.
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 'bold' }}>
                            <MapPin size={16} /> Location
                        </label>
                        <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Where did this occur?" style={inputStyle} />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Detailed Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the issue in detail: what happened, when, the impact on your livelihood, health risks, damages, etc."
                            rows={6}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                            required
                        />
                    </div>

                    {/* Evidence Upload */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 'bold' }}>
                            <Camera size={16} /> Evidence (Photos/Documents)
                        </label>
                        <input type="file" ref={fileInputRef} onChange={handleEvidenceUpload} style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx,video/*" />

                        {formData.evidence_urls.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, marginBottom: 12 }}>
                                {formData.evidence_urls.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', height: 90, borderRadius: 10, overflow: 'hidden' }}>
                                        <img src={url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => removeEvidence(idx)} style={{ 
                                            position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', 
                                            border: 'none', padding: 4, cursor: 'pointer', borderRadius: 6,
                                            zIndex: 10
                                        }}>
                                            <X size={16} color="white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div onClick={() => fileInputRef.current.click()} style={{ height: 80, background: 'rgba(13, 77, 58, 0.4)', border: '2px dashed #2E7D67', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A7C7BC', opacity: uploading ? 0.6 : 1 }}>
                            {uploading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : (
                                <>
                                    <Upload size={22} style={{ marginBottom: 4 }} />
                                    <span style={{ fontSize: 13 }}>{formData.evidence_urls.length > 0 ? 'Add More Evidence' : 'Upload Photos, Videos, or Documents'}</span>
                                </>
                            )}
                        </div>
                        <div style={{ fontSize: 11, color: '#A7C7BC', marginTop: 6 }}>
                            Supports images, videos, PDFs, and documents. Strong evidence speeds up resolution.
                        </div>
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" disabled={loading || uploading}
                        style={{ background: '#F97316', color: 'white', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: (loading || uploading) ? 0.7 : 1 }}
                    >
                        {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <AlertTriangle size={20} />}
                        Submit Grievance
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .grievance-form-row { display: flex; gap: 12px; flex-wrap: wrap; }
            `}</style>
        </div>
    );
};

export default FileGrievance;
