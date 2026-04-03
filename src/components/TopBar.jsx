import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, X, Home, Users, PlusSquare, MessageCircle } from 'lucide-react';
import './TopBar.css'; // Responsive rules go here

export const TopBar = ({ 
    type = 'standard', // 'standard' or 'main' (for Feed)
    title,
    icon: Icon,
    leftAction, // custom action instead of default back arrow
    rightAction, // custom components on the right (like "Create" buttons)
    titleColor = '#F2F1EE',
    critical = false, // specific prop for CrisisAlerts red styling
    sticky = true
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // The "Main" variant specific for Feed.jsx (with bottom navigation tabs)
    if (type === 'main') {
        const isMenuOpen = rightAction?.isMenuOpen;
        const setIsMenuOpen = rightAction?.setIsMenuOpen;

        return (
            <div className={`top-bar-container ${critical ? 'is-critical' : ''}`} style={!sticky ? { position: 'static' } : {}}>
                <div className="top-bar-main-flex">
                    <div className="top-bar-logo-group">
                        <div className="top-bar-logo" />
                    </div>

                    <div className="top-bar-nav-links">
                        <Link to="/feed" className="top-bar-nav-btn" style={{ color: location.pathname === '/feed' ? '#4ADE80' : '#F2F1EE' }}>
                            <Home size={22} strokeWidth={location.pathname === '/feed' ? 2.5 : 2} />
                            <span className="top-bar-nav-label" style={{ fontWeight: location.pathname === '/feed' ? 600 : 400 }}>Home</span>
                        </Link>

                        <Link to="/groups" className="top-bar-nav-btn" style={{ color: location.pathname.startsWith('/groups') ? '#4ADE80' : '#F2F1EE' }}>
                            <Users size={22} />
                            <span className="top-bar-nav-label">Groups</span>
                        </Link>

                        <Link to="/new-post" className="top-bar-nav-btn" style={{ color: '#F2F1EE' }}>
                            <PlusSquare size={22} />
                            <span className="top-bar-nav-label">Post</span>
                        </Link>

                        <Link to="/messages" className="top-bar-nav-btn" style={{ color: location.pathname.startsWith('/messages') ? '#4ADE80' : '#F2F1EE' }}>
                            <MessageCircle size={22} />
                            <span className="top-bar-nav-label">Chat</span>
                        </Link>

                        <button 
                            onClick={() => setIsMenuOpen && setIsMenuOpen(!isMenuOpen)}
                            className="top-bar-nav-btn"
                            style={{ color: '#F2F1EE' }}
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            <span className="top-bar-nav-label">More</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Standard variant for all other pages
    return (
        <div className={`top-bar-container ${critical ? 'is-critical' : ''}`} style={!sticky ? { position: 'static' } : {}}>
            <div className="top-bar-standard-flex">
                <div className="top-bar-left-group">
                    {leftAction !== null && (
                        <button 
                            onClick={() => leftAction ? leftAction() : navigate(-1)} 
                            className="top-bar-back-btn"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    {(title || Icon) && (
                        <h1 className="top-bar-title" style={{ color: titleColor }}>
                            {Icon && <span className="top-bar-title-icon">{Icon}</span>}
                            <span>{title}</span>
                        </h1>
                    )}
                </div>
                {rightAction && (
                    <div className="top-bar-right-group">
                        {rightAction}
                    </div>
                )}
            </div>
        </div>
    );
};
