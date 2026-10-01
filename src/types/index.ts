export interface Profile {
  name: string;
  location: string;
  email: string;
  phone: string;
  careerObjective: string;
  heroText?: string;
  aboutText?: string;
  resumeUrl?: string;
  profileImageUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  cgpa?: string;
  percentage?: string;
  description?: string;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  imageUrl?: string;
  credentialUrl?: string;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  applications?: string[];
  images?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
}

export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage: string;
  isActive: boolean;
  templates: { id: string; title: string; text: string }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string; 
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  education: Education[];
  certifications: Certification[];
  experience: Experience[];
  projects: Project[];
  whatsapp: WhatsAppConfig;
}
