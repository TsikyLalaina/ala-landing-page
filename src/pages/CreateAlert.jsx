import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    ArrowLeft, Loader2, Upload, X, AlertTriangle, MapPin, 
    CloudLightning, Droplets, Flame, Bug, ShieldAlert, Radio
} from 'lucide-react';
import LocationPickerInput from '../components/LocationPicker';

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const crisisTypes = [
    { value: 'cyclone', label: 'Cyclone', icon: <CloudLightning size={20} />, color: '#A78BFA' },
    { value: 'flood', label: 'Flood', icon: <Droplets size={20} />, color: '#60A5FA' },
    { value: 'drought', label: 'Drought', icon: <Flame size={20} />, color: '#F97316' },
    { value: 'fire', label: 'Fire', icon: <Flame size={20} />, color: '#EF4444' },
    { value: 'locust', label: 'Locust', icon: <Bug size={20} />, color: '#FBBF24' },
    { value: 'disease', label: 'Disease', icon: <ShieldAlert size={20} />, color: '#F472B6' },
    { value: 'other', label: 'Other', icon: <AlertTriangle size={20} />, color: '#A7C7BC' },
];

const MapUpdater = ({ center }) => {
    const map = useMap();
    React.useEffect(() => {
        if (center) map.setView(center, 10);
    }, [center, map]);
    return null;
};

