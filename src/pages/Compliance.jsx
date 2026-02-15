import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, Mic, FileText, Download, Flag, CheckCircle2,
    Calendar, Languages, AlertTriangle, Play, Pause, Square,
    ClipboardList, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = {
    en: { label: 'English', flag: '🇬🇧' },
    mg: { label: 'Malagasy', flag: '🇲🇬' },
    fr: { label: 'Français', flag: '🇫🇷' },
};

const activityTypes = [
    { value: 'consultation', label: 'Consultation', color: '#60A5FA' },
    { value: 'inspection', label: 'Inspection', color: '#FBBF24' },
    { value: 'training', label: 'Training', color: '#A78BFA' },
    { value: 'audit', label: 'Audit', color: '#EF4444' },
    { value: 'other', label: 'Other', color: '#A7C7BC' },
];

const Compliance = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    const [form, setForm] = useState({
        activity_type: 'consultation',
        description: '',
        flags: [],
        language: 'en',
        location: '',
    });

    const [uiLang, setUiLang] = useState('en');

    useEffect(() => {
        fetchLogs();
        
        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript);
                    setForm(prev => ({ ...prev, description: prev.description + finalTranscript }));
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    toast.error('Microphone access denied');
                }
                setIsRecording(false);
            };
        } else {
            console.warn('Web Speech API not supported');
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // Update language for recognition when UI lang changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = uiLang === 'mg' ? 'mg-MG' : (uiLang === 'fr' ? 'fr-FR' : 'en-US');
        }
        setForm(prev => ({ ...prev, language: uiLang }));
    }, [uiLang]);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('compliance_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching logs:', error);
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            toast.error('Voice input not supported in this browser');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            toast.success('Recording stopped');
        } else {
            try {
                recognitionRef.current.start();
                setIsRecording(true);
                toast.info('Listening... Speak now');
            } catch (err) {
                console.error(err);
                setIsRecording(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.description.trim()) {
            toast.error('Description required');
            return;
        }

        try {
            const { error } = await supabase.from('compliance_logs').insert({
                user_id: user.id,
                activity_type: form.activity_type,
                details: {
                    description: form.description,
                    location: form.location,
                    language: form.language,
                    flags: form.flags
                }
            });

            if (error) throw error;
            
            toast.success('Activity logged successfully');
            setForm({ ...form, description: '', flags: [], location: '' });
            setTranscript('');
            fetchLogs();
        } catch (error) {
            toast.error('Failed to save log');
            console.error(error);
        }
    };

    const toggleFlag = (flag) => {
        setForm(prev => ({
            ...prev,
            flags: prev.flags.includes(flag) 
                ? prev.flags.filter(f => f !== flag)
                : [...prev.flags, flag]
        }));
    };

    const exportCSV = () => {
        if (logs.length === 0) return;
        
        const headers = ['Date', 'Type', 'Description', 'Language', 'Location', 'Flags'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                new Date(log.created_at).toLocaleDateString(),
                log.activity_type,
                `"${(log.details?.description || '').replace(/"/g, '""')}"`,
                log.details?.language || 'en',
                `"${(log.details?.location || '').replace(/"/g, '""')}"`,
                `"${(log.details?.flags || []).join('; ')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const translations = {
        en: {
            title: 'Compliance & Logging',
            subtitle: 'Record activities, track violations, and generate reports.',
            logActivity: 'Log Activity',
            voiceInput: 'Voice Input',
            description: 'Description / Notes',
            flags: 'Flags / Issues',
            grantIssue: 'Grant Issue',
            urgent: 'Urgent',
            violation: 'Violation',
            save: 'Save Log',
            recentLogs: 'Recent Logs',
            export: 'Export Report',
            noLogs: 'No logs found.',
            recording: 'Recording...',
        },
        mg: {
            title: 'Fanaraha-maso & Tatitra',
            subtitle: 'Raketo ny asa, araho ny fandikan-dalàna, ary mamorona tatitra.',
            logActivity: 'Raketo ny Asa',
            voiceInput: 'Feo',
            description: 'Fanazavana / Naoty',
            flags: 'Olana / Fanamarihana',
            grantIssue: 'Olana Famatsiam-bola',
            urgent: 'Maika',
            violation: 'Fandikan-dalàna',
            save: 'Tehirizo',
            recentLogs: 'Tatitra Farany',
            export: 'Avoaka ny Tatitra',
            noLogs: 'Tsy misy tatitra.',
            recording: 'Mandraikitra...',
        },
        fr: {
            title: 'Conformité & Rapports',
            subtitle: 'Enregistrer les activités, suivre les violations et générer des rapports.',
            logActivity: 'Enregistrer une Activité',
            voiceInput: 'Entrée Vocale',
            description: 'Description / Notes',
            flags: 'Drapeaux / Problèmes',
            grantIssue: 'Problème de Subvention',
            urgent: 'Urgent',
            violation: 'Violation',
            save: 'Enregistrer',
            recentLogs: 'Journaux Récents',
            export: 'Exporter le Rapport',
            noLogs: 'Aucun journal trouvé.',
            recording: 'Enregistrement...',
        }
    };

    const t = translations[uiLang];

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate('/feed')} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClipboardList size={20} style={{ color: '#4ADE80' }} />
                            {t.title}
                        </h1>
                    </div>
                </div>

                {/* Language Toggle */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {Object.entries(languages).map(([key, { flag }]) => (
                        <button 
                            key={key}
                            onClick={() => setUiLang(key)}
                            style={{ 
                                background: uiLang === key ? 'rgba(255,255,255,0.2)' : 'transparent',
                                border: '1px solid transparent', //uiLang === key ? 'rgba(255,255,255,0.4)' : 'transparent',
                                borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 16,
                                opacity: uiLang === key ? 1 : 0.5
                            }}
                            title={translations[key].title}
                        >
                            {flag}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                {/* Intro */}
                <p style={{ color: '#A7C7BC', fontSize: 14, marginBottom: 24, padding: '0 4px' }}>{t.subtitle}</p>

                {/* Activity Logger Form */}
                <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 20, border: '1px solid #2E7D67', marginBottom: 30 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#4ADE80' }}>
                        <FileText size={18} /> {t.logActivity}
                    </h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        
                        {/* Type & Location */}
                        <div className="compliance-grid" style={{ display: 'grid', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 'bold', color: '#A7C7BC' }}>Type</label>
                                <select 
                                    value={form.activity_type} 
                                    onChange={e => setForm({...form, activity_type: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white', boxSizing: 'border-box' }}
                                >
                                    {activityTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 'bold', color: '#A7C7BC' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: 10, top: 12, color: '#A7C7BC' }} />
                                    <input 
                                        type="text" 
                                        value={form.location}
                                        onChange={e => setForm({...form, location: e.target.value})}
                                        placeholder="Site, Village..."
                                        style={{ width: '100%', padding: '10px 10px 10px 34px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid #2E7D67', color: 'white', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description & Voice */}
                        <div>
                            <label style={{ marginBottom: 6, fontSize: 12, fontWeight: 'bold', color: '#A7C7BC', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t.description}</span>
                                {isRecording && <span style={{ color: '#EF4444', animation: 'pulse 1.5s infinite' }}>🔴 {t.recording}</span>}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <textarea 
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    style={{ width: '100%', minHeight: 120, padding: 12, paddingRight: 50, borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: isRecording ? '1px solid #EF4444' : '1px solid #2E7D67', color: 'white', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
                                    placeholder={isRecording ? "Listening..." : "Type or record details..."}
                                />
                                <button 
                                    type="button"
                                    onClick={toggleRecording}
                                    style={{ 
                                        position: 'absolute', right: 10, top: 10, 
                                        background: isRecording ? '#EF4444' : '#2E7D67', 
                                        color: 'white', border: 'none', borderRadius: '50%', 
                                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        cursor: 'pointer', transition: 'background 0.2s',
                                        boxShadow: isRecording ? '0 0 10px rgba(239,68,68,0.5)' : 'none'
                                    }}
                                    title={t.voiceInput}
                                >
                                    {isRecording ? <Square size={16} fill="white" /> : <Mic size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Flags */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 'bold', color: '#A7C7BC' }}>{t.flags}</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {[
                                    { id: 'grant_issue', label: t.grantIssue, color: '#FBBF24' },
                                    { id: 'urgent', label: t.urgent, color: '#EF4444' },
                                    { id: 'violation', label: t.violation, color: '#F472B6' },
                                ].map(flag => {
                                    const active = form.flags.includes(flag.id);
                                    return (
                                        <button
                                            key={flag.id}
                                            type="button"
                                            onClick={() => toggleFlag(flag.id)}
                                            style={{
                                                background: active ? flag.color : 'rgba(255,255,255,0.05)',
                                                color: active ? '#0B3D2E' : '#A7C7BC',
                                                border: `1px solid ${active ? flag.color : '#2E7D67'}`,
                                                borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 'bold',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {active ? <CheckCircle2 size={14} /> : <Flag size={14} />}
                                            {flag.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button 
                            type="submit"
                            style={{ 
                                background: '#4ADE80', color: '#0B3D2E', 
                                border: 'none', borderRadius: 12, padding: 14, 
                                fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                marginTop: 8
                            }}
                        >
                            <FileText size={18} /> {t.save}
                        </button>
                    </form>
                </div>

                {/* Logs List & Export */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={20} /> {t.recentLogs}
                    </h2>
                    {logs.length > 0 && (
                        <button 
                            onClick={exportCSV}
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', color: '#A7C7BC', 
                                border: '1px solid #2E7D67', borderRadius: 8, padding: '6px 12px', 
                                fontSize: 12, fontWeight: 'bold', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <Download size={14} /> {t.export}
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC' }}>Loading logs...</div>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, background: 'rgba(0,0,0,0.1)', borderRadius: 16, color: '#A7C7BC', fontStyle: 'italic' }}>
                        {t.noLogs}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {logs.map(log => {
                            const typeCfg = activityTypes.find(t => t.value === log.activity_type) || activityTypes[4];
                            return (
                                <div key={log.id} style={{ background: 'rgba(13, 77, 58, 0.2)', borderRadius: 12, padding: 16, borderLeft: `4px solid ${typeCfg.color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, fontWeight: 'bold', color: typeCfg.color, background: `${typeCfg.color}22`, padding: '2px 8px', borderRadius: 4 }}>
                                                {typeCfg.label}
                                            </span>
                                            <span style={{ fontSize: 12, color: '#A7C7BC' }}>
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {log.details?.flags && log.details.flags.length > 0 && (
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {log.details.flags.map(f => (
                                                    <Flag key={f} size={14} color="#EF4444" fill={f === 'urgent' ? '#EF4444' : 'none'} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5, color: '#D1D5D8' }}>{log.details?.description}</p>
                                    {log.details?.location && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#A7C7BC' }}>
                                            <MapPin size={12} /> {log.details.location}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .compliance-grid { grid-template-columns: 1fr; }
                @media (min-width: 640px) { .compliance-grid { grid-template-columns: 1fr 1fr; } }
            `}</style>
        </div>
    );
};

export default Compliance;
