import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getPortfolioData, savePortfolioData, getSubmissions, updateSubmissionStatus } from '../firebase/services';
import type { PortfolioData, ContactSubmission } from '../types';
import { LogOut, Save, Loader2, Check, MessageCircle, Users, Settings, Trash2, Plus, User, Code2, GraduationCap, Briefcase, Rocket, Sparkles } from 'lucide-react';
import { ProfileEditor } from '../components/admin/ProfileEditor';
import { ArrayEditor } from '../components/admin/ArrayEditor';
import type { FieldConfig } from '../components/admin/ArrayEditor';

const skillsFields: FieldConfig[] = [
  { key: 'name', label: 'Skill Name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'iconUrl', label: 'Icon URL', type: 'text' }
];

const educationFields: FieldConfig[] = [
  { key: 'degree', label: 'Degree', type: 'text' },
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'startYear', label: 'Start Year', type: 'text' },
  { key: 'endYear', label: 'End Year', type: 'text' },
  { key: 'cgpa', label: 'CGPA', type: 'text' },
  { key: 'percentage', label: 'Percentage', type: 'text' }
];

const experienceFields: FieldConfig[] = [
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'company', label: 'Company', type: 'text' },
  { key: 'startDate', label: 'Start Date', type: 'text' },
  { key: 'endDate', label: 'End Date', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const projectsFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'technologies', label: 'Technologies', type: 'array' },
  { key: 'applications', label: 'Applications', type: 'array' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { key: 'projectUrl', label: 'Live URL', type: 'text' },
  { key: 'featured', label: 'Featured Project', type: 'boolean' }
];

