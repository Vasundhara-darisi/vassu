import { useState } from 'react';
import type { Profile } from '../../types';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { Loader2 } from 'lucide-react';

interface ProfileEditorProps {
  profile: Profile | null;
  onChange: (profile: Profile) => void;
}

export const ProfileEditor = ({ profile, onChange }: ProfileEditorProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleChange = (field: keyof Profile, value: string) => {
    onChange({ ...(profile as Profile), [field]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      handleChange('profileImageUrl', url);
    } catch (error) {
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingResume(true);
    try {
      const url = await uploadToCloudinary(e.target.files[0]);
      handleChange('resumeUrl', url);
    } catch (error) {
      alert('Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.875rem'
  };

  if (!profile) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>Profile Information</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
          <input type="text" value={profile.name} onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hero Text / Title</label>
          <input type="text" value={profile.heroText || ''} onChange={e => handleChange('heroText', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
          <input type="email" value={profile.email} onChange={e => handleChange('email', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone</label>
          <input type="text" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
          <input type="text" value={profile.location} onChange={e => handleChange('location', e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Career Objective / About</label>
        <textarea 
          value={profile.careerObjective} 
          onChange={e => handleChange('careerObjective', e.target.value)} 
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Profile Image URL</label>
          <input type="text" value={profile.profileImageUrl || ''} onChange={e => handleChange('profileImageUrl', e.target.value)} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{
              padding: '0.5rem 1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {uploadingImage ? <Loader2 className="spin" size={16} /> : 'Upload Image'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
            {profile.profileImageUrl && (
              <img src={profile.profileImageUrl} alt="Profile Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            )}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Resume URL (PDF/Doc)</label>
          <input type="text" value={profile.resumeUrl || ''} onChange={e => handleChange('resumeUrl', e.target.value)} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{
              padding: '0.5rem 1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {uploadingResume ? <Loader2 className="spin" size={16} /> : 'Upload Resume'}
              <input type="file" style={{ display: 'none' }} onChange={handleResumeUpload} disabled={uploadingResume} />
            </label>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem' }}>View Resume</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
