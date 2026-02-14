import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Upload, BookOpen, Video, FileText, 
    HelpCircle, X, Plus, Globe 
} from 'lucide-react';

const types = [
    { value: 'article', label: 'Article', icon: <FileText size={20} />, color: '#60A5FA' },
    { value: 'video', label: 'Video', icon: <Video size={20} />, color: '#F472B6' },
    { value: 'guide', label: 'Guide', icon: <BookOpen size={20} />, color: '#4ADE80' },
    { value: 'quiz', label: 'Quiz', icon: <HelpCircle size={20} />, color: '#FBBF24' },
];

const categories = [
    { value: 'regenerative', label: 'Regenerative Practices' },
    { value: 'vanilla', label: 'Vanilla Cultivation' },
    { value: 'agroforestry', label: 'Agroforestry' },
    { value: 'soil', label: 'Soil Health' },
    { value: 'water', label: 'Water Management' },
    { value: 'business', label: 'Business & Trade' },
    { value: 'guide', label: 'General Guides' },
];

const UploadResource = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const thumbnailInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content_url: '',
        type: 'guide',
        category: 'regenerative',
        language: 'en',
        duration: '',
        thumbnail_url: '',
        tags: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
        setTagInput('');
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handleThumbnailUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `thumb_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        setUploadingThumb(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('resources')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('resources')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, thumbnail_url: data.publicUrl }));
            toast.success('Thumbnail uploaded!');
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            toast.error('Failed to upload thumbnail');
        } finally {
            setUploadingThumb(false);
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            toast.error('Please provide a title');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('resources')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    content_url: formData.content_url || null,
                    type: formData.type,
                    category: formData.category,
                    language: formData.language,
                    duration: formData.duration || null,
                    thumbnail_url: formData.thumbnail_url || null,
                    tags: formData.tags.length > 0 ? formData.tags : null,
                    approved: true, // Auto-approve for now
                });

            if (error) throw error;
            toast.success('Resource uploaded successfully!');
            navigate('/resources');
        } catch (error) {
            console.error('Error creating resource:', error);
            toast.error('Failed to upload resource');
        } finally {
            setLoading(false);
        }
    };

    const selectedType = types.find(t => t.value === formData.type);

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
                <button onClick={() => navigate('/resources')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>Upload Resource</h1>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    {/* Resource Type Selector */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}>Resource Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                            {types.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                    style={{
                                        background: formData.type === type.value ? `${type.color}22` : 'rgba(255,255,255,0.05)',
                                        border: `2px solid ${formData.type === type.value ? type.color : 'transparent'}`,
                                        borderRadius: 12, padding: '14px 8px',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 6,
                                        color: formData.type === type.value ? type.color : '#A7C7BC',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {type.icon}
                                    <span style={{ fontSize: 12, fontWeight: 'bold' }}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Thumbnail</label>
                        <input
                            type="file"
                            ref={thumbnailInputRef}
                            onChange={handleThumbnailUpload}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                        {formData.thumbnail_url ? (
                            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 150 }}>
                                <img src={formData.thumbnail_url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => thumbnailInputRef.current.click()}
                                style={{ height: 100, background: 'rgba(13, 77, 58, 0.4)', border: '2px dashed #2E7D67', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A7C7BC', opacity: uploadingThumb ? 0.6 : 1 }}
                            >
                                {uploadingThumb ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : (
                                    <>
                                        <Upload size={24} style={{ marginBottom: 4 }} />
                                        <span style={{ fontSize: 13 }}>Upload Thumbnail</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., How to Grow Shade Trees for Vanilla"
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16 }}
                            required
                        />
                    </div>

                    {/* Content URL */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            {formData.type === 'video' ? 'Video URL (YouTube, etc.)' : 'Resource Link (optional)'}
                        </label>
                        <input
                            name="content_url"
                            value={formData.content_url}
                            onChange={handleInputChange}
                            placeholder={formData.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16 }}
                        />
                    </div>

                    {/* Category & Language */}
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16 }}
                            >
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Globe size={16} /> Language
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16 }}
                            >
                                <option value="en">🇬🇧 English</option>
                                <option value="fr">🇫🇷 Français</option>
                                <option value="mg">🇲🇬 Malagasy</option>
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            {formData.type === 'video' ? 'Duration (e.g., 12:30)' : 'Estimated Time (e.g., 5 min read)'}
                        </label>
                        <input
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder={formData.type === 'video' ? '12:30' : '5 min read'}
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16 }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            Description / Content *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Write the full article/guide content, or a summary for videos..."
                            rows={8}
                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, resize: 'vertical', lineHeight: 1.6 }}
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Tags</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: formData.tags.length > 0 ? 10 : 0, flexWrap: 'wrap' }}>
                            {formData.tags.map(tag => (
                                <span 
                                    key={tag} 
                                    style={{ 
                                        background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', 
                                        padding: '4px 10px', borderRadius: 20, fontSize: 13,
                                        display: 'flex', alignItems: 'center', gap: 6
                                    }}
                                >
                                    #{tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', color: '#4ADE80', cursor: 'pointer', padding: 0 }}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Add a tag and press Enter"
                                style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 14 }}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                style={{ background: 'rgba(255,255,255,0.1)', color: '#A7C7BC', border: 'none', borderRadius: 12, padding: '0 14px', cursor: 'pointer' }}
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit" 
                        disabled={loading || uploadingThumb}
                        style={{ 
                            background: selectedType?.color || '#4ADE80', color: '#0B3D2E', border: 'none', 
                            borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            opacity: (loading || uploadingThumb) ? 0.7 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : selectedType?.icon}
                        Upload {selectedType?.label || 'Resource'}
                    </button>
                </form>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default UploadResource;
