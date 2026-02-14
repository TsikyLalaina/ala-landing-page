import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Briefcase, Hash, FileText, 
  ArrowRight, ArrowLeft, Check, Loader2,
  Leaf, Mountain, Sparkles, CheckCircle, AlertCircle 
} from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const STEPS = ['profile', 'details', 'interests'];

const INTEREST_OPTIONS = [
  { id: 'vanilla', label: 'Vanilla', icon: '🌿' },
  { id: 'clove', label: 'Clove', icon: '🌸' },
  { id: 'cocoa', label: 'Cocoa', icon: '🍫' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'rice', label: 'Rice', icon: '🌾' },
  { id: 'graphite', label: 'Graphite', icon: '⚫' },
  { id: 'nickel', label: 'Nickel', icon: '🔘' },
  { id: 'cobalt', label: 'Cobalt', icon: '🔵' },
  { id: 'reforestation', label: 'Reforestation', icon: '🌳' },
  { id: 'carbon', label: 'Carbon Credits', icon: '🌍' },
];

const validatePhone = (phone) => {
  if (!phone) return true; // Optional
  // Generic international or local format: matches +123... or 03... with length 8-15
  const re = /^(\+|0)[0-9\s]{8,15}$/;
  return re.test(phone.replace(/\s/g, ''));
};

