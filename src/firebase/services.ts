import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from './config';
import type { PortfolioData, ContactSubmission } from '../types';

export const defaultData: PortfolioData = {
  profile: {
    name: "Darisi Vasundhara",
    location: "Kakinada, India",
    email: "darisivasundhara1@gmail.com",
    phone: "+91 7729805155",
    careerObjective: "I am a motivated software developer with a strong foundation in Web Development, Python, and Database Systems. My goal is to build impactful, scalable applications and solve complex problems through clean and efficient code.",
    heroText: "Software Engineer",
    profileImageUrl: "/portrait.jpg",
    resumeUrl: "/resume.pdf"
  },
  skills: [
    { id: '1', name: 'C', category: 'Programming', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
    { id: '2', name: 'Java', category: 'Programming', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
    { id: '3', name: 'Python', category: 'Programming', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
    { id: '4', name: 'HTML5', category: 'Web', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
    { id: '5', name: 'CSS3', category: 'Web', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
    { id: '6', name: 'JavaScript', category: 'Web', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
    { id: '7', name: 'SQL', category: 'Database', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
  ],
  education: [
    {
      id: '1',
      degree: 'B.Sc. Computer Science',
      institution: 'Aditya Degree College',
      location: 'Kakinada',
      startYear: '2020',
      endYear: '2023',
      cgpa: '8.5',
      order: 1
    },
    {
      id: '2',
      degree: 'Class XII',
      institution: 'Narayana Junior College',
      location: 'Kakinada',
      startYear: '2020',
      endYear: '2022',
      percentage: '89.6%',
      order: 2
    }
  ],
  certifications: [
    { id: '1', name: 'Cloud Computing', issuer: 'NPTEL', order: 1 },
    { id: '2', name: 'Python Essentials 1 & 2', issuer: 'Cisco Networking Academy', order: 2 },
    { id: '3', name: 'Data Analytics', issuer: 'IBM', order: 3 },
  ],
  experience: [
    {
      id: '1',
      role: 'MERN Stack Intern',
      company: 'ADHOC Network Company',
      startDate: '2023',
      endDate: '2023',
      description: 'Developed and maintained full-stack web applications using MongoDB, Express, React, and Node.js. Collaborated with a team to build scalable and efficient solutions.',
      order: 1
    },
    {
      id: '2',
      role: 'Data Analytics Intern',
      company: 'Python Analytics Program',
      startDate: '2022',
      endDate: '2022',
      description: 'Analyzed complex datasets using Python. Created visualizations and generated insights to drive data-informed decisions.',
      order: 2
    }
  ],
  projects: [
    {
      id: '1',
      title: 'Automatic Door Opening System',
      description: 'Engineered a smart, touchless door automation system using Infrared (IR) sensors and Python. The system detects human presence in real-time to trigger mechanical door actuation, optimizing accessibility and hygiene in high-traffic environments.',
      technologies: ['Python', 'IR Sensor', 'Hardware Interfacing'],
      applications: ['Malls', 'Hospitals'],
      images: ['/auto-door-project.jpg'],
      featured: true,
      order: 1
    }
  ],
  whatsapp: {
    phoneNumber: "917729805155",
    defaultMessage: "Hi Vasundhara, I viewed your portfolio and would like to connect.",
    isActive: true,
    templates: [
      { id: '1', title: 'Job Opportunity', text: 'Hi Vasundhara, we have a job opportunity that matches your profile.' },
      { id: '2', title: 'Project Inquiry', text: 'Hi, I would like to discuss a potential project with you.' }
    ]
  }
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const docRef = doc(db, 'portfolio', 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const remoteData = docSnap.data() as Partial<PortfolioData>;
      return {
        ...defaultData,
        ...remoteData,
        whatsapp: {
          ...defaultData.whatsapp,
          ...(remoteData.whatsapp || {})
        }
      } as PortfolioData;
    } else {
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return defaultData; 
  }
};

export const savePortfolioData = async (data: PortfolioData): Promise<void> => {
  try {
    const docRef = doc(db, 'portfolio', 'main');
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    throw error;
  }
};

export const getSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

export const addSubmission = async (submission: Omit<ContactSubmission, 'id'>): Promise<void> => {
  try {
    await addDoc(collection(db, 'submissions'), submission);
  } catch (error) {
    console.error("Error adding submission:", error);
    throw error;
  }
};

export const updateSubmissionStatus = async (id: string, status: ContactSubmission['status']): Promise<void> => {
  try {
    const docRef = doc(db, 'submissions', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating submission:", error);
    throw error;
  }
};
