import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Briefcase, 
  Copy, 
  Check, 
  Clock, 
  Globe, 
  Heart, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Send, 
  Terminal,
  Zap,
  Code2
} from 'lucide-react';
import type { Profile } from '../types';
import './AboutSection.css';

interface AboutSectionProps {
  profile?: Profile;
  onConnect?: () => void;
}

interface Pillar {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
}

const PILLARS: Pillar[] = [
  {
    id: 'empathy',
    icon: Heart,
    title: 'User Empathy',
    tagline: 'Human-Centered Design',
    description: 'Prioritizing intuitive workflows, accessibility, and delight to ensure every interaction feels effortless and natural.',
    keywords: ['Intuitive UX', 'Accessibility', 'Frictionless Flow']
  },
  {
    id: 'precision',
    icon: Layers,
    title: 'Pixel Precision',
    tagline: 'Meticulous Visuals',
    description: 'Crafting fluid 60fps micro-animations, harmonic typographic rhythms, and responsive layouts that adapt to any display.',
    keywords: ['Fluid Motion', 'Design Systems', 'Micro-interactions']
  },
  {
    id: 'architecture',
    icon: Cpu,
    title: 'Modern Architecture',
    tagline: 'Scalable Engineering',
    description: 'Structuring clean, modular, and maintainable codebases with reusable component patterns and robust data pipelines.',
    keywords: ['Component-Driven', 'Clean Code', 'Scalability']
  }
];

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, onConnect }) => {
  const [activePillar, setActivePillar] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [terminalView, setTerminalView] = useState<'manifesto' | 'skills'>('manifesto');

  // Mouse 3D tilt effect on the card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPos(prev => ({ ...prev, opacity: 0 }));
  };

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = profile?.email || 'darisivasundhara1@gmail.com';
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const codeSnippet = `// Vasundhara Darisi — Developer DNA
const developer = {
  name: "${profile?.name || 'Vasundhara Darisi'}",
  role: "Full Stack Software Engineer",
  education: "Computer Science & Engineering",
  coreStack: ["React", "Python", "Vite", "TypeScript", "SQL"],
  status: "Available for High-Impact Roles 🚀"
};`;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const CurrentPillarIcon = PILLARS[activePillar].icon;

  return (
    <section id="about" className="about-section">
      {/* Dynamic Background Mesh & Animated Ambient Orbs */}
      <div className="about-ambient-glow-1" />
      <div className="about-ambient-glow-2" />
      <div className="about-grid-overlay" />

      {/* Floating Interactive Geometric Particles */}
      <div className="about-particles-layer" aria-hidden="true">
        <motion.div 
          className="about-particle particle-1"
          animate={{ y: [-15, 15, -15], rotate: [0, 180, 360], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="about-particle particle-2"
          animate={{ y: [20, -20, 20], rotate: [360, 180, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="about-particle particle-3"
          animate={{ x: [-10, 10, -10], y: [-10, 10, -10], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* 3D Perspective Card Wrapper */}
        <div className="about-perspective-wrap">
          <motion.div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d" 
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="about-bento-card"
          >
            {/* Dynamic Cursor Spotlight Overlay */}
            <div 
              className="about-spotlight-layer"
              style={{
                background: `radial-gradient(650px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(230, 161, 71, 0.12), transparent 60%)`,
                opacity: spotlightPos.opacity
              }}
            />

            {/* Glowing Corner Accents */}
            <div className="about-corner-glow top-left" />
            <div className="about-corner-glow bottom-right" />

            {/* Content Grid */}
            <div className="about-content-grid">
              
              {/* LEFT COLUMN: The Narrative & Interactive Pillars */}
              <div className="about-narrative-col">
                
                {/* Eyebrow Pill with Pulsing Sparkle */}
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="about-eyebrow-pill"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="about-sparkle-icon"
                  >
                    <Sparkles size={15} />
                  </motion.div>
                  <span>Creative Philosophy</span>
                </motion.div>

                {/* Section Title with Animated Shimmer Line */}
                <div className="about-heading-box">
                  <h2 className="section-title about-title">
                    The <span className="text-gradient-orange">Developer.</span>
                  </h2>
                  <div className="about-title-bar">
                    <div className="about-title-glow-bead" />
                  </div>
                </div>

                {/* Bio Narrative with Styled Typography */}
                <p className="about-bio-text">
                  {profile?.careerObjective || 
                    'Motivated Computer Science student with hands-on experience in Python, Full Stack Web Development, and Database Systems. Looking to contribute to tech projects and enhance my software development skills.'}
                </p>

                {/* Interactive Philosophy Pillars (Reimagined with Rich Animations) */}
                <div className="about-pillars-section">
                  <div className="about-pillars-header">
                    <span className="about-pillars-caption">Core Architectural Pillars</span>
                    <span className="about-pillars-hint">Click or hover to explore</span>
                  </div>

                  <div className="about-pillars-pills">
                    {PILLARS.map((pillar, index) => {
                      const IconComponent = pillar.icon;
                      const isActive = activePillar === index;
                      return (
                        <motion.button
                          key={pillar.id}
                          type="button"
                          onClick={() => setActivePillar(index)}
                          onMouseEnter={() => setActivePillar(index)}
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`about-pillar-btn ${isActive ? 'active' : ''}`}
                        >
                          <span className="about-pillar-indicator" />
                          <IconComponent size={14} className="about-pillar-btn-icon" />
                          <span className="about-pillar-title">{pillar.title}</span>
                          {isActive && (
                            <motion.span 
                              layoutId="activePillarBadge"
                              className="about-pillar-active-glow"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Expanded Pillar Details Card with Animated Transitions */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePillar}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="about-pillar-expanded-card"
                    >
                      <div className="about-pillar-card-top">
                        <div className="about-pillar-card-icon-box">
                          <CurrentPillarIcon size={18} />
                        </div>
                        <div>
                          <h4 className="about-pillar-card-title">{PILLARS[activePillar].title}</h4>
                          <span className="about-pillar-card-tag">{PILLARS[activePillar].tagline}</span>
                        </div>
                      </div>
                      <p className="about-pillar-card-desc">
                        {PILLARS[activePillar].description}
                      </p>
                      <div className="about-pillar-keywords">
                        {PILLARS[activePillar].keywords.map((kw, i) => (
                          <span key={i} className="about-pillar-keyword-tag">
                            <span className="about-kw-dot" /> {kw}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Interactive Developer DNA / Code Console */}
                <div className="about-terminal-container">
                  <div className="about-terminal-header">
                    <div className="terminal-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    
                    <div className="terminal-tabs">
                      <button 
                        type="button" 
                        onClick={() => setTerminalView('manifesto')}
                        className={`terminal-tab ${terminalView === 'manifesto' ? 'active' : ''}`}
                      >
                        <Code2 size={13} /> developer.ts
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setTerminalView('skills')}
                        className={`terminal-tab ${terminalView === 'skills' ? 'active' : ''}`}
                      >
                        <Terminal size={13} /> mindset.json
                      </button>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleCopyCode} 
                      className="terminal-copy-btn"
                      title="Copy code snippet"
                    >
                      {copiedCode ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="terminal-body">
                    {terminalView === 'manifesto' ? (
                      <pre className="terminal-code">
                        <code>
                          <span className="code-comment">// Core Engineering Specs</span>{'\n'}
                          <span className="code-keyword">const</span> <span className="code-var">developer</span> = {'{\n'}
                          {'  '}<span className="code-prop">name</span>: <span className="code-string">"{profile?.name || 'Vasundhara Darisi'}"</span>,{'\n'}
                          {'  '}<span className="code-prop">focus</span>: [<span className="code-string">"Full-Stack Web"</span>, <span className="code-string">"Python"</span>, <span className="code-string">"UI Architecture"</span>],{'\n'}
                          {'  '}<span className="code-prop">mindset</span>: <span className="code-string">"Pixel-perfect UI meets robust logic"</span>,{'\n'}
                          {'  '}<span className="code-prop">available</span>: <span className="code-boolean">true</span> <span className="code-cursor">_</span>{'\n'}
                          {'}'};
                        </code>
                      </pre>
                    ) : (
                      <pre className="terminal-code">
                        <code>
                          <span className="code-comment">// Professional Mindset</span>{'\n'}
                          {'{'}{'\n'}
                          {'  '}<span className="code-prop">"problemSolving"</span>: <span className="code-string">"Analytical & iterative"</span>,{'\n'}
                          {'  '}<span className="code-prop">"velocity"</span>: <span className="code-string">"Fast learner, adaptable"</span>,{'\n'}
                          {'  '}<span className="code-prop">"dedication"</span>: <span className="code-string">"100% Quality-driven"</span> <span className="code-cursor">_</span>{'\n'}
                          {'}'}
                        </code>
                      </pre>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive Info Panels */}
              <div className="about-cards-col">
                
                {/* 1. BASE LOCATION CARD with Radar Waves & Live Clock */}
                <motion.div 
                  whileHover={{ y: -4, borderColor: 'var(--accent-gold)' }}
                  transition={{ duration: 0.25 }}
                  className="about-info-card location-card"
                >
                  <div className="about-card-left">
                    <div className="about-icon-wrapper location-icon">
                      {/* Radiating radar pulse rings */}
                      <span className="sonar-ring sonar-ring-1" />
                      <span className="sonar-ring sonar-ring-2" />
                      <MapPin size={22} className="relative-icon" />
                    </div>
                  </div>
                  <div className="about-card-body">
                    <div className="about-card-top-row">
                      <span className="info-label">Base Location</span>
                      <span className="about-badge-mini">
                        <Globe size={11} className="spin-slow" /> Remote-Ready
                      </span>
                    </div>
                    <p className="info-value location-text">{profile?.location || 'Kakinada, India'}</p>
                    
                    {/* Live Clock Indicator */}
                    {currentTime && (
                      <div className="about-live-clock">
                        <Clock size={12} className="clock-icon" />
                        <span>{currentTime}</span>
                        <span className="clock-tz">IST (UTC+5:30)</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* 2. DIRECT CONTACT CARD with 1-Click Copy & Quick Send */}
                <motion.div 
                  whileHover={{ y: -4, borderColor: 'var(--accent-orange)' }}
                  transition={{ duration: 0.25 }}
                  className="about-info-card email-card"
                >
                  <div className="about-card-left">
                    <div className="about-icon-wrapper email-icon">
                      <Mail size={22} />
                    </div>
                  </div>
                  <div className="about-card-body">
                    <div className="about-card-top-row">
                      <span className="info-label">Direct Contact</span>
                      <span className="about-badge-mini success-tint">
                        <Zap size={11} /> Quick Reply
                      </span>
                    </div>
                    <div className="about-email-row">
                      <a 
                        href={`mailto:${profile?.email || 'darisivasundhara1@gmail.com'}`}
                        className="info-value email-value link-hover"
                        title="Send email"
                      >
                        {profile?.email || 'darisivasundhara1@gmail.com'}
                      </a>
                    </div>
                    
                    {/* Action buttons: Copy & Mailto */}
                    <div className="about-email-actions">
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className={`about-action-btn ${copiedEmail ? 'copied' : ''}`}
                        title="Copy email address"
                      >
                        {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedEmail ? 'Email Copied! ✨' : 'Copy Email'}</span>
                      </button>

                      <a 
                        href={`mailto:${profile?.email || 'darisivasundhara1@gmail.com'}`} 
                        className="about-action-btn secondary"
                      >
                        <Send size={12} />
                        <span>Send Message</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* 3. STATUS & IMMEDIATE AVAILABILITY CARD */}
                <motion.div 
                  whileHover={{ y: -4, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                  transition={{ duration: 0.25 }}
                  className="about-info-card status-card"
                >
                  <div className="about-card-left">
                    <div className="about-icon-wrapper status-icon">
                      <Briefcase size={22} />
                    </div>
                  </div>
                  <div className="about-card-body">
                    <span className="info-label">Current Status</span>
                    <div className="about-status-value">
                      <span className="pulse-beacon-multi">
                        <span className="beacon-core" />
                        <span className="beacon-wave wave-1" />
                        <span className="beacon-wave wave-2" />
                      </span>
                      <span className="status-highlight">Available for Opportunities</span>
                    </div>

                    <div className="about-status-tags">
                      <span className="status-tag">Full-Time</span>
                      <span className="status-tag">Internships</span>
                      <span className="status-tag">Projects</span>
                    </div>

                    {/* Instant Connect CTA */}
                    {onConnect && (
                      <motion.button
                        type="button"
                        onClick={onConnect}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="about-connect-cta-btn"
                      >
                        <span>Let's Build Together</span>
                        <ArrowRight size={14} className="cta-arrow" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* 4. QUICK VALUE METRICS STRIP */}
                <div className="about-metrics-strip">
                  <div className="metric-chip">
                    <span className="metric-dot gold" />
                    <div>
                      <strong className="metric-title">Clean Code</strong>
                      <span className="metric-sub">Modular & Modern</span>
                    </div>
                  </div>
                  <div className="metric-chip">
                    <span className="metric-dot orange" />
                    <div>
                      <strong className="metric-title">Fast Velocity</strong>
                      <span className="metric-sub">Quick Adaptability</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
