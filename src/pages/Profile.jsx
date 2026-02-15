import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Briefcase, Calendar, Edit2, Camera, 
  Save, X, Award, Loader2, Phone, Mail, Plus, BarChart2 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationPicker from '../components/LocationPicker';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Follow Feature State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    location: null, // { name, lat, lng }
    bio: '',
    sector: '',
    interests: [],
    badges: '',
  });
  const [newInterest, setNewInterest] = useState('');

  const isOwnProfile = currentUser?.id === id;

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProfile(data);
      setFormData({
        name: data.name || '',
        username: data.username || '',
        phone: data.phone || '',
        location: data.location ? {
          name: data.location,
          lat: data.location_lat || -18.91,
          lng: data.location_lng || 47.53
        } : null,
        bio: data.bio || '',
        sector: data.sector || 'agriculture',
        interests: data.interests || [],
        badges: data.badges ? data.badges.join(', ') : '',
      });

      // Fetch Follow Data
      await fetchFollowData();

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowData = async () => {
    try {
      // 1. Check if current user follows this profile (if logged in and not own profile)
      if (currentUser && !isOwnProfile) {
        const { data: followStatus } = await supabase
          .from('follows')
          .select('follower_id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', id)
          .maybeSingle(); // Use maybeSingle to avoid errors if not found

        setIsFollowing(!!followStatus);
      }

      // 2. Get Followers Count (people following this profile)
      const { count: followers } = await supabase
        .from('follows')
        .select('follower_id', { count: 'exact', head: true })
        .eq('following_id', id);
      
      setFollowersCount(followers || 0);

      // 3. Get Following Count (people this profile follows)
      const { count: following } = await supabase
        .from('follows')
        .select('following_id', { count: 'exact', head: true })
        .eq('follower_id', id);
      
      setFollowingCount(following || 0);

    } catch (error) {
      console.error('Error fetching follow stats:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]); // Re-fetch on ID change or login

  const handleFollowToggle = async () => {
    if (!currentUser) {
        toast.error('Please login to follow users');
        return;
    }

    const previousState = isFollowing;
    const previousFollowers = followersCount;

    // Optimistic Update
    setIsFollowing(!previousState);
    setFollowersCount(prev => previousState ? prev - 1 : prev + 1);
    setFollowLoading(true);

    try {
        if (previousState) {
            // Unfollow
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', currentUser.id)
                .eq('following_id', id);
            
            if (error) throw error;
        } else {
            // Follow
            const { error } = await supabase
                .from('follows')
                .insert({
                    follower_id: currentUser.id,
                    following_id: id
                });
            
            if (error) throw error;
        }
    } catch (error) {
        console.error('Follow toggle error:', error);
        toast.error('Action failed. Please try again.');
        // Revert UI
        setIsFollowing(previousState);
        setFollowersCount(previousFollowers);
    } finally {
        setFollowLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          location: formData.location?.name || null,
          location_lat: formData.location?.lat || null,
          location_lng: formData.location?.lng || null,
          bio: formData.bio,
          sector: formData.sector,
          interests: formData.interests,
        })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update - show changes immediately
      setProfile({ 
        ...profile, 
        name: formData.name,
        username: formData.username,
        phone: formData.phone,
        location: formData.location?.name || null,
        location_lat: formData.location?.lat || null,
        location_lng: formData.location?.lng || null,
        bio: formData.bio,
        sector: formData.sector,
        interests: formData.interests,
      });
      setEditing(false);
      toast.success(t('auth.profile.saved_success') || 'Profile updated!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B3D2E' }}>
        <Loader2 style={{ color: '#4ADE80', width: 40, height: 40, animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!profile) {
    return <div style={{ minHeight: '100vh', padding: 40, textAlign: 'center', color: 'white', background: '#0B3D2E' }}>Profile not found</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
      {/* Header / Cover */}
      <div style={{ height: 200, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ position: 'relative', width: 120, height: 120 }}>
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D4D3A&color=4ADE80`} 
              alt={profile.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #0B3D2E', objectFit: 'cover', background: '#0B3D2E' }}
            />
            {isOwnProfile && (
              <label style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                background: '#4ADE80', borderRadius: '50%', padding: 8, 
                cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
              }}>
                {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={16} color="#0B3D2E" />}
                <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '60px auto 0', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                style={{ fontSize: 24, fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', border: '1px solid #4ADE80', borderRadius: 8, padding: '4px 8px', color: 'white', textAlign: 'center' }}
              />
              <input 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
                style={{ fontSize: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid #4ADE80', borderRadius: 8, padding: '4px 8px', color: '#A7C7BC', textAlign: 'center' }}
              />
            </div>
          ) : (
             <>
               <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>{profile.name}</h1>
               {profile.username && <p style={{ color: '#A7C7BC', marginBottom: 8 }}>@{profile.username}</p>}
               
               {/* Follow Stats */}
               <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12, fontSize: 14, color: '#D1D5DB' }}>
                  <span><strong style={{ color: 'white' }}>{followersCount}</strong> Followers</span>
                  <span><strong style={{ color: 'white' }}>{followingCount}</strong> Following</span>
               </div>
             </>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#A7C7BC', marginTop: 8, maxWidth: 300, margin: '8px auto 0' }}>
            {editing ? (
              <LocationPicker
                value={formData.location}
                onChange={(loc) => setFormData({ ...formData, location: loc })}
                placeholder="Search location in Madagascar..."
              />
            ) : (
              <><MapPin size={16} /> <span>{profile.location || 'Unknown Location'}</span></>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            {isOwnProfile ? (
              editing ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setEditing(false)} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: '#374151', color: 'white', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                    <X size={16} /> {t('auth.profile.cancel')}
                  </button>
                  <button onClick={handleUpdate} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: '#4ADE80', color: '#0B3D2E', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                    {saving ? 'Saving...' : t('auth.profile.save')}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid #4ADE80', cursor: 'pointer' }}>
                      <Edit2 size={16} /> {t('auth.profile.edit')}
                    </button>
                    <button onClick={() => navigate('/analytics')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', border: '1px solid #60A5FA', cursor: 'pointer' }}>
                      <BarChart2 size={16} /> Analytics
                    </button>
                </div>
              )
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => navigate(`/messages/${id}`)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, 
                        padding: '8px 24px', borderRadius: 20, 
                        background: 'rgba(255,255,255,0.1)', 
                        color: 'white', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                  >
                      <Mail size={16} /> Message
                  </button>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, 
                        padding: '8px 24px', borderRadius: 20, 
                        background: isFollowing ? 'transparent' : '#4ADE80', 
                        color: isFollowing ? '#F2F1EE': '#0B3D2E', 
                        border: isFollowing ? '1px solid #4ADE80' : 'none',
                        fontWeight: 'bold',
                        cursor: followLoading ? 'wait' : 'pointer',
                        opacity: followLoading ? 0.7 : 1,
                        transition: 'all 0.2s'
                    }}
                  >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
              </div>
            )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Info Card */}
          <div style={{ background: 'rgba(13, 77, 58, 0.6)', borderRadius: 16, padding: 24, border: '1px solid #2E7D67' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={20} color="#4ADE80" /> About
            </h2>
            {editing ? (
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ 
                  width: '100%', 
                  height: 100, 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid #4ADE80', 
                  borderRadius: 8, 
                  padding: 8, 
                  color: 'white',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  resize: 'vertical'
                }}
              />
            ) : (
              <p style={{ 
                color: '#D7D4CE', 
                lineHeight: 1.6,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>{profile.bio || t('auth.profile.bio_placeholder')}</p>
            )}
            
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Briefcase size={18} color="#A7C7BC" />
                {editing ? (
                  <select 
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    style={{ background: '#0B3D2E', border: '1px solid #4ADE80', color: 'white', padding: 4, borderRadius: 4 }}
                  >
                    <option value="agriculture">Agriculture</option>
                    <option value="mining">Mining</option>
                    <option value="both">Both</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span style={{ textTransform: 'capitalize' }}>{profile.sector} Sector</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mail size={18} color="#A7C7BC" />
                <span style={{ color: '#D7D4CE' }}>{profile.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={18} color="#A7C7BC" />
                <span>{t('auth.profile.member_since')} {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              {(profile.phone || editing) && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <Phone size={18} color="#A7C7BC" />
                   {editing ? (
                     <input 
                       value={formData.phone} 
                       onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                       placeholder="Phone number" 
                       style={{ background: '#0B3D2E', border: '1px solid #4ADE80', color: 'white', padding: 4, borderRadius: 4, flex: 1 }}
                     />
                   ) : (
                     <span>{profile.phone}</span>
                   )}
                 </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: 'rgba(13, 77, 58, 0.6)', borderRadius: 16, padding: 24, border: '1px solid #2E7D67' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={20} color="#C9A66B" /> {t('auth.profile.badges')}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.badges && profile.badges.length > 0 ? (
                profile.badges.map((badge, idx) => (
                  <span key={idx} style={{ background: 'rgba(201, 166, 107, 0.2)', color: '#C9A66B', padding: '4px 12px', borderRadius: 12, fontSize: 13, border: '1px solid rgba(201, 166, 107, 0.4)' }}>
                    {badge}
                  </span>
                ))
              ) : (
                <p style={{ color: '#A7C7BC', fontStyle: 'italic' }}>{t('auth.profile.no_badges')}</p>
              )}
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 12 }}>Interests</h3>
            {editing ? (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {formData.interests.map((interest, idx) => (
                    <span 
                      key={idx} 
                      style={{ 
                        background: 'rgba(74, 222, 128, 0.1)', 
                        color: '#4ADE80', 
                        padding: '4px 8px 4px 12px', 
                        borderRadius: 12, 
                        fontSize: 13, 
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {interest}
                      <button 
                        onClick={() => {
                          const updated = formData.interests.filter((_, i) => i !== idx);
                          setFormData({...formData, interests: updated});
                        }}
                        style={{ 
                          background: 'rgba(255,255,255,0.1)', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 18, height: 18, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <X size={12} color="#4ADE80" />
                      </button>
                    </span>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newInterest.trim()) {
                          e.preventDefault();
                          setFormData({...formData, interests: [...formData.interests, newInterest.trim()]});
                          setNewInterest('');
                        }
                      }}
                      placeholder="Add interest..."
                      style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid #2E7D67', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: 12, 
                        fontSize: 13,
                        width: 120
                      }}
                    />
                    <button 
                      onClick={() => {
                        if (newInterest.trim()) {
                          setFormData({...formData, interests: [...formData.interests, newInterest.trim()]});
                          setNewInterest('');
                        }
                      }}
                      style={{ 
                        background: '#4ADE80', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: 24, height: 24, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={14} color="#0B3D2E" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest, idx) => (
                    <span key={idx} style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ADE80', padding: '4px 12px', borderRadius: 12, fontSize: 13, border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                      {interest}
                    </span>
                  ))
                ) : (
                  <p style={{ color: '#A7C7BC', fontStyle: 'italic' }}>No specific interests listed</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div style={{ marginTop: 24, background: 'rgba(13, 77, 58, 0.6)', borderRadius: 16, padding: 24, border: '1px solid #2E7D67', height: 400 }}>
             <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={20} color="#4ADE80" /> {t('auth.profile.location_map')}
            </h2>
            <div style={{ height: '85%', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
              <MapContainer 
                center={[
                  formData.location?.lat || profile.location_lat || -18.91, 
                  formData.location?.lng || profile.location_lng || 47.53
                ]} 
                zoom={(formData.location?.lat || profile.location_lat) ? 12 : 6} 
                style={{ height: '100%', width: '100%' }}
              >
                <MapUpdater 
                  lat={formData.location?.lat || profile.location_lat || -18.91}
                  lng={formData.location?.lng || profile.location_lng || 47.53}
                  zoom={(formData.location?.lat || profile.location_lat) ? 12 : 6}
                />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {(profile.location_lat || formData.location?.lat) && (
                  <Marker position={[
                    profile.location_lat || formData.location?.lat, 
                    profile.location_lng || formData.location?.lng
                  ]}>
                    <Popup>
                      {profile.location || formData.location?.name || 'Your Location'}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
