import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2, Upload, X, AlertTriangle, MapPin, Camera } from 'lucide-react';

const categories = [
    { value: 'land_dispute', label: 'Land Dispute' },
    { value: 'crop_damage', label: 'Crop Damage' },
    { value: 'contract_breach', label: 'Contract Breach' },
    { value: 'price_dispute', label: 'Price Dispute' },
    { value: 'theft', label: 'Theft / Vandalism' },
    { value: 'labor', label: 'Labor Issue' },
    { value: 'environmental', label: 'Environmental Damage' },
    { value: 'general', label: 'General Grievance' },
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
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        against_user_id: null,
        against_user_name: '',
        location: '',
        evidence_urls: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchUser = async (query) => {
        setSearchUser(query);
        if (query.length < 2) {
            setUserResults([]);
            return;
        }
        try {
            const { data } = await supabase
                .from('users')
                .select('id, name, avatar_url')
                .ilike('name', `%${query}%`)
                .neq('id', user.id)
                .limit(5);
            setUserResults(data || []);
        } catch (err) {
            console.error(err);
        }
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
            const { error: uploadError } = await supabase.storage
                .from('grievances')
                .upload(fileName, file);
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
            const { error } = await supabase
                .from('grievances')
                .insert({
                    reporter_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    priority: formData.priority,
                    against_user_id: formData.against_user_id || null,
                    location: formData.location || null,
                    evidence_urls: formData.evidence_urls.length > 0 ? formData.evidence_urls : null,
                    status: 'open',
                });

            if (error) throw error;
            toast.success('Grievance filed successfully');
            navigate('/grievances');
        } catch (error) {
            console.error('Error filing grievance:', error);
            toast.error('Failed to file grievance');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' };

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
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>File a Grievance</h1>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
                {/* Info Banner */}
                <div style={{ 
                    background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)',
                    borderRadius: 12, padding: 16, marginBottom: 24,
                    display: 'flex', gap: 12, alignItems: 'flex-start'
                }}>
                    <AlertTriangle size={20} style={{ color: '#F97316', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: 13, color: '#A7C7BC', lineHeight: 1.5 }}>
                        File a formal grievance to resolve disputes. A mediator will be assigned to review your case. 
                        Provide clear evidence and descriptions for faster resolution.
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Issue Title *</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Brief summary of the issue" style={inputStyle} required />
                    </div>

                    {/* Category & Priority */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} style={inputStyle}>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleInputChange} style={inputStyle}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Against User */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Against (Person/Party)</label>
                        {formData.against_user_id ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid #2E7D67' }}>
                                <span style={{ fontWeight: 'bold' }}>{formData.against_user_name}</span>
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, against_user_id: null, against_user_name: '' }))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <input
                                    value={searchUser}
                                    onChange={e => handleSearchUser(e.target.value)}
                                    placeholder="Search for a user..."
                                    style={inputStyle}
                                />
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
                        )}
                        <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>Optional – leave blank if the dispute is not against a specific user</div>
                    </div>

                    {/* Location */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
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
                            placeholder="Describe the issue in detail. Include dates, events, and any relevant context..."
                            rows={6}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                            required
                        />
                    </div>

                    {/* Evidence Upload */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Camera size={16} /> Evidence (Photos/Documents)
                        </label>
                        <input type="file" ref={fileInputRef} onChange={handleEvidenceUpload} style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx" />

                        {formData.evidence_urls.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, marginBottom: 12 }}>
                                {formData.evidence_urls.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', height: 90, borderRadius: 10, overflow: 'hidden' }}>
                                        <img src={url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => removeEvidence(idx)} style={{ 
                                            position: 'absolute', top: 4, right: 4, 
                                            background: 'transparent', 
                                            border: 'none', 
                                            padding: 4, 
                                            cursor: 'pointer',
                                            zIndex: 10, 
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' 
                                        }}>
                                            <X size={24} color="white" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div onClick={() => fileInputRef.current.click()} style={{ height: 80, background: 'rgba(13, 77, 58, 0.4)', border: '2px dashed #2E7D67', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A7C7BC', opacity: uploading ? 0.6 : 1 }}>
                            {uploading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : (
                                <>
                                    <Upload size={22} style={{ marginBottom: 4 }} />
                                    <span style={{ fontSize: 13 }}>{formData.evidence_urls.length > 0 ? 'Add More Evidence' : 'Upload Evidence'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" disabled={loading || uploading}
                        style={{ background: '#F97316', color: 'white', border: 'none', borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: (loading || uploading) ? 0.7 : 1 }}
                    >
                        {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : <AlertTriangle />}
                        Submit Grievance
                    </button>
                </form>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default FileGrievance;
