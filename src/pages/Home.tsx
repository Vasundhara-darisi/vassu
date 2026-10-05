import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion';
import { getPortfolioData } from '../firebase/services';
import type { PortfolioData, Project } from '../types';
import { MapPin, ExternalLink, Code2, GraduationCap, Sparkles, Rocket, GitBranch, MessageCircle, ArrowRight, ZoomIn, Scan, Maximize2 } from 'lucide-react';
import profileImage from '../assets/profile.jpg';
import { AboutSection } from '../components/AboutSection';
import { ProjectZoomModal } from '../components/ProjectZoomModal';
import { openWhatsAppChat } from '../utils/whatsapp';


export const Home = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<number>(0);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All');
  const [selectedZoomProject, setSelectedZoomProject] = useState<Project | null>(null);

  // Vertical Parallax
  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yHeroImg = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const result = await getPortfolioData();
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error loading portfolio:", err);
          setError("Failed to load portfolio data. Please try again later.");
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const openWhatsApp = (text: string = '') => {
    const phoneNumber = data?.whatsapp?.phoneNumber || '917729805155';
    const message = text.trim() || data?.whatsapp?.defaultMessage?.trim() || 'Hi Vasundhara! I saw your portfolio and would like to connect.';
    openWhatsAppChat(phoneNumber, message);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-space)' }}>
        <div className="loading-pulse">
          <Sparkles className="inline-block mr-2" /> Loading Profile...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-space)' }}>
        <p style={{ color: 'var(--accent-violet)' }}>{error || "No data available."}</p>
      </div>
    );
  }

  const { profile, skills, education, experience, projects, whatsapp } = data;

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="portfolio-wrapper">
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX: scrollYProgress }} />

      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Floating Brown Fantasy Embers */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        <div className="fantasy-ember" style={{ top: '15%', left: '8%', animationDuration: '7s' }} />
        <div className="fantasy-ember" style={{ top: '35%', left: '92%', animationDuration: '9s', animationDelay: '1.5s' }} />
        <div className="fantasy-ember" style={{ top: '55%', left: '14%', animationDuration: '8s', animationDelay: '3s' }} />
        <div className="fantasy-ember" style={{ top: '75%', left: '80%', animationDuration: '6.5s', animationDelay: '2s' }} />
        <div className="fantasy-ember" style={{ top: '25%', left: '70%', animationDuration: '10s', animationDelay: '4s' }} />
        <div className="fantasy-ember" style={{ top: '88%', left: '30%', animationDuration: '7.5s', animationDelay: '0.8s' }} />
      </div>
      
      {/* 1. HERO - Professional & Premium */}
      <section id="home" className="hero-section">
        <div className="hero-bg-professional">
          <div className="hero-grid-lines"></div>
          <div className="hero-glow-warm"></div>
          <div className="fantasy-super-glow"></div>
          
          <motion.div animate={{ rotate: 360, y: [0, 50, 0] }} transition={{ duration: 25, repeat: Infinity }} style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.1, zIndex: 0 }}>
             <Code2 size={100} color="var(--accent-gold)" />
          </motion.div>
          <motion.div animate={{ rotate: -360, y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', left: '10%', opacity: 0.05, zIndex: 0 }}>
             <Rocket size={120} color="var(--accent-orange)" />
          </motion.div>
        </div>
        
        <div className="container hero-container">
          <motion.div 
            style={{ y: yHeroText }}
            initial="hidden" animate="visible" variants={staggerContainer}
            className="hero-content"
          >
            <motion.div variants={fadeInUp} className="hero-badge">
              <span className="badge-dot"></span>
              <span>Product & Visual Designer</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="hero-title">
              Hi, I'm <br/>
              <span className="text-gradient-gold">{profile?.name || 'Darisi Vasundhara'}</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="hero-description">
              {profile?.careerObjective || 'A passionate software developer focused on building robust applications and elegant digital experiences. Expertise in Python, modern web technologies, and data-driven solutions.'}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="hero-skills-mini">
              <span className="hero-fantasy-capsule"><span className="badge-dot"></span> Visual Identity</span>
              <span className="hero-fantasy-capsule"><span className="badge-dot"></span> Brand Strategy & Design System</span>
              <span className="hero-fantasy-capsule"><span className="badge-dot"></span> Prototyping & Wireframing</span>
            </motion.div>

            <motion.div variants={fadeInUp} className="hero-actions">
              <a href="#project" className="btn-primary">
                View Projects <ArrowRight size={18} />
              </a>
              <button onClick={() => openWhatsApp('Hi Vasundhara! I saw your portfolio and would like to connect.')} className="btn-secondary">
                <MessageCircle size={18} /> Contact Me
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ y: yHeroImg }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hero-visual"
          >
            <div className="profile-wrapper">
              {/* Astrolabe Celestial Orbit Ring */}
              <div className="astrolabe-compass-ring">
                <span className="astrolabe-point" style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}></span>
                <span className="astrolabe-point" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}></span>
                <span className="astrolabe-point" style={{ left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}></span>
                <span className="astrolabe-point" style={{ right: 0, top: '50%', transform: 'translate(50%, -50%)' }}></span>
              </div>
              <div className="astrolabe-compass-ring-inner"></div>
              <div className="profile-decor-ring"></div>
              <div className="profile-decor-ring-2"></div>
              <div className="profile-image-container">
                <img 
                  src={(profile?.profileImageUrl && profile.profileImageUrl !== '/portrait.jpg') ? profile.profileImageUrl : profileImage} 
                  alt={profile?.name || 'Profile'}
                  className="profile-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.name || 'DV') + '&background=d46a2a&color=fff&size=400';
                  }}
                />
              </div>
              
              <div className="profile-location-badge">
                <MapPin size={14} className="text-gradient-gold" />
                <span>{profile?.location || 'India'}</span>
              </div>

            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="scroll-indicator"
        >
          <span>Explore</span>
          <div className="scroll-line"></div>
        </motion.div>
      </section>

      {/* 1.5. CREATIVE FLOATING ORBS */}
      <div className="creative-separator" style={{ position: 'relative', height: '250px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginTop: '2rem' }}>
        <motion.div 
          animate={{ y: [-30, 30, -30], x: [-15, 15, -15], rotate: [0, 90, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', left: '15%', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--accent-orange) 0%, transparent 70%)', filter: 'blur(40px)', opacity: 0.2 }}
        />
        <motion.div 
          animate={{ y: [30, -30, 30], x: [15, -15, 15], rotate: [0, -90, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', right: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)', filter: 'blur(50px)', opacity: 0.15 }}
        />
        
        <div style={{ display: 'flex', gap: '2rem', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center', padding: '0 1rem' }}>
          {['Visual Identity', 'Brand Strategy', 'Prototyping'].map((text, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                style={{
                  padding: '1rem 2.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.05, y: -5, borderColor: 'var(--accent-gold)', boxShadow: '0 15px 30px rgba(230,161,71,0.2)' }}
             >
               {text}
             </motion.div>
          ))}
        </div>
      </div>

      {/* 2. ABOUT ME - INTERACTIVE SHOWCASE & ANIMATIONS */}
      <AboutSection 
        profile={profile} 
        onConnect={() => openWhatsApp('Hi Vasundhara! I saw your portfolio and would like to connect about opportunities.')}
      />

      {/* 3. SKILLS - INTERACTIVE TECH STACK PILLBOX */}
      {skills && skills.length > 0 && (() => {
        const skillCategories = ['All', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];
        const displayedSkills = selectedSkillCategory === 'All' 
          ? skills 
          : skills.filter(s => s.category === selectedSkillCategory);

        return (
          <section id="skills" className="skills-section">
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp} className="section-header-center">
                <h2 className="section-title">Interactive <span className="text-gradient-gold">Tech Stack.</span></h2>
                <p className="section-subtitle">Core technologies I use to craft digital experiences.</p>
              </motion.div>
              
              {/* Alchemy Category Filter */}
              {skillCategories.length > 1 && (
                <div className="alchemy-filter-bar">
                  {skillCategories.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setSelectedSkillCategory(cat)} 
                      className={`alchemy-filter-btn ${selectedSkillCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={staggerContainer}
                className="tech-pillbox-container"
              >
                <AnimatePresence mode="popLayout">
                  {displayedSkills.map((skill, idx) => (
                    <motion.div 
                      key={skill.id || skill.name} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      variants={fadeInUp} 
                      className="tech-pill" 
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <span className="tech-pill-dot" style={{ backgroundColor: idx % 3 === 0 ? 'var(--accent-gold)' : idx % 3 === 1 ? 'var(--accent-orange)' : 'var(--accent-copper)' }}></span>
                      <span className="tech-pill-name">{skill.name}</span>
                      <span className="tech-pill-cat">{skill.category}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* 4. PROJECTS - INTERACTIVE SHOWCASE ACCORDION with 'ZOOM IN. STAND OUT.' */}
      {projects && projects.length > 0 && (
        <section id="project" className="projects-section-fullscreen">
          <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '1.5rem' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp} className="section-header-center" style={{ marginBottom: '1.5rem' }}>
              <div className="work-zoom-eyebrow">
                <span className="zoom-reticle-dot"><Scan size={14} /></span>
                <span className="zoom-eyebrow-text">ZOOM IN. STAND OUT.</span>
                <span className="pulse-beacon" style={{ width: 8, height: 8 }} />
              </div>
              <h2 className="section-title" style={{ marginTop: '0.4rem', marginBottom: '0.5rem' }}>
                Selected <span className="text-gradient-orange">Works.</span>
              </h2>
              <p className="work-tagline">
                <strong>ZOOM IN</strong> to inspect engineering details. Built to <strong>STAND OUT</strong> in performance & craftsmanship.
              </p>
            </motion.div>
          </div>
          
          <div className="project-accordion-container">
            {projects.sort((a, b) => a.order - b.order).slice(0, 5).map((project, index) => (
              <div 
                key={project.id || index} 
                className={`project-accordion-item ${activeProject === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveProject(index)}
                onClick={() => setActiveProject(index)}
              >
                <div className="accordion-bg">
                  {((project.images && project.images.length > 0) || project.title?.includes('Door')) ? (
                    <img src={(project.images && project.images.length > 0) ? project.images[0] : '/auto-door-project.jpg'} alt={project.title} loading="lazy" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
                      <Code2 size={64} className="text-gradient-gold opacity-50" />
                    </div>
                  )}
                </div>
                <div className="accordion-overlay"></div>

                {/* Floating ZOOM IN prompt chip on hover */}
                <div 
                  className="accordion-zoom-prompt"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedZoomProject(project);
                  }}
                  title="Click to Zoom In & Stand Out"
                >
                  <ZoomIn size={14} />
                  <span>ZOOM IN</span>
                </div>
                
                <div className="accordion-content">
                  <div className="accordion-title-vertical">
                    {project.title}
                  </div>
                  <div className="accordion-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                      {project.featured && (
                        <span className="badge-featured" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(230, 161, 71, 0.9)', color: '#fff', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          <Rocket size={12} /> Featured
                        </span>
                      )}
                      <span className="badge-standout">
                        <Scan size={12} /> STAND OUT
                      </span>
                    </div>

                    <h3 className="bento-title" style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{project.title}</h3>
                    <p className="bento-desc" style={{ fontSize: '1rem', marginBottom: '1.25rem', maxWidth: '520px' }}>{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="tech-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.35rem' }}>
                        {project.technologies.slice(0, 4).map(tech => (
                          <span key={tech} className="tech-tag" style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fff' }}>{tech}</span>
                        ))}
                      </div>
                    )}

                    <div className="bento-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {/* The prominent 'ZOOM IN. STAND OUT.' Interactive Feature Button */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedZoomProject(project);
                        }}
                        className="btn-zoom-standout-feature"
                        title="Zoom In to inspect every detail"
                      >
                        <ZoomIn size={16} />
                        <span>ZOOM IN. STAND OUT.</span>
                        <Maximize2 size={13} style={{ opacity: 0.7 }} />
                      </button>

                      {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="bento-icon-btn" title="Live Project" style={{ background: 'var(--accent-gold)' }}>
                          <ExternalLink size={18} color="#fff" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bento-icon-btn" title="GitHub Code" style={{ background: 'var(--text-primary)' }}>
                          <GitBranch size={18} color="var(--bg-primary)" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ZOOM IN. STAND OUT. Modal Inspector */}
          <ProjectZoomModal 
            project={selectedZoomProject}
            isOpen={!!selectedZoomProject}
            onClose={() => setSelectedZoomProject(null)}
            onWhatsAppInquiry={(title) => openWhatsApp(`Hi Vasundhara! I explored your "${title}" project through the Zoom In inspector and would like to connect.`)}
          />
        </section>
      )}

      {/* 5. EXPERIENCE - HORIZONTAL JOURNEY */}
      {experience && experience.length > 0 && (
        <section id="journey" className="experience-section-fullscreen">
          
          <motion.div 
            animate={{ rotate: 360, opacity: [0.05, 0.15, 0.05] }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: '10%', right: '10%', zIndex: 0 }}
          >
            <Sparkles size={100} color="var(--accent-orange)" />
          </motion.div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp} className="section-header-center">
              <h2 className="section-title">Professional <span className="text-gradient-gold">Journey.</span></h2>
            </motion.div>
          </div>
          
          <div className="horizontal-journey-container">
            {experience.sort((a, b) => a.order - b.order).map((exp, idx) => (
              <motion.div 
                key={exp.id || idx} 
                className="journey-node"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="journey-milestone-marker">0{idx + 1}</div>
                <div className="journey-abstract-orb"></div>
                <h3 className="journey-role">{exp.role}</h3>
                <h4 className="journey-company">{exp.company}</h4>
                {exp.startDate && exp.endDate && (
                  <div>
                    <span className="journey-date">{exp.startDate} — {exp.endDate}</span>
                  </div>
                )}
                {exp.description && <p className="journey-desc">{exp.description}</p>}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 6. EDUCATION - World Class Crest Cards */}
      {education && education.length > 0 && (
        <section id="education" className="education-section" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0' }}>
          
          <motion.div 
            animate={{ rotate: [0, 180, 360], opacity: [0.05, 0.15, 0.05] }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 0 }}
          >
            <div style={{ width: '120px', height: '120px', border: '2px solid var(--accent-gold)', borderRadius: '30px' }}></div>
            <div style={{ width: '120px', height: '120px', border: '2px dashed var(--accent-orange)', borderRadius: '30px', position: 'absolute', top: '20px', left: '20px' }}></div>
          </motion.div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="section-header-left" style={{ marginBottom: '3rem' }}>
                <div className="icon-box-magenta"><GraduationCap size={24} /></div>
                <div>
                  <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Education & <span className="text-gradient-gold">Milestones.</span></h2>
                  <p className="section-subtitle">Academic foundations and qualifications.</p>
                </div>
              </motion.div>
              
              <div className="education-grid">
                {education.sort((a, b) => a.order - b.order).map((edu, idx) => (
                  <motion.div key={edu.id || idx} variants={fadeInUp} className="education-card">
                    <div className="education-crest-icon">
                      <GraduationCap size={28} />
                    </div>
                    <h3 className="edu-degree" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{edu.degree}</h3>
                    <p className="edu-inst" style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.25rem' }}>{edu.institution}</p>
                    <div className="edu-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span className="edu-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} color="var(--accent-orange)"/> {edu.location}</span>
                      <span className="edu-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗓️ {edu.startYear} — {edu.endYear}</span>
                    </div>
                    <div className="edu-scores" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {edu.cgpa && <span className="score-badge-gold"><Sparkles size={12} /> CGPA: {edu.cgpa}</span>}
                      {edu.percentage && <span className="score-badge-gold"><Sparkles size={12} /> Score: {edu.percentage}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Floating WhatsApp CTA */}
      <AnimatePresence>
        {whatsapp?.isActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openWhatsApp('Hi Vasundhara! I saw your portfolio and would like to connect.')}
            className="btn-floating-wa"
            aria-label="Contact on WhatsApp"
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', background: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(37,211,102,0.4)', zIndex: 100, cursor: 'pointer' }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