const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const CreateAlert = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mapPosition, setMapPosition] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructions: '',
        crisis_type: 'cyclone',
        alert_type: 'warning',
        severity: 3,
        affected_area: '',
        affected_radius_km: 10,
        image_url: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMapSelect = async (lat, lng) => {
        setMapPosition([lat, lng]);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
                const addr = data.address || {};
                const name = addr.city || addr.town || addr.village || addr.county || data.display_name.split(',')[0];
                setFormData(prev => ({ ...prev, affected_area: name }));
            }
        } catch (e) {
            console.error('Reverse geocode failed', e);
        }
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        setUploading(true);
        try {
            const { error } = await supabase.storage.from('crisis').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('crisis').getPublicUrl(fileName);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error('Title and description required');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('crisis_alerts').insert({
                created_by: user.id,
                title: formData.title,
                description: formData.description,
                instructions: formData.instructions || null,
                crisis_type: formData.crisis_type,
                alert_type: formData.alert_type,
                severity_level: parseInt(formData.severity),
                location: formData.affected_area || null,
                affected_radius_km: parseFloat(formData.affected_radius_km) || 10,
                latitude: mapPosition ? mapPosition[0] : null,
                longitude: mapPosition ? mapPosition[1] : null,
                image_url: formData.image_url || null,
                status: 'active',
            });

            if (error) throw error;
            toast.success('Emergency alert created!');
            navigate('/crisis');
        } catch (error) {
            console.error('Error creating alert:', error);
            toast.error('Failed to create alert');
        } finally {
            setLoading(false);
        }
    };

    const selectedCrisis = crisisTypes.find(c => c.value === formData.crisis_type);
    const inputStyle = { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #2E7D67', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16, boxSizing: 'border-box' };
    const severityColors = ['', '#4ADE80', '#FBBF24', '#F97316', '#EF4444', '#DC2626'];

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: 'rgba(127, 29, 29, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #EF4444',
                display: 'flex', alignItems: 'center', gap: 16
            }}>
                <button onClick={() => navigate('/crisis')} style={{ background: 'transparent', border: 'none', color: '#FCA5A5', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Radio size={20} style={{ color: '#EF4444' }} />
                    Create Emergency Alert
                </h1>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    
                    {/* Crisis Type */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}>Crisis Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                            {crisisTypes.map(ct => (
                                <button
                                    key={ct.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, crisis_type: ct.value }))}
                                    style={{
                                        background: formData.crisis_type === ct.value ? `${ct.color}22` : 'rgba(255,255,255,0.05)',
                                        border: `2px solid ${formData.crisis_type === ct.value ? ct.color : 'transparent'}`,
                                        borderRadius: 12, padding: '12px 6px',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 4,
                                        color: formData.crisis_type === ct.value ? ct.color : '#A7C7BC',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {ct.icon}
                                    <span style={{ fontSize: 11, fontWeight: 'bold' }}>{ct.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Alert Type & Severity */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Alert Level</label>
                            <select name="alert_type" value={formData.alert_type} onChange={handleInputChange} style={inputStyle}>
                                <option value="info">ℹ️ Info</option>
                                <option value="warning">⚠️ Warning</option>
                                <option value="emergency">🚨 Emergency</option>
                                <option value="critical">🔴 Critical</option>
                            </select>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Severity: <span style={{ color: severityColors[formData.severity] }}>{formData.severity}/5</span>
                            </label>
                            <input
                                type="range" name="severity" min="1" max="5" value={formData.severity}
                                onChange={handleInputChange}
                                style={{ width: '100%', accentColor: severityColors[formData.severity] }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#A7C7BC' }}>
                                <span>Low</span><span>Catastrophic</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Alert Title *</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Cyclone Gamane approaching SAVA" style={inputStyle} required />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Detailed situation report..." rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} required />
                    </div>

                    {/* Safety Instructions */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Safety Instructions</label>
                        <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} placeholder="What should people do? Evacuation routes, shelter info..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                    </div>

                    {/* Affected Area */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Affected Area</label>
                            <LocationPickerInput 
                                value={formData.affected_area ? { name: formData.affected_area, lat: mapPosition?.[0]||0, lng: mapPosition?.[1]||0 } : null}
                                onChange={(loc) => {
                                    if (loc) {
                                        setFormData(prev => ({ ...prev, affected_area: loc.name }));
                                        setMapPosition([loc.lat, loc.lng]);
                                    } else {
                                        setFormData(prev => ({ ...prev, affected_area: '' }));
                                    }
                                }}
                                placeholder="Search e.g., Antananarivo, Tamatave..."
                            />
                        </div>
                        <div style={{ flex: '1 1 120px' }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Radius (km)</label>
                            <input name="affected_radius_km" type="number" value={formData.affected_radius_km} onChange={handleInputChange} placeholder="10" style={inputStyle} />
                        </div>
                    </div>

                    {/* Map Location Picker */}
                    <div>
                        <label style={{ marginBottom: 8, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={16} /> Pin Location on Map
                        </label>
                        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #2E7D67', height: 250 }}>
                            <MapContainer center={[-18.9, 47.5]} zoom={6} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapUpdater center={mapPosition} />
                                <MapClickHandler onLocationSelect={handleMapSelect} />
                                {mapPosition && <Marker position={mapPosition} />}
                            </MapContainer>
                        </div>
                        {mapPosition && (
                            <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                                <span>📍 {mapPosition[0].toFixed(4)}, {mapPosition[1].toFixed(4)}</span>
                                <button type="button" onClick={() => setMapPosition(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>Clear</button>
                            </div>
                        )}
                        <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>Click on the map to set the crisis epicenter</div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Image</label>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                        {formData.image_url ? (
                            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 150 }}>
                                <img src={formData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))} style={{ 
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
                        ) : (
                            <div onClick={() => fileInputRef.current.click()} style={{ height: 80, background: 'rgba(13, 77, 58, 0.4)', border: '2px dashed #2E7D67', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A7C7BC', opacity: uploading ? 0.6 : 1 }}>
                                {uploading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : <><Upload size={22} style={{ marginBottom: 4 }} /><span style={{ fontSize: 13 }}>Upload Image</span></>}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading || uploading} style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: (loading || uploading) ? 0.7 : 1 }}>
                        {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : <Radio />}
                        Broadcast Alert
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .leaflet-container { background: #0B3D2E; }
            `}</style>
        </div>
    );
};

export default CreateAlert;
