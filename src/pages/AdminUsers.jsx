import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Loader2, Shield, User, Search, Award, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [userBadges, setUserBadges] = useState({}); // Map userId -> [badgeIds]
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            navigate('/feed');
            return;
        }
        fetchData();
    }, [isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, badgesRes, userBadgesRes] = await Promise.all([
                supabase.from('users').select('*').order('created_at', { ascending: false }).limit(50),
                supabase.from('badges').select('*'),
                supabase.from('user_badges').select('*')
            ]);

            if (usersRes.error) throw usersRes.error;
            if (badgesRes.error) throw badgesRes.error;

            setUsers(usersRes.data || []);
            setBadges(badgesRes.data || []);

            // Process user badges into a map
            const ubMap = {};
            (userBadgesRes.data || []).forEach(ub => {
                if (!ubMap[ub.user_id]) ubMap[ub.user_id] = new Set();
                ubMap[ub.user_id].add(ub.badge_id);
            });
            setUserBadges(ubMap);

        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            if (query.length === 0) fetchData(); // Reset if empty
            return; 
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(50);
            
            if (error) throw error;
            setUsers(data || []);
            
            // Re-fetch badges for these users specifically if needed, 
            // but we likely have all user_badges loaded if the dataset is small.
            // For scalable apps, fetch user_badges only for these users.
            const userIds = data.map(u => u.id);
            const { data: ubData } = await supabase.from('user_badges').select('*').in('user_id', userIds);
            
            const ubMap = {};
            (ubData || []).forEach(ub => {
                if (!ubMap[ub.user_id]) ubMap[ub.user_id] = new Set();
                ubMap[ub.user_id].add(ub.badge_id);
            });
            setUserBadges(ubMap);

        } catch (error) { console.error(error); }
    };

    const toggleBadge = async (userId, badgeId) => {
        const currentBadges = userBadges[userId] || new Set();
        const hasBadge = currentBadges.has(badgeId);
        
        try {
            if (hasBadge) {
                // Remove badge
                const { error } = await supabase.from('user_badges').delete().match({ user_id: userId, badge_id: badgeId });
                if (error) throw error;
                currentBadges.delete(badgeId);
                toast.success('Badge removed');
            } else {
                // Add badge
                const { error } = await supabase.from('user_badges').insert({ user_id: userId, badge_id: badgeId });
                if (error) throw error;
                currentBadges.add(badgeId);
                toast.success('Badge assigned');
            }
            
            setUserBadges(prev => ({
                ...prev,
                [userId]: new Set(currentBadges)
            }));
        } catch (error) {
            console.error(error);
            toast.error('Failed to update badge');
        }
    };

    if (loading && users.length === 0) return (
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
                    <button onClick={() => navigate('/admin/grievances')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer', padding: 4 }}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Award size={18} style={{ color: '#FBBF24' }} /> User Badges
                    </h1>
                </div>
            </div>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
                {/* Search */}
                <div style={{ marginBottom: 20, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: '#A7C7BC' }} />
                    <input 
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search users by name..."
                        style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 14, boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                    {users.map(u => (
                        <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 12, padding: 16, border: '1px solid #2E7D67' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2E7D67', overflow: 'hidden' }}>
                                    {u.avatar_url ? <img src={u.avatar_url} style={{ width: '100%', height: '100%' }} /> : <User size={24} color="#A7C7BC" style={{ margin: 8 }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 15 }}>{u.name}</div>
                                    <div style={{ fontSize: 12, color: '#A7C7BC' }}>{u.location || 'No location'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {badges.map(badge => {
                                    const hasBadge = userBadges[u.id]?.has(badge.id);
                                    return (
                                        <button 
                                            key={badge.id}
                                            onClick={() => toggleBadge(u.id, badge.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                background: hasBadge ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.05)',
                                                color: hasBadge ? '#F97316' : '#A7C7BC',
                                                border: hasBadge ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 20, padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {hasBadge ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #A7C7BC' }} />}
                                            {badge.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