const Onboarding = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    location: null, // { name, lat, lng }
    sector: 'agriculture',
    bio: '',
    interests: [],
  });

  // Validation State
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Validation Logic
  const validate = useCallback((data) => {
    const newErrors = {};
    
    // Name
    if (!data.name.trim()) newErrors.name = t('auth.validation.name_required');
    else if (data.name.trim().length < 2) newErrors.name = t('auth.validation.name_min');

    // Phone
    if (data.phone && !validatePhone(data.phone)) {
      newErrors.phone = t('auth.validation.phone_invalid');
    }

    // Username (Optional min length if exists)
    if (data.username && data.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    return newErrors;
  }, [t]);

  useEffect(() => {
    setErrors(validate(formData));
  }, [formData, validate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const isStepValid = () => {
    if (step === 0) {
      return !errors.name && !errors.phone && !errors.username && formData.name;
    }
    return true;
  };

  const handleNext = () => {
    // Mark current step fields as touched
    if (step === 0) {
      setTouched(prev => ({ ...prev, name: true, phone: true, username: true }));
    }
    
    if (isStepValid() && step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: formData.name,
          username: formData.username || null,
          phone: formData.phone || null,
          location: formData.location?.name || null,
          location_lat: formData.location?.lat || null,
          location_lng: formData.location?.lng || null,
          sector: formData.sector,
          bio: formData.bio || null,
          interests: formData.interests.length > 0 ? formData.interests : null,
        });

      if (insertError) throw insertError;
      
      await refreshProfile(); // Crucial: Update AuthContext state
      toast.success(t('auth.onboarding.success'));
      navigate('/'); // Redirect to landing page
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong saving your profile");
      setLoading(false);
    }
  };

  // Helper for input styles
  const getInputStyles = (fieldName) => {
    const isError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && (formData[fieldName]?.length > 0 || fieldName === 'phone'); // Phone is valid if empty or valid format
    // Special case for phone: if optional and empty, it's neutral unless touched and explicit validation logic
    
    const base = {
      width: '100%',
      background: '#1A5D4A',
      border: '1px solid #2E7D67',
      color: '#F2F1EE',
      padding: '14px 14px 14px 46px',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    };

    if (isError) {
      return { ...base, borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)' };
    }
    if (isValid && formData[fieldName]) { // Only show green if actually typed something
      return { ...base, borderColor: '#4ADE80' };
    }
    return base;
  };

  const ValidIcon = ({ fieldName }) => {
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName]?.length > 0;
    if (!isValid) return null;
    return <CheckCircle style={{ width: '16px', height: '16px', color: '#4ADE80' }} />;
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#6B9B8A'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '500',
    color: '#D7D4CE',
    marginBottom: '8px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0B3D2E 0%, #0D4D3A 50%, #0B3D2E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: 'rgba(74, 222, 128, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles style={{ width: '32px', height: '32px', color: '#4ADE80' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#F2F1EE', marginBottom: '8px' }}>
            {t('auth.onboarding.title')}
          </h1>
          <p style={{ color: '#A7C7BC', fontSize: '15px' }}>{t('auth.onboarding.subtitle')}</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              style={{
                height: '6px',
                borderRadius: '3px',
                transition: 'all 0.3s',
                width: idx === step ? '32px' : '8px',
                background: idx <= step ? '#4ADE80' : 'rgba(74,222,128,0.3)'
              }}
            />
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(13, 77, 58, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #2E7D67',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Profile */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User style={{ width: '24px', height: '24px', color: '#0B3D2E' }} />
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F2F1EE' }}>{t('auth.onboarding.step1_title')}</h2>
                  <p style={{ color: '#A7C7BC', fontSize: '14px', marginTop: '4px' }}>{t('auth.onboarding.step1_desc')}</p>
                </div>

                {/* Name Field */}
                <div>
                  <label style={labelStyle}>
                    {t('auth.name')} *
                    <ValidIcon fieldName="name" />
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User style={iconStyle} />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      placeholder={t('auth.name_placeholder')}
                      style={getInputStyles('name')}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <AlertCircle style={{ width: '14px', height: '14px' }} />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Username Field */}
                <div>
                  <label style={labelStyle}>
                    {t('auth.username')}
                    <ValidIcon fieldName="username" />
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Hash style={iconStyle} />
                    <input 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      placeholder={t('auth.username_placeholder')}
                      style={getInputStyles('username')}
                    />
                  </div>
                  {touched.username && errors.username && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <AlertCircle style={{ width: '14px', height: '14px' }} />
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label style={labelStyle}>
                    {t('auth.phone')}
                    <ValidIcon fieldName="phone" />
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={iconStyle} />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+261 34 00 000 00"
                      style={getInputStyles('phone')}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <AlertCircle style={{ width: '14px', height: '14px' }} />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #C9A66B, #B8956A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin style={{ width: '24px', height: '24px', color: '#0B3D2E' }} />
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F2F1EE' }}>{t('auth.onboarding.step2_title')}</h2>
                  <p style={{ color: '#A7C7BC', fontSize: '14px', marginTop: '4px' }}>{t('auth.onboarding.step2_desc')}</p>
                </div>

                <div>
                  <label style={labelStyle}>{t('auth.location')}</label>
                  <div style={{ position: 'relative' }}>
                    <LocationPicker 
                      value={formData.location}
                      onChange={(loc) => setFormData({ ...formData, location: loc })}
                      placeholder={t('auth.location_placeholder')}
                      inputStyle={{
                        background: '#1A5D4A',
                        padding: '14px 14px 14px 46px',
                        borderRadius: '12px',
                        fontSize: '15px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t('auth.sector')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { value: 'agriculture', Icon: Leaf, label: t('auth.agriculture'), color: '#4ADE80' },
                      { value: 'mining', Icon: Mountain, label: t('auth.mining'), color: '#C9A66B' },
                      { value: 'both', Icon: Sparkles, label: t('auth.both'), color: '#22D3EE' },
                      { value: 'other', Icon: Briefcase, label: t('auth.other'), color: '#A7C7BC' },
                    ].map(({ value, Icon, label, color }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, sector: value })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: formData.sector === value ? `2px solid ${color}` : '1px solid #2E7D67',
                          background: formData.sector === value ? `${color}15` : '#1A5D4A',
                          color: formData.sector === value ? color : '#A7C7BC',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}
                      >
                        <Icon style={{ width: '18px', height: '18px' }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t('auth.bio')}</label>
                  <div style={{ position: 'relative' }}>
                    <FileText style={{ ...iconStyle, top: '20px', transform: 'none' }} />
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder={t('auth.bio_placeholder')}
                      rows={3}
                      style={{ ...getInputStyles('bio'), resize: 'none', paddingTop: '14px' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Interests */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles style={{ width: '24px', height: '24px', color: '#0B3D2E' }} />
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#F2F1EE' }}>{t('auth.onboarding.step3_title')}</h2>
                  <p style={{ color: '#A7C7BC', fontSize: '14px', marginTop: '4px' }}>{t('auth.onboarding.step3_desc')}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {INTEREST_OPTIONS.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInterest(id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: formData.interests.includes(id) ? '2px solid #4ADE80' : '1px solid #2E7D67',
                        background: formData.interests.includes(id) ? 'rgba(74,222,128,0.1)' : '#1A5D4A',
                        color: formData.interests.includes(id) ? '#4ADE80' : '#D7D4CE',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: '500',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{icon}</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                      {formData.interests.includes(id) && (
                        <Check style={{ width: '16px', height: '16px', color: '#4ADE80' }} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#1A5D4A',
                  color: '#A7C7BC',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '1px solid #2E7D67',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                <ArrowLeft style={{ width: '20px', height: '20px' }} />
                {t('auth.back')}
              </button>
            )}
            
            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: isStepValid() ? '#4ADE80' : '#2E7D67',
                  color: isStepValid() ? '#0B3D2E' : '#6B9B8A',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isStepValid() ? 'pointer' : 'not-allowed',
                  fontSize: '15px'
                }}
              >
                {t('auth.next')}
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#4ADE80',
                  color: '#0B3D2E',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    {t('auth.complete')}
                    <Check style={{ width: '20px', height: '20px' }} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: #6B9B8A;
        }
        input:focus, textarea:focus {
          border-color: #4ADE80 !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
