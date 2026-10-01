import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'framer-motion';
import { getPortfolioData, addSubmission } from '../firebase/services';
import type { PortfolioData } from '../types';
import { MapPin, Mail, ExternalLink, Code2, Briefcase, GraduationCap, Sparkles, Rocket, GitBranch, MessageCircle, Send, FileText, ArrowRight } from 'lucide-react';
import profileImage from '../assets/profile.jpg';

export const Home = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Vertical Parallax
  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yHeroImg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -200]);

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
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || data?.whatsapp?.defaultMessage || 'Hi Vasundhara! I saw your portfolio and would like to connect.')}`;
    window.open(url, '_blank');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setFormStatus('submitting');
    try {
      await addSubmission({
        ...form,
        status: 'new',
        createdAt: new Date().toISOString()
      });
      setFormStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      setFormStatus('error');
    }
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
      
      {/* 1. HERO - Professional & Premium */}
      <section id="home" className="hero-section">
        <div className="hero-bg-professional">
          <div className="hero-grid-lines"></div>
          <div className="hero-glow-warm"></div>
          {/* Intense fantasy glow */}
          <div className="fantasy-super-glow"></div>
          
          {/* Funny transparent templates */}
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
              <span>Software Developer</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="hero-title">
              Hi, I'm <br/>
              <span className="text-gradient-gold">{profile?.name || 'Darisi Vasundhara'}</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="hero-description">
              {profile?.careerObjective || 'A passionate software developer focused on building robust applications and elegant digital experiences. Expertise in Python, modern web technologies, and data-driven solutions.'}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="hero-skills-mini">
              <span>Python</span>
              <span className="dot-separator"></span>
              <span>Web Development</span>
              <span className="dot-separator"></span>
              <span>Data Analytics</span>
            </motion.div>

            <motion.div variants={fadeInUp} className="hero-actions">
              <a href="#project" className="btn-primary">
                View Projects <ArrowRight size={18} />
              </a>
              <button onClick={() => openWhatsApp()} className="btn-secondary">
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
                <span>Kakinada, India</span>
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

      {/* 2. ABOUT ME - Editorial/Personal */}
      <section id="about" className="about-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="about-bg-pattern"></div>

        {/* Fantasy Classic Background: Floating Double Rings */}
        <motion.div 
          animate={{ y: [0, -30, 0], opacity: [0.05, 0.15, 0.05], rotate: [0, 180, 360] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '10%', right: '5%', zIndex: 0 }}
        >
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '1px solid var(--accent-gold)' }}></div>
          <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '1px dashed var(--accent-orange)', position: 'absolute', top: '-10px', left: '-10px' }}></div>
        </motion.div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer} className="about-grid">
            <motion.div variants={fadeInUp} className="about-text-area">
              <h2 className="section-title">About <span className="text-gradient-orange">Me.</span></h2>
              <div className="title-underline"></div>
              <p className="body-large">
                I am a passionate developer with a strong focus on building scalable web applications and efficient backend systems. With a solid foundation in computer science and practical experience in modern technologies, I bridge the gap between complex logic and seamless user experiences.
                <br/><br/>
                My approach treats software engineering not just as programming, but as a craft—where performance, aesthetics, and clean architecture converge.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="about-info-cards">
              <div className="info-card">
                <div className="info-icon cyan-icon"><MapPin size={20} /></div>
                <div>
                  <h3 className="info-label">Location</h3>
                  <p className="info-value">{profile?.location || 'India'}</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon magenta-icon"><Mail size={20} /></div>
                <div>
                  <h3 className="info-label">Email</h3>
                  <a href={`mailto:${profile?.email}`} className="info-value link-hover">{profile?.email || 'email@example.com'}</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. SKILLS - Interactive Sliding */}
      {skills && skills.length > 0 && (
        <section id="skills" className="skills-section" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* Dynamic Background Elements */}
          <motion.div 
            animate={{ y: [0, 50, 0], rotate: [0, 90, 0] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.15, zIndex: 0 }}
          >
            <div style={{ width: '40px', height: '40px', border: '2px solid var(--accent-gold)', borderRadius: '10px', transform: 'rotate(45deg)' }}></div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -40, 0], x: [0, 30, 0], rotate: [0, -180, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', bottom: '20%', right: '15%', opacity: 0.2, zIndex: 0 }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--accent-orange)' }}></div>
          </motion.div>

          <motion.div 
            animate={{ x: [0, -50, 0], rotate: [0, 360, 0] }} 
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: '50%', right: '5%', opacity: 0.15, zIndex: 0 }}
          >
            <Sparkles size={40} color="var(--accent-gold)" />
          </motion.div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp} className="section-header-center">
              <h2 className="section-title">Technical <span className="text-gradient-ethereal">Skills.</span></h2>
              <p className="section-subtitle">Technologies I work with to bring ideas to life.</p>
            </motion.div>
          </div>
          
          <div className="skills-grid-container">
            <div className="skills-grid">
              {skills.map((skill, idx) => {
                let resolvedIcon = skill.iconUrl;
                if (!resolvedIcon) {
                  const n = skill.name.toLowerCase();
                  if (n.includes('react')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg';
                  else if (n.includes('python')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg';
                  else if (n.includes('java') && !n.includes('javascript')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg';
                  else if (n.includes('javascript') || n === 'js') resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg';
                  else if (n.includes('html')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg';
                  else if (n.includes('css')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg';
                  else if (n.includes('sql') || n.includes('database')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg';
                  else if (n.includes('c++') || n === 'cpp') resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg';
                  else if (n.includes('c ') || n === 'c' || n === 'c programming') resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg';
                  else if (n.includes('node')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg';
                  else if (n.includes('git')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg';
                  else if (n.includes('typescript') || n === 'ts') resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg';
                  else if (n.includes('mongo')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg';
                  else if (n.includes('php')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg';
                  else if (n.includes('aws')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg';
                  else if (n.includes('docker')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg';
                  else if (n.includes('figma')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg';
                  else if (n.includes('linux')) resolvedIcon = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg';
                }
                
                return (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  key={skill.id || idx} 
                  className="skill-card-vertical"
                  style={{ y: yBg }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 4 + (idx % 3), 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    delay: idx * 0.1 
                  }}
                  whileHover={{ y: -15, scale: 1.05 }}
                >
                  <div className="skill-icon-wrap">
                    {resolvedIcon ? (
                      <img src={resolvedIcon} alt={skill.name} style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px var(--shadow-strong))' }} />
                    ) : (
                      <Code2 size={24} className={idx % 2 === 0 ? "text-gradient-gold" : "text-gradient-orange"} />
                    )}
                  </div>
                  <h3 className="skill-title">{skill.name}</h3>
                  <span className="skill-cat">{skill.category}</span>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. PROJECTS - Showcase Gallery */}
      {projects && projects.length > 0 && (
        <section id="project" className="projects-section">
          
          {/* Dynamic Background to fill empty space */}
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }}
          />
          <motion.div 
            animate={{ y: [0, 40, 0], x: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ position: 'absolute', bottom: '10%', left: '0%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-orange) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}
          />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp} className="section-header-center">
              <h2 className="section-title">Selected <span className="text-gradient-orange">Projects.</span></h2>
            </motion.div>
            
            <div className="projects-gallery">
              {projects.sort((a, b) => a.order - b.order).map((project, index) => (
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeInUp}
                  key={project.id || index} 
                >
                  <motion.div
                    className={`project-showcase-card ${index % 2 !== 0 ? 'reverse-layout' : ''}`}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="project-visual">
                    {((project.images && project.images.length > 0) || project.title?.includes('Door')) ? (
                      <img src={(project.images && project.images.length > 0) ? project.images[0] : '/auto-door-project.jpg'} alt={project.title} className="project-img" loading="lazy" />
                    ) : (
                      <div className="project-placeholder">
                        <Code2 size={48} className="text-gradient-gold opacity-50" />
                      </div>
                    )}
                    <div className="project-visual-overlay"></div>
                  </div>
                  
                  <div className="project-content">
                    {project.featured && (
                      <span className="badge-featured"><Rocket size={12} /> Featured</span>
                    )}
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="tech-tags">
                        {project.technologies.map(tech => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}

                    <div className="project-links">
                      {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="link-primary">
                          <ExternalLink size={16} /> View Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="link-secondary">
                          <GitBranch size={16} /> Source Code
                        </a>
                      )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. EXPERIENCE - Timeline */}
      {experience && experience.length > 0 && (
        <section id="journey" className="experience-section" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* Fantasy Background: Floating Sparkles */}
          <motion.div 
            animate={{ y: [0, -50, 0], x: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '30%', left: '5%', zIndex: 0 }}
          >
            <Sparkles size={60} color="var(--accent-orange)" />
          </motion.div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer} className="timeline-container">
              <motion.div variants={fadeInUp} className="section-header-left">
                <div className="icon-box-violet"><Briefcase size={24} /></div>
                <h2 className="section-title">Professional Experience</h2>
              </motion.div>
              
              <div className="timeline">
                <div className="timeline-track"></div>
                {experience.sort((a, b) => a.order - b.order).map((exp, idx) => (
                  <motion.div key={exp.id || idx} variants={fadeInUp} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div>
                          <h3 className="timeline-role">{exp.role}</h3>
                          <p className="timeline-company text-gradient-ethereal">{exp.company}</p>
                        </div>
                        {exp.startDate && exp.endDate && (
                          <span className="timeline-date">{exp.startDate} — {exp.endDate}</span>
                        )}
                      </div>
                      {exp.description && <p className="timeline-desc">{exp.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 6. EDUCATION - Elegant Resume Cards */}
      {education && education.length > 0 && (
        <section id="education" className="education-section" style={{ position: 'relative', overflow: 'hidden' }}>
          
          {/* Classic Background: Rotating Diamonds */}
          <motion.div 
            animate={{ rotate: [0, 180, 360], opacity: [0.05, 0.15, 0.05] }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 0 }}
          >
            <div style={{ width: '100px', height: '100px', border: '2px solid var(--accent-gold)' }}></div>
            <div style={{ width: '100px', height: '100px', border: '2px dashed var(--accent-orange)', position: 'absolute', top: '20px', left: '20px' }}></div>
          </motion.div>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="section-header-left">
                <div className="icon-box-magenta"><GraduationCap size={24} /></div>
                <h2 className="section-title">Education</h2>
              </motion.div>
              
              <div className="education-grid">
                {education.sort((a, b) => a.order - b.order).map((edu, idx) => (
                  <motion.div key={edu.id || idx} variants={fadeInUp} className="education-card">
                    <h3 className="edu-degree">{edu.degree}</h3>
                    <p className="edu-inst">{edu.institution}</p>
                    <div className="edu-meta">
                      <span className="edu-meta-item"><MapPin size={14}/> {edu.location}</span>
                      <span className="edu-meta-item">{edu.startYear} — {edu.endYear}</span>
                    </div>
                    <div className="edu-scores">
                      {edu.cgpa && <span className="score-badge">CGPA <strong className="text-gradient-orange">{edu.cgpa}</strong></span>}
                      {edu.percentage && <span className="score-badge">Score <strong className="text-gradient-orange">{edu.percentage}</strong></span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 7. CONTACT - Strong Final CTA */}
      <section id="contact" className="contact-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="contact-bg-effect"></div>
        
        {/* Fantasy Background: Ambient Glowing Orb */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={staggerContainer} className="contact-layout">
            
            <motion.div variants={fadeInUp} className="contact-cta">
              <h2 className="cta-title">Let's create <br/><span className="text-gradient-ethereal">something amazing.</span></h2>
              <p className="cta-desc">
                I am currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="cta-buttons">
                <button onClick={() => openWhatsApp()} className="btn-whatsapp-large">
                  <MessageCircle size={22} /> Chat on WhatsApp
                </button>
                {profile?.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-large">
                    <FileText size={20} /> View Resume
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="contact-form-container">
              <h3 className="form-title">Send an Email</h3>
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="input-group">
                  <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <label>Your Name</label>
                </div>
                <div className="input-group">
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <label>Email Address</label>
                </div>
                <div className="input-group">
                  <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <label>Phone Number</label>
                </div>
                <div className="input-group">
                  <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                  <label>Message</label>
                </div>
                <button type="submit" disabled={formStatus === 'submitting'} className="btn-submit">
                  {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <AnimatePresence>
        {whatsapp?.isActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openWhatsApp()}
            className="btn-floating-wa"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
