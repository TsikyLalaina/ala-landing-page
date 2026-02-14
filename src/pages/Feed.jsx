import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, MapPin, Loader2,
  Home, PlusSquare, User, LogOut, Users, ShoppingCart, BookOpen, Scale, Radio, ClipboardList, Calendar
} from 'lucide-react';

const Feed = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const PAGE_SIZE = 5;

  const fetchPosts = async (pageNumber = 0) => {
    try {
      if (pageNumber === 0) setLoading(true);

      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!posts_user_id_fkey(id, name, avatar_url, sector, location),
          likes(count),
          comments!comments_post_id_fkey(count)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setPosts(prev => pageNumber === 0 ? data : [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);

        // Fetch user likes for these posts
        if (user) {
            const postIds = data.map(p => p.id);
            const { data: userLikes } = await supabase
                .from('likes')
                .select('post_id')
                .eq('user_id', user.id)
                .in('post_id', postIds);
            
            if (userLikes) {
                setLikedPosts(prev => {
                    const newSet = new Set(prev);
                    userLikes.forEach(like => newSet.add(like.post_id));
                    return newSet;
                });
            }
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts.has(postId);
    
    // Optimistic update
    setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.delete(postId);
        else newSet.add(postId);
        return newSet;
    });

    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            const currentCount = p.likes && p.likes[0] ? p.likes[0].count : 0;
            return {
                ...p,
                likes: [{ count: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1 }]
            };
        }
        return p;
    }));

    try {
        if (isLiked) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .match({ post_id: postId, user_id: user.id });
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('likes')
                .insert({ post_id: postId, user_id: user.id });
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        // Revert on error
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (isLiked) newSet.add(postId);
            else newSet.delete(postId);
            return newSet;
        });
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const currentCount = p.likes && p.likes[0] ? p.likes[0].count : 0;
                return {
                    ...p,
                    likes: [{ count: isLiked ? currentCount + 1 : Math.max(0, currentCount - 1) }]
                };
            }
            return p;
        }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B3D2E', paddingBottom: 80 }}>
      {/* Top Navigation Bar */}
      <div style={{ 
        position: 'sticky', top: 0, zIndex: 50, 
        background: 'rgba(11, 61, 46, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '10px 20px',
        borderBottom: '1px solid #2E7D67',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo/Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: '#EAE7E2',
            mask: 'url(/icons/ala.svg) no-repeat center / contain',
            WebkitMask: 'url(/icons/ala.svg) no-repeat center / contain',
          }} />
          <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#F2F1EE', margin: 0, display: 'none', sm: 'block' }}>Ala</h1>
        </div>

        {/* Icons Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/feed" style={{ color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={28} strokeWidth={2.5} />
          </Link>

          <Link to="/groups" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} />
          </Link>
          
          <Link to="/new-post" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlusSquare size={28} />
          </Link>

          <Link to="/marketplace" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={28} />
          </Link>

          <Link to="/resources" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={28} />
          </Link>

          <Link to="/grievances" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={28} />
          </Link>

          <Link to="/crisis" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={28} />
          </Link>

          <Link to="/compliance" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={28} />
          </Link>

          <Link to="/messages" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageCircle size={28} />
          </Link>

          <Link to="/events" style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={28} />
          </Link>

          <Link to={`/profile/${user.id}`} style={{ color: '#F2F1EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} />
          </Link>

          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', border: 'none', 
              color: '#F2F1EE', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
            }}
          >
            <LogOut size={26} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 0' }}>
        {loading && page === 0 ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
             <Loader2 style={{ color: '#4ADE80', width: 32, height: 32, animation: 'spin 1s linear infinite' }} />
           </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC', background: 'rgba(13, 77, 58, 0.6)', margin: 20, borderRadius: 16 }}>
            <p>{t('auth.feed.no_posts')}</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(13, 77, 58, 0.6)',
                borderBottom: '1px solid #2E7D67',
                marginBottom: 16,
                padding: 16,
              }}
            >
              {/* Post Header */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Link to={`/profile/${post.author?.id}`}>
                  {post.author?.avatar_url ? (
                    <img 
                      src={post.author.avatar_url} 
                      alt={post.author.name} 
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2E7D67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="#A7C7BC" />
                    </div>
                  )}
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to={`/profile/${post.author?.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 16, fontWeight: '600', color: '#F2F1EE', margin: 0 }}>
                        {post.author?.name || 'Unknown User'}
                      </h3>
                    </Link>
                    <span style={{ fontSize: 12, color: '#A7C7BC' }}>{getTimeAgo(post.created_at)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    {post.author?.sector && (
                      <span style={{ fontSize: 12, color: '#4ADE80', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        {post.author.sector}
                      </span>
                    )}
                    {post.author?.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, color: '#A7C7BC' }}>
                        <MapPin size={10} /> {post.author.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ marginBottom: 12 }}>
                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <p style={{ color: '#F2F1EE', fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.content}</p>
                </Link>
                 {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {post.hashtags.map((tag, idx) => (
                      <span key={idx} style={{ color: '#4ADE80', fontSize: 14 }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div style={{ marginBottom: 12, borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateColumns: post.media_urls.length > 1 ? '1fr 1fr' : '1fr', gap: 2 }}>
                  {post.media_urls.map((url, idx) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg|mov|quicktime)$/i);
                    return isVideo ? (
                      <video 
                        key={idx} 
                        src={url} 
                        controls
                        style={{ 
                          width: '100%', 
                          height: post.media_urls.length > 1 ? 150 : 'auto', 
                          maxHeight: 400,
                          objectFit: 'cover' 
                        }} 
                      />
                    ) : (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Post content" 
                        style={{ 
                          width: '100%', 
                          height: post.media_urls.length > 1 ? 150 : 'auto', 
                          maxHeight: 400,
                          objectFit: 'cover' 
                        }} 
                      />
                    );
                  })}
                </div>
              )}

              {/* Footer Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 12, borderTop: '1px solid rgba(46, 125, 103, 0.5)' }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ 
                    background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6, 
                    color: likedPosts.has(post.id) ? '#EF4444' : '#A7C7BC', 
                    cursor: 'pointer', padding: 0 
                  }}
                >
                  <Heart size={20} fill={likedPosts.has(post.id) ? "#EF4444" : "none"} />
                  <span style={{ fontSize: 14 }}>{post.likes && post.likes[0]?.count > 0 ? post.likes[0].count : t('auth.feed.likes')}</span>
                </button>
                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#A7C7BC' }}>
                  <MessageCircle size={20} />
                  <span style={{ fontSize: 14 }}>{post.comments && post.comments[0]?.count > 0 ? post.comments[0].count : t('auth.feed.comments')}</span>
                </Link>
                <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: '#A7C7BC', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}>
                  <Share2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}

        {/* Load More */}
        {hasMore && !loading && posts.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <button 
              onClick={loadMore}
              style={{ background: '#2E7D67', color: '#F2F1EE', border: 'none', padding: '10px 24px', borderRadius: 20, cursor: 'pointer' }}
            >
              {t('auth.feed.load_more')}
            </button>
          </div>
        )}
      </div>
       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Feed;
