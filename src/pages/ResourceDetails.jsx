import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, BookOpen, Video, FileText, HelpCircle, 
    Eye, Clock, Globe, ExternalLink, User, Calendar, Tag 
} from 'lucide-react';

const typeIcons = {
    article: <FileText size={20} />,
    video: <Video size={20} />,
    guide: <BookOpen size={20} />,
    quiz: <HelpCircle size={20} />,
};

const typeColors = {
    article: '#60A5FA',
    video: '#F472B6',
    guide: '#4ADE80',
    quiz: '#FBBF24',
};

const ResourceDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*, author:users!resources_user_id_fkey(name, avatar_url, location)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setResource(data);

            // Increment view count
            await supabase
                .from('resources')
                .update({ view_count: (data.view_count || 0) + 1 })
                .eq('id', id);
        } catch (error) {
            console.error('Error fetching resource:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!resource) {
        return (
            <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', padding: 20 }}>
                <p>Resource not found.</p>
                <button onClick={() => navigate('/resources')} style={{ color: '#4ADE80', background: 'none', border: 'none', cursor: 'pointer' }}>
                    ← Back to Resources
                </button>
            </div>
        );
    }

    const color = typeColors[resource.type] || '#4ADE80';

    const getLanguageLabel = (code) => {
        const map = { en: '🇬🇧 English', fr: '🇫🇷 Français', mg: '🇲🇬 Malagasy' };
        return map[code] || code;
    };

    const isVideo = resource.type === 'video';
    const isYoutube = resource.content_url && (resource.content_url.includes('youtube.com') || resource.content_url.includes('youtu.be'));

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = null;
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

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
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resource.title}
                </h1>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>

                {/* Video Embed / Thumbnail */}
                {isYoutube ? (
                    <div style={{ 
                        borderRadius: 16, overflow: 'hidden', marginBottom: 24, 
                        aspectRatio: '16/9', background: '#000'
                    }}>
                        <iframe 
                            src={getYoutubeEmbedUrl(resource.content_url)}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={resource.title}
                        />
                    </div>
                ) : resource.thumbnail_url ? (
                    <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
                        <img src={resource.thumbnail_url} alt={resource.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                ) : (
                    <div style={{ 
                        height: 200, borderRadius: 16, marginBottom: 24,
                        background: `linear-gradient(135deg, ${color}22, rgba(0,0,0,0.3))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid #2E7D67'
                    }}>
                        {typeIcons[resource.type] ? React.cloneElement(typeIcons[resource.type], { size: 64, color: color, style: { opacity: 0.4 } }) : <BookOpen size={64} style={{ color, opacity: 0.4 }} />}
                    </div>
                )}

                {/* Meta Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    <span style={{ 
                        background: color, color: '#0B3D2E', 
                        fontSize: 12, fontWeight: 'bold', padding: '4px 12px', borderRadius: 12,
                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4
                    }}>
                        {typeIcons[resource.type]} {resource.type}
                    </span>
                    {resource.category && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 12, color: '#A7C7BC', textTransform: 'capitalize' }}>
                            {resource.category}
                        </span>
                    )}
                    {resource.language && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 12, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Globe size={12} /> {getLanguageLabel(resource.language)}
                        </span>
                    )}
                    {resource.duration && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 12, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} /> {resource.duration}
                        </span>
                    )}
                    {resource.view_count > 0 && (
                        <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 12, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Eye size={12} /> {resource.view_count} views
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 28, fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: 1.3 }}>{resource.title}</h2>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    {resource.author?.avatar_url ? (
                        <img src={resource.author.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="" />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2E7D67', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <User size={20} color="#A7C7BC" />
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{resource.author?.name || 'Anonymous'}</div>
                        <div style={{ fontSize: 12, color: '#A7C7BC', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={12} /> {new Date(resource.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Description / Content */}
                <div style={{ 
                    background: 'rgba(13, 77, 58, 0.4)', padding: 24, borderRadius: 16, 
                    border: '1px solid rgba(46, 125, 103, 0.5)', marginBottom: 24 
                }}>
                    <p style={{ color: '#D1D5D8', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontSize: 15 }}>
                        {resource.description}
                    </p>
                </div>

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', color: '#A7C7BC', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Tag size={14} /> Tags
                        </h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {resource.tags.map(tag => (
                                <span key={tag} style={{ fontSize: 13, background: 'rgba(255,255,255,0.08)', color: '#A7C7BC', padding: '4px 12px', borderRadius: 20 }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* External Link */}
                {resource.content_url && !isYoutube && (
                    <a 
                        href={resource.content_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            background: color, color: '#0B3D2E', 
                            padding: 16, borderRadius: 12, 
                            fontWeight: 'bold', fontSize: 16, textDecoration: 'none',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                        <ExternalLink size={20} />
                        {isVideo ? 'Watch Video' : 'Open Resource'}
                    </a>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ResourceDetails;
