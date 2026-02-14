import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, Trash2, Send, Loader2, Hash, Tag, ArrowLeft, Users 
} from 'lucide-react';


const MediaPreview = ({ file, url, onRemove }) => {
  const [loading, setLoading] = useState(true);
  const isVideo = file.type.startsWith('video/');

  return (
    <div style={{ position: 'relative', flexShrink: 0, width: 100, height: 100, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1F2937', zIndex: 5 }}>
           <Loader2 size={24} className="animate-spin" color="#4ADE80" />
        </div>
      )}
      
      {isVideo ? (
        <video 
          src={url} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loading ? 0 : 1 }} 
          muted
          playsInline
          onLoadedData={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      ) : (
        <img 
          src={url} 
          alt="Preview" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loading ? 0 : 1 }} 
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      )}
      
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: 4, right: 4,
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#EF4444'; 
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
        }}
      >
        <Trash2 size={16} color="white" style={{ width: '16px', height: '16px' }} />
      </button>

      {isVideo && !loading && (
          <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4, color: 'white', fontSize: 10, zIndex: 10 }}>
            VIDEO
          </div>
      )}
    </div>
  );
};

const NewPost = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, groupName } = location.state || {};

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [hashtags, setHashtags] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMediaSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);

      // Generate previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => {
      URL.revokeObjectURL(prev[index]); // Cleanup
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Post cannot be empty');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Media
      const uploadedUrls = [];
      for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post_media')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      }

      // 2. Process Hashtags
      const processedHashtags = hashtags
        .split(/[ ,]+/)
        .filter(tag => tag.trim() !== '')
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

      // 3. Insert Post
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content,
          category: category,
          hashtags: processedHashtags,
          media_urls: uploadedUrls,
          group_id: groupId || null,
          is_emergency: false // Default for now
        });

      if (insertError) throw insertError;

      toast.success(t('auth.posts.success'));
      if (groupId) {
        navigate(`/group/${groupId}`);
      } else {
        navigate('/feed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B3D2E',
      display: 'flex',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}
          >
            <ArrowLeft />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#F2F1EE' }}>{t('auth.posts.create_title')}</h1>
        </div>

        {groupId && (
          <div style={{ 
            background: 'rgba(74, 222, 128, 0.1)', 
            border: '1px solid #4ADE80', 
            borderRadius: 12, 
            padding: '12px 16px', 
            marginBottom: 16,
            color: '#4ADE80',
            display: 'flex', alignItems: 'center', gap: 8,
            fontWeight: 'bold'
          }}>
             <Users size={18} /> Posting to Group: {groupName}
          </div>
        )}

        <div style={{
          background: 'rgba(13, 77, 58, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #2E7D67',
          borderRadius: 16,
          padding: 24,
        }}>
          {/* User Info header could go here */}
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('auth.posts.placeholder')}
            rows={6}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#F2F1EE',
              fontSize: 16,
              resize: 'none',
              outline: 'none',
              marginBottom: 20,
              fontFamily: 'inherit'
            }}
          />

          {/* Media Previews */}
          {mediaFiles.length > 0 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 20, paddingBottom: 10 }}>
              {mediaFiles.map((file, index) => (
                <MediaPreview 
                  key={index}
                  file={file}
                  url={mediaPreviews[index]}
                  onRemove={() => removeMedia(index)}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A7C7BC', fontSize: 13, marginBottom: 4 }}>
                  <Tag size={14} /> {t('auth.posts.category')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0B3D2E',
                    border: '1px solid #2E7D67',
                    color: 'white',
                    padding: '10px',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                >
                  <option value="general">{t('auth.posts.categories.general')}</option>
                  <option value="DroughtResilience">{t('auth.posts.categories.drought_resilience')}</option>
                  <option value="MineRestoration">{t('auth.posts.categories.mine_restoration')}</option>
                  <option value="MarketAccess">{t('auth.posts.categories.market_access')}</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A7C7BC', fontSize: 13, marginBottom: 4 }}>
                  <Hash size={14} /> {t('auth.posts.hashtags')}
                </label>
                <input 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder={t('auth.posts.hashtags_placeholder')}
                  style={{
                    width: '100%',
                    background: '#0B3D2E',
                    border: '1px solid #2E7D67',
                    color: 'white',
                    padding: '10px',
                    borderRadius: 8,
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ height: 1, background: '#2E7D67', margin: '8px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <label 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, 
                    color: '#4ADE80', cursor: 'pointer', 
                    padding: '8px 12px', borderRadius: 8,
                    background: 'rgba(74, 222, 128, 0.1)'
                  }}
                >
                  <ImageIcon size={18} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{t('auth.posts.upload_media')}</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    onChange={handleMediaSelect}
                    hidden
                  />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || (!content && mediaFiles.length === 0)}
                style={{
                  background: '#4ADE80',
                  color: '#0B3D2E',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 12,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading || (!content && mediaFiles.length === 0) ? 0.6 : 1
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {t('auth.posts.submit')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NewPost;
