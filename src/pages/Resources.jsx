import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Plus, Search, BookOpen, Video, FileText, 
    HelpCircle, Eye, Clock, Globe, Filter, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons = {
    article: <FileText size={18} />,
    video: <Video size={18} />,
    guide: <BookOpen size={18} />,
    quiz: <HelpCircle size={18} />,
};

const typeColors = {
    article: '#60A5FA',
    video: '#F472B6',
    guide: '#4ADE80',
    quiz: '#FBBF24',
};

const categories = [
    { value: 'all', label: 'All' },
    { value: 'regenerative', label: 'Regenerative Practices' },
    { value: 'vanilla', label: 'Vanilla Cultivation' },
    { value: 'agroforestry', label: 'Agroforestry' },
    { value: 'soil', label: 'Soil Health' },
    { value: 'water', label: 'Water Management' },
    { value: 'business', label: 'Business & Trade' },
    { value: 'guide', label: 'General Guides' },
];

const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'mg', label: '🇲🇬 Malagasy' },
];

const Resources = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*, author:users!resources_user_id_fkey(name, avatar_url)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResources(data || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = useMemo(() => {
        return resources.filter(r => {
            const matchesSearch = searchQuery === '' || 
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
            const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
            const matchesType = selectedType === 'all' || r.type === selectedType;
            const matchesLanguage = selectedLanguage === 'all' || r.language === selectedLanguage;
            return matchesSearch && matchesCategory && matchesType && matchesLanguage;
        });
    }, [resources, searchQuery, selectedCategory, selectedType, selectedLanguage]);

    const activeFilterCount = [selectedCategory, selectedType, selectedLanguage].filter(v => v !== 'all').length;

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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>
                            <BookOpen size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                            Resources
                        </h1>
                    </div>
                    {user && (
                        <button 
                            onClick={() => navigate('/upload-resource')}
                            style={{ background: '#4ADE80', color: '#0B3D2E', border: 'none', borderRadius: 20, padding: '8px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                        >
                            <Plus size={18} /> Upload
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A7C7BC' }} />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search tutorials, guides, videos..."
                            style={{ 
                                width: '100%', padding: '10px 12px 10px 40px', borderRadius: 12, 
                                border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', 
                                color: 'white', fontSize: 14 
                            }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ 
                            background: activeFilterCount > 0 ? '#4ADE80' : 'rgba(255,255,255,0.1)', 
                            color: activeFilterCount > 0 ? '#0B3D2E' : '#A7C7BC',
                            border: 'none', borderRadius: 12, padding: '10px 14px', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold'
                        }}
                    >
                        <Filter size={18} />
                        {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                
                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', marginBottom: 20 }}
                        >
                            <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 20, border: '1px solid #2E7D67' }}>
                                {/* Type Filter */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 13, color: '#A7C7BC' }}>Type</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {['all', 'article', 'video', 'guide', 'quiz'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                style={{
                                                    background: selectedType === type ? (typeColors[type] || '#4ADE80') : 'rgba(255,255,255,0.08)',
                                                    color: selectedType === type ? '#0B3D2E' : '#A7C7BC',
                                                    border: 'none', borderRadius: 20, padding: '6px 14px',
                                                    cursor: 'pointer', textTransform: 'capitalize', fontWeight: 'bold', fontSize: 13,
                                                    display: 'flex', alignItems: 'center', gap: 6
                                                }}
                                            >
                                                {type !== 'all' && typeIcons[type]}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 13, color: '#A7C7BC' }}>Category</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.value}
                                                onClick={() => setSelectedCategory(cat.value)}
                                                style={{
                                                    background: selectedCategory === cat.value ? '#4ADE80' : 'rgba(255,255,255,0.08)',
                                                    color: selectedCategory === cat.value ? '#0B3D2E' : '#A7C7BC',
                                                    border: 'none', borderRadius: 20, padding: '6px 14px',
                                                    cursor: 'pointer', fontWeight: 'bold', fontSize: 13
                                                }}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language Filter */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 13, color: '#A7C7BC' }}>Language</label>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {languages.map(lang => (
                                            <button
                                                key={lang.value}
                                                onClick={() => setSelectedLanguage(lang.value)}
                                                style={{
                                                    background: selectedLanguage === lang.value ? '#4ADE80' : 'rgba(255,255,255,0.08)',
                                                    color: selectedLanguage === lang.value ? '#0B3D2E' : '#A7C7BC',
                                                    border: 'none', borderRadius: 20, padding: '6px 14px',
                                                    cursor: 'pointer', fontWeight: 'bold', fontSize: 13
                                                }}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {activeFilterCount > 0 && (
                                    <button 
                                        onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSelectedLanguage('all'); }}
                                        style={{ marginTop: 16, background: 'transparent', border: '1px solid #A7C7BC', color: '#A7C7BC', borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Count */}
                <div style={{ marginBottom: 16, fontSize: 14, color: '#A7C7BC' }}>
                    {loading ? 'Loading...' : `${filteredResources.length} resource${filteredResources.length !== 1 ? 's' : ''} found`}
                </div>

                {/* Resource List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                        <Loader2 size={32} style={{ color: '#4ADE80', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 60, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16 }}>
                        <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p style={{ fontSize: 16 }}>No resources found.</p>
                        <p style={{ fontSize: 13, marginBottom: 16 }}>Try adjusting your search or filters.</p>
                        {user && (
                            <button 
                                onClick={() => navigate('/upload-resource')}
                                style={{ background: 'transparent', border: '1px solid #4ADE80', color: '#4ADE80', padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Upload a Resource
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filteredResources.map((resource, i) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/resource/${resource.id}`)}
                                style={{ 
                                    display: 'flex', gap: 16, 
                                    background: 'rgba(13, 77, 58, 0.4)', 
                                    borderRadius: 16, 
                                    border: '1px solid #2E7D67',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, border-color 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#4ADE80'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2E7D67'; }}
                            >
                                {/* Thumbnail */}
                                <div style={{ 
                                    width: 140, minHeight: 120, flexShrink: 0,
                                    background: `linear-gradient(135deg, ${typeColors[resource.type] || '#4ADE80'}33, rgba(0,0,0,0.3))`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {resource.thumbnail_url ? (
                                        <img src={resource.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ color: typeColors[resource.type] || '#4ADE80', opacity: 0.6 }}>
                                            {typeIcons[resource.type] ? React.cloneElement(typeIcons[resource.type], { size: 36 }) : <BookOpen size={36} />}
                                        </div>
                                    )}
                                    {/* Type Badge */}
                                    <span style={{ 
                                        position: 'absolute', top: 8, left: 8,
                                        background: typeColors[resource.type] || '#4ADE80', 
                                        color: '#0B3D2E', 
                                        fontSize: 10, fontWeight: 'bold', padding: '2px 8px', borderRadius: 8,
                                        textTransform: 'uppercase'
                                    }}>
                                        {resource.type}
                                    </span>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, padding: '14px 14px 14px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 'bold', lineHeight: 1.3 }}>{resource.title}</h3>
                                        <p style={{ margin: 0, fontSize: 13, color: '#A7C7BC', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {resource.description}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#A7C7BC' }}>
                                            {resource.author && (
                                                <span>{resource.author.name}</span>
                                            )}
                                            {resource.duration && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={12} /> {resource.duration}
                                                </span>
                                            )}
                                            {resource.view_count > 0 && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Eye size={12} /> {resource.view_count}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {resource.language && resource.language !== 'en' && (
                                                <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Globe size={10} /> {resource.language.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Resources;
