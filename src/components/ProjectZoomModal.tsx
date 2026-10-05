import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  GitBranch, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Code2,
  ChevronDown
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { Project } from '../types';
import './ProjectZoomModal.css';

interface ProjectZoomModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onWhatsAppInquiry?: (projectTitle: string) => void;
}

export const ProjectZoomModal: React.FC<ProjectZoomModalProps> = ({
  project,
  isOpen,
  onClose,
  onWhatsAppInquiry
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setPanPos({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!project) return null;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.35, 2.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    setPanPos({
      x: -xPct * (zoomLevel - 1) * 120,
      y: -yPct * (zoomLevel - 1) * 120
    });
  };

  const projectImage = (project.images && project.images.length > 0)
    ? project.images[0]
    : project.title?.includes('Door')
      ? '/auto-door-project.jpg'
      : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="project-zoom-overlay" data-lenis-prevent="true">
          {/* Backdrop Blur */}
          <motion.div 
            className="project-zoom-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div 
            className="project-zoom-modal-dialog"
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar Header */}
            <div className="zoom-modal-header">
              <div className="zoom-modal-eyebrow">
                <span className="zoom-reticle-badge">
                  <Scan size={14} className="spin-on-hover" />
                </span>
                <span className="zoom-modal-tagline">
                  ZOOM IN. <strong>STAND OUT.</strong>
                </span>
                <span className="zoom-live-dot" />
              </div>

              {/* Close Button */}
              <button 
                type="button" 
                className="zoom-modal-close-btn" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Split Stage with Animated Smooth Scroll */}
            <div 
              className="zoom-modal-body" 
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              
              {/* LEFT: Interactive Zoom Inspection Viewport */}
              <div className="zoom-stage-col">
                <div 
                  className={`zoom-viewport ${zoomLevel > 1 ? 'is-magnified' : ''}`}
                  onMouseMove={handleMouseMove}
                >
                  {projectImage ? (
                    <motion.img 
                      src={projectImage} 
                      alt={project.title}
                      className="zoom-stage-image"
                      animate={{ 
                        scale: zoomLevel,
                        x: panPos.x,
                        y: panPos.y
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 24 }}
                    />
                  ) : (
                    <div className="zoom-fallback-canvas">
                      <Code2 size={72} className="text-gradient-gold" />
                      <p className="zoom-fallback-title">{project.title}</p>
                      <span className="zoom-fallback-sub">Architecture & Logic Flow</span>
                    </div>
                  )}

                  {/* Corner Inspection Reticles */}
                  <div className="reticle top-left" />
                  <div className="reticle top-right" />
                  <div className="reticle bottom-left" />
                  <div className="reticle bottom-right" />

                  {/* High Resolution Floating Indicator */}
                  <div className="zoom-spec-tag">
                    <Sparkles size={12} />
                    <span>Inspection Mode: {zoomLevel.toFixed(1)}x</span>
                  </div>
                </div>

                {/* Zoom Controls Bar */}
                <div className="zoom-controls-toolbar">
                  <div className="zoom-controls-group">
                    <button 
                      type="button" 
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      className="zoom-tool-btn"
                      title="Zoom Out"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <span className="zoom-level-indicator">{Math.round(zoomLevel * 100)}%</span>
                    <button 
                      type="button" 
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 2.2}
                      className="zoom-tool-btn"
                      title="Zoom In"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleResetZoom}
                      className="zoom-tool-btn reset-btn"
                      title="Reset View"
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                  </div>
                  <span className="zoom-tip-text">Hover & drag to inspect details</span>
                </div>
              </div>

              {/* RIGHT: Stand Out Breakdown & Architecture */}
              <div 
                className="zoom-details-col" 
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Interactive Animated Section Quick Jump Bar */}
                <div className="zoom-section-navigator">
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('zoom-summary')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                    className="zoom-nav-pill"
                  >
                    Overview
                  </button>
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('zoom-standout')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                    className="zoom-nav-pill"
                  >
                    Stand Out
                  </button>
                  {project.technologies && project.technologies.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('zoom-tech')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                      className="zoom-nav-pill"
                    >
                      Tech Stack
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('zoom-actions')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                    className="zoom-nav-pill"
                  >
                    Connect
                  </button>
                </div>

                <div className="zoom-details-content">
                  
                  {project.featured && (
                    <div className="zoom-featured-pill">
                      <Sparkles size={12} />
                      <span>FEATURED SHOWCASE</span>
                    </div>
                  )}

                  <h3 className="zoom-project-title">{project.title}</h3>
                  {project.subtitle && (
                    <p className="zoom-project-subtitle">{project.subtitle}</p>
                  )}

                  <div className="zoom-section-divider" />

                  {/* Deep Project Narrative */}
                  <div id="zoom-summary" className="zoom-narrative-block">
                    <h4 className="zoom-block-label">
                      <Layers size={14} /> Executive Summary
                    </h4>
                    <p className="zoom-project-desc">{project.description}</p>
                  </div>

                  {/* Why it Stands Out (The Stand Out Manifesto) */}
                  <div id="zoom-standout" className="zoom-standout-box">
                    <h4 className="zoom-standout-heading">
                      <Sparkles size={14} className="text-gradient-orange" /> 
                      WHY THIS PROJECT STANDS OUT
                    </h4>
                    <ul className="zoom-standout-list">
                      <li>
                        <CheckCircle2 size={14} className="standout-check" />
                        <span><strong>Engineering Precision:</strong> Built with robust modular logic and real-time sensor actuation.</span>
                      </li>
                      <li>
                        <CheckCircle2 size={14} className="standout-check" />
                        <span><strong>Human Impact:</strong> Solves touchless accessibility and hygienic throughput in high-density environments.</span>
                      </li>
                      <li>
                        <CheckCircle2 size={14} className="standout-check" />
                        <span><strong>Performance First:</strong> Zero-latency response loop optimized for 24/7 reliability.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Technologies Stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div id="zoom-tech" className="zoom-tech-block">
                      <h4 className="zoom-block-label">Tech Stack & Frameworks</h4>
                      <div className="zoom-tech-chips">
                        {project.technologies.map(tech => (
                          <span key={tech} className="zoom-tech-chip">
                            <span className="chip-dot" /> {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real World Applications */}
                  {project.applications && project.applications.length > 0 && (
                    <div className="zoom-app-block">
                      <h4 className="zoom-block-label">Deployment Sectors</h4>
                      <div className="zoom-app-pills">
                        {project.applications.map(app => (
                          <span key={app} className="zoom-app-pill">
                            🏢 {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Links & Inquiry */}
                  <div id="zoom-actions" className="zoom-actions-row">
                    {project.projectUrl && (
                      <a 
                        href={project.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="zoom-action-btn primary"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="zoom-action-btn secondary"
                      >
                        <GitBranch size={16} />
                        <span>Source Code</span>
                      </a>
                    )}

                    {onWhatsAppInquiry && (
                      <button
                        type="button"
                        onClick={() => onWhatsAppInquiry(project.title)}
                        className="zoom-action-btn whatsapp"
                      >
                        <WhatsAppIcon size={16} />
                        <span>Inquire on WhatsApp</span>
                      </button>
                    )}
                  </div>

                  {/* Floating Scroll Indicator */}
                  <div className="zoom-scroll-animated-hint">
                    <span>Scroll to explore full architectural details</span>
                    <ChevronDown size={14} className="bounce-arrow" />
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