const certificationsFields: FieldConfig[] = [
  { key: 'name', label: 'Certification Name', type: 'text' },
  { key: 'issuer', label: 'Issuer', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
];

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        const fetchedData = await getPortfolioData();
        setData(fetchedData);
        
        const fetchedSubmissions = await getSubmissions();
        setSubmissions(fetchedSubmissions);
        
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      await savePortfolioData(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ContactSubmission['status']) => {
    try {
      await updateSubmissionStatus(id, newStatus);
      setSubmissions(submissions.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const handleAddTemplate = () => {
    if (!data) return;
    const newTemplate = { id: Date.now().toString(), title: 'New Template', text: '' };
    setData({
      ...data,
      whatsapp: {
        ...data.whatsapp,
        templates: [...data.whatsapp.templates, newTemplate]
      }
    });
  };

  const handleUpdateTemplate = (id: string, field: 'title' | 'text', value: string) => {
    if (!data) return;
    setData({
      ...data,
      whatsapp: {
        ...data.whatsapp,
        templates: data.whatsapp.templates.map(t => t.id === id ? { ...t, [field]: value } : t)
      }
    });
  };

  const handleRemoveTemplate = (id: string) => {
    if (!data) return;
    setData({
      ...data,
      whatsapp: {
        ...data.whatsapp,
        templates: data.whatsapp.templates.filter(t => t.id !== id)
      }
    });
  };

  const openWhatsApp = (phone: string, text: string = '') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <Loader2 size={32} className="spin" style={{ margin: '0 auto', color: 'var(--accent-cyan)' }} />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'skills', icon: <Code2 size={18} />, label: 'Skills' },
    { id: 'experience', icon: <Briefcase size={18} />, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={18} />, label: 'Education' },
    { id: 'projects', icon: <Rocket size={18} />, label: 'Projects' },
    { id: 'certifications', icon: <Sparkles size={18} />, label: 'Certifications' },
    { id: 'submissions', icon: <Users size={18} />, label: 'Leads / Messages' },
    { id: 'whatsapp', icon: <Settings size={18} />, label: 'WhatsApp Config' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Portfolio Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-ethereal"
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            {saving ? <Loader2 size={18} className="spin mr-2 inline" /> : (saved ? <Check size={18} className="mr-2 inline" /> : <Save size={18} className="mr-2 inline" />)}
            {saving ? 'Saving...' : (saved ? 'Saved!' : 'Publish Changes')}
          </button>
          <button 
            onClick={handleLogout}
            className="btn-outline"
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
          >
            <LogOut size={18} className="mr-2 inline" />
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ 
          width: '240px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-smooth)',
          border: '1px solid var(--glass-border)',
          flexShrink: 0
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: activeTab === tab.id ? 'rgba(212, 106, 42, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(240, 187, 98, 0.3)' : '1px solid transparent',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: '1 1 500px', 
          backgroundColor: 'var(--bg-surface)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-smooth)', 
          border: '1px solid var(--glass-border)' 
        }}>
          {activeTab === 'profile' && <ProfileEditor profile={data.profile} onChange={(profile) => setData({ ...data, profile })} />}
          {activeTab === 'skills' && <ArrayEditor items={data.skills} title="Skills" fields={skillsFields} onChange={(skills) => setData({ ...data, skills })} />}
          {activeTab === 'education' && <ArrayEditor items={data.education} title="Education" fields={educationFields} onChange={(education) => setData({ ...data, education })} />}
          {activeTab === 'experience' && <ArrayEditor items={data.experience} title="Experience" fields={experienceFields} onChange={(experience) => setData({ ...data, experience })} />}
          {activeTab === 'projects' && <ArrayEditor items={data.projects} title="Projects" fields={projectsFields} onChange={(projects) => setData({ ...data, projects })} />}
          {activeTab === 'certifications' && <ArrayEditor items={data.certifications} title="Certifications" fields={certificationsFields} onChange={(certifications) => setData({ ...data, certifications })} />}
          
          {activeTab === 'submissions' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Leads / Messages</h2>
              
              {submissions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No submissions found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {submissions.map(sub => (
                    <div key={sub.id} style={{ 
                      padding: '1.5rem', 
                      backgroundColor: 'rgba(0,0,0,0.2)', 
                      borderRadius: 'var(--radius-smooth)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', flexDirection: 'column', gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{sub.name}</h3>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{sub.email} • {sub.phone}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(sub.createdAt).toLocaleString()}</p>
                        </div>
                        <select 
                          value={sub.status}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value as any)}
                          style={{ 
                            padding: '0.5rem', backgroundColor: 'var(--bg-deep)', 
                            color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '0.5rem' 
                          }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-deep)', borderRadius: '0.5rem', fontSize: '0.95rem' }}>
                        {sub.message}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button 
                          onClick={() => openWhatsApp(sub.phone, `Hi ${sub.name}, this is Vasundhara. Thanks for reaching out through my portfolio.`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                            backgroundColor: '#25D366', color: '#fff', borderRadius: 'var(--radius-pill)', fontWeight: 500, fontSize: '0.9rem'
                          }}
                        >
                          <MessageCircle size={16} /> WhatsApp Direct
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>WhatsApp Configuration</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>WhatsApp Number (e.g., +917729805155)</label>
                  <input 
                    type="text" 
                    value={data.whatsapp.phoneNumber}
                    onChange={(e) => setData({ ...data, whatsapp: { ...data.whatsapp, phoneNumber: e.target.value } })}
                    style={{ 
                      width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff',
                      border: '1px solid var(--glass-border)', borderRadius: '0.5rem' 
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Default Pre-filled Message</label>
                  <textarea 
                    value={data.whatsapp.defaultMessage}
                    onChange={(e) => setData({ ...data, whatsapp: { ...data.whatsapp, defaultMessage: e.target.value } })}
                    rows={3}
                    style={{ 
                      width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff',
                      border: '1px solid var(--glass-border)', borderRadius: '0.5rem', resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="checkbox" id="wa-active"
                    checked={data.whatsapp.isActive}
                    onChange={(e) => setData({ ...data, whatsapp: { ...data.whatsapp, isActive: e.target.checked } })}
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-cyan)' }}
                  />
                  <label htmlFor="wa-active" style={{ color: 'var(--text-primary)' }}>Enable WhatsApp Floating Button</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Message Templates</h3>
                <button 
                  onClick={handleAddTemplate}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}
                >
                  <Plus size={16} /> Add Template
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.whatsapp.templates.map(template => (
                  <div key={template.id} style={{ 
                    padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <input 
                        type="text" value={template.title}
                        onChange={(e) => handleUpdateTemplate(template.id, 'title', e.target.value)}
                        placeholder="Template Title"
                        style={{ 
                          width: 'calc(100% - 40px)', padding: '0.5rem', backgroundColor: 'transparent', color: '#fff',
                          border: 'none', borderBottom: '1px solid var(--glass-border)', fontSize: '1.1rem', fontWeight: 500
                        }}
                      />
                      <button onClick={() => handleRemoveTemplate(template.id)} style={{ color: '#ef4444' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <textarea 
                      value={template.text}
                      onChange={(e) => handleUpdateTemplate(template.id, 'text', e.target.value)}
                      placeholder="Message text..." rows={2}
                      style={{ 
                        width: '100%', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff',
                        border: '1px solid transparent', borderRadius: '0.25rem', resize: 'vertical'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
