import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, TrendingUp, DollarSign, Users, FileText, 
    AlertTriangle, CheckCircle, BarChart3, PieChart
} from 'lucide-react';

const Analytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        personal: {
            salesVolume: 0,
            salesCount: 0,
            resourcesViews: 0,
            grievancesResolved: 0
        },
        platform: {
            totalUsers: 0,
            totalVolume: 0,
            activeAlerts: 0,
            resolvedGrievances: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('personal'); // 'personal' or 'platform'

    useEffect(() => {
        fetchAnalytics();
    }, [user.id]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            
            // --- Personal Stats ---
            // 1. Sales
            const { data: sales } = await supabase
                .from('transactions')
                .select('amount')
                .eq('seller_id', user.id);
            
            const salesVolume = sales?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

            // 2. Resources Views
            const { data: resources } = await supabase
                .from('resources')
                .select('view_count')
                .eq('user_id', user.id);
            
            const resourcesViews = resources?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0;

            // 3. Grievances
            const { count: grievancesResolved } = await supabase
                .from('grievances')
                .select('id', { count: 'exact', head: true })
                .eq('reporter_id', user.id)
                .eq('status', 'resolved');

            // --- Platform Stats (Community Impact) ---
            // 1. Total Users
            const { count: totalUsers } = await supabase
                .from('users')
                .select('id', { count: 'exact', head: true });

            // 2. Total Volume (Aggregate)
            // Note: This might be heavy on large DBs, usually requires a materialized view or restricted query.
            // For MVP, we'll fetch a limited set or count transactions if volume is too much data to transfer, 
            // but fetching 'amount' only is okay for small scale.
            const { data: allSales } = await supabase
                .from('transactions')
                .select('amount')
                .limit(1000); // Limit for performance safety in demo
            
            const totalVolume = allSales?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

            // 3. Active Alerts
            const { count: activeAlerts } = await supabase
                .from('crisis_alerts')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'active');

            // 4. Resolved Grievances Platform-wide
            const { count: totalResolved } = await supabase
                .from('grievances')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'resolved');

            setStats({
                personal: {
                    salesVolume,
                    salesCount: sales?.length || 0,
                    resourcesViews,
                    grievancesResolved: grievancesResolved || 0
                },
                platform: {
                    totalUsers: totalUsers || 0,
                    totalVolume,
                    activeAlerts: activeAlerts || 0,
                    resolvedGrievances: totalResolved || 0
                }
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('mg-MG', { style: 'currency', currency: 'MGA', maximumFractionDigits: 0 }).format(val);
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <div style={{ background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 20, border: '1px solid #2E7D67', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#A7C7BC', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                    {icon}
                </div>
            </div>
            <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>{value}</div>
                {subtitle && <div style={{ fontSize: 12, color: '#A7C7BC', marginTop: 4 }}>{subtitle}</div>}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0B3D2E', color: '#F2F1EE', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ 
                position: 'sticky', top: 0, zIndex: 1000, 
                background: 'rgba(11, 61, 46, 0.95)', 
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderBottom: '1px solid #2E7D67',
                display: 'flex', alignItems: 'center', gap: 12
            }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#A7C7BC', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={20} style={{ color: '#4ADE80' }} />
                    Analytics Dashboard
                </h1>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12, marginBottom: 24 }}>
                    <button 
                        onClick={() => setTab('personal')}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, background: tab === 'personal' ? '#2E7D67' : 'transparent', color: tab === 'personal' ? 'white' : '#A7C7BC', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        My Impact
                    </button>
                    <button 
                        onClick={() => setTab('platform')}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, background: tab === 'platform' ? '#2E7D67' : 'transparent', color: tab === 'platform' ? 'white' : '#A7C7BC', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Community Pulse
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#A7C7BC' }}>Loading specific data...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                        {tab === 'personal' ? (
                            <>
                                <StatCard 
                                    title="Total Sales" 
                                    value={formatCurrency(stats.personal.salesVolume)} 
                                    icon={<DollarSign size={18} />} 
                                    color="#4ADE80" 
                                    subtitle={`${stats.personal.salesCount} transactions`}
                                />
                                <StatCard 
                                    title="Knowledge Shared" 
                                    value={stats.personal.resourcesViews} 
                                    icon={<FileText size={18} />} 
                                    color="#60A5FA" 
                                    subtitle="Total views on resources"
                                />
                                <StatCard 
                                    title="Issues Resolved" 
                                    value={stats.personal.grievancesResolved} 
                                    icon={<CheckCircle size={18} />} 
                                    color="#FBBF24" 
                                    subtitle="Grievances closed"
                                />
                            </>
                        ) : (
                            <>
                                <StatCard 
                                    title="Community Size" 
                                    value={stats.platform.totalUsers} 
                                    icon={<Users size={18} />} 
                                    color="#A78BFA" 
                                    subtitle="Registered members"
                                />
                                <StatCard 
                                    title="Economic Velocity" 
                                    value={formatCurrency(stats.platform.totalVolume)} 
                                    icon={<BarChart3 size={18} />} 
                                    color="#4ADE80" 
                                    subtitle="Marketplace volume"
                                />
                                <StatCard 
                                    title="Active Alerts" 
                                    value={stats.platform.activeAlerts} 
                                    icon={<AlertTriangle size={18} />} 
                                    color="#EF4444" 
                                    subtitle="Ongoing crises"
                                />
                                <StatCard 
                                    title="Justice Served" 
                                    value={stats.platform.resolvedGrievances} 
                                    icon={<CheckCircle size={18} />} 
                                    color="#FBBF24" 
                                    subtitle="Total solved cases"
                                />
                            </>
                        )}
                    </div>
                )}
                
                {/* Visual Chart Placeholder */}
                <div style={{ marginTop: 24, background: 'rgba(13, 77, 58, 0.4)', borderRadius: 16, padding: 24, border: '1px solid #2E7D67' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PieChart size={18} color="#A7C7BC" /> 
                        {tab === 'personal' ? 'Performance Overview' : 'Sector Distribution'}
                    </h3>
                    <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 10, borderBottom: '1px solid #2E7D67' }}>
                        {/* Fake Bar Chart */}
                        {[60, 40, 75, 50, 80, 45, 90].map((h, i) => (
                            <div key={i} style={{ width: '8%', height: `${h}%`, background: tab === 'personal' ? '#4ADE80' : '#A78BFA', borderRadius: '4px 4px 0 0', opacity: 0.7 }} />
                        ))}
                    </div>
                    <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#A7C7BC' }}>
                        {tab === 'personal' ? 'Last 7 days activity' : 'Activity across sectors (simulated)'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
