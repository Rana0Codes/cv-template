/**
 * Realistic Fictional Demo Profiles and Empty State Data Model for CV Template.
 * Clean, simplified data model with zero phantom or redundant fields.
 */

export const EMPTY_CV = {
  selectedTemplate: 'template-1',
  themeColor: '#0f766e',
  fontFamily: 'sans',
  basics: {
    fullName: '',
    headline: '',
    photoUrl: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  skills: [],
  languages: [],
  experience: [],
  education: [],
  biodata: {
    fatherName: '',
    dob: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    address: ''
  },
  declaration: {
    enabled: false,
    text: 'I hereby declare that the particulars provided above are authentic and true to the best of my knowledge and belief.',
    place: '',
    date: new Date().toISOString().split('T')[0],
    signatureName: ''
  }
};

export const DEMO_TECH = {
  selectedTemplate: 'template-1',
  themeColor: '#0f766e',
  fontFamily: 'sans',
  basics: {
    fullName: 'Alexander Wright',
    headline: 'Lead Cloud Architect & AI Solutions Engineer',
    photoUrl: 'assets/samples/demo_avatar_tech.jpg',
    email: 'alexander.wright.demo@example.com',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA (Open to Remote)',
    website: 'https://alexwright.dev.demo',
    linkedin: 'linkedin.com/in/alexander-wright-demo',
    github: 'github.com/alexwright-cloud'
  },
  summary: 'Distinguished Cloud Architect with 8+ years of experience designing fault-tolerant distributed systems, large-scale Kubernetes platforms, and production LLM integration pipelines. Proven track record reducing cloud infrastructure costs by 38% while scaling microservices to 45M+ monthly active requests.',
  skills: [
    {
      id: 's1',
      category: 'Cloud & DevOps',
      items: [
        'AWS (EKS, Lambda, S3, RDS)',
        'Kubernetes & Helm',
        'Terraform & IaC',
        'Docker & CI/CD Pipelines'
      ]
    },
    {
      id: 's2',
      category: 'Software & Backend Systems',
      items: [
        'Python, Go, TypeScript',
        'LLM Prompt Tuning & RAG',
        'FastAPI & Microservices',
        'PostgreSQL & Redis'
      ]
    },
    {
      id: 's3',
      category: 'Architecture & Security',
      items: [
        'Zero-Trust Security',
        'High-Availability Architecture',
        'Observability (Datadog, Prometheus)',
        'Agile Leadership'
      ]
    }
  ],
  languages: [
    { id: 'l1', name: 'English', level: 'Native' },
    { id: 'l2', name: 'German', level: 'Professional Working' },
    { id: 'l3', name: 'Spanish', level: 'Conversational' }
  ],
  experience: [
    {
      id: 'e1',
      title: 'Principal Cloud Systems Architect',
      company: 'Apex Cloud Technologies',
      period: '2022 - Present',
      bullets: [
        'Architected multi-region Kubernetes platform handling 45M daily API requests with 99.995% uptime SLA.',
        'Spearheaded enterprise infrastructure-as-code migration using Terraform, cutting cloud spend by $420K annually.',
        'Mentored 14 senior engineers across DevOps and backend distributed systems guilds.'
      ]
    },
    {
      id: 'e2',
      title: 'Senior Backend Engineer & Team Lead',
      company: 'Nexus Data Platforms',
      period: '2019 - 2022',
      bullets: [
        'Designed real-time event ingestion pipelines processing 12TB daily telemetry with Apache Kafka and Go.',
        'Reduced p99 query latency from 320ms to 45ms by re-architecting Redis caching layers.'
      ]
    }
  ],
  education: [
    {
      id: 'ed1',
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University, Stanford, CA',
      year: '2019',
      score: '3.92 GPA'
    },
    {
      id: 'ed2',
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'University of Washington, Seattle, WA',
      year: '2017',
      score: 'Summa Cum Laude (3.96 GPA)'
    }
  ],
  biodata: {
    fatherName: '',
    dob: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    address: ''
  },
  declaration: {
    enabled: false,
    text: '',
    place: '',
    date: '',
    signatureName: ''
  }
};

export const DEMO_EXECUTIVE = {
  selectedTemplate: 'template-2',
  themeColor: '#0f766e',
  fontFamily: 'sans',
  basics: {
    fullName: 'Elena Vance',
    headline: 'Director of Business Operations & Strategy',
    photoUrl: 'assets/samples/demo_avatar_executive.jpg',
    email: 'elena.vance.demo@example.com',
    phone: '+1 (555) 876-4321',
    location: 'Chicago, IL (Open to Relocation)',
    website: 'https://elenavance.biz.demo',
    linkedin: 'linkedin.com/in/elena-vance-demo',
    github: ''
  },
  summary: 'Results-driven Business Operations Director with 10+ years of executive experience driving operational excellence, cross-functional organizational alignment, and multi-million dollar program delivery. Adept at scaling corporate workflows, modernizing legacy reporting pipelines, and managing high-performance teams.',
  skills: [
    {
      id: 's1',
      category: 'Operations & Strategy',
      items: [
        'Strategic Planning & OKRs',
        'Cross-Functional Leadership',
        'P&L & Budget Management ($25M+)',
        'Workflow Optimization & Six Sigma',
        'Enterprise Risk Governance'
      ]
    },
    {
      id: 's2',
      category: 'Analytics & Systems',
      items: [
        'Tableau & Power BI Dashboards',
        'Salesforce & NetSuite ERP',
        'Financial Modeling & Projections',
        'Data-Driven Decision Making'
      ]
    }
  ],
  languages: [
    { id: 'l1', name: 'English', level: 'Native' },
    { id: 'l2', name: 'French', level: 'Fluent' },
    { id: 'l3', name: 'Mandarin', level: 'Conversational' }
  ],
  experience: [
    {
      id: 'e1',
      title: 'Director of Global Business Operations',
      company: 'Sterling Global Solutions',
      period: '2021 - Present',
      bullets: [
        'Spearheaded global operations strategy across 4 regional hubs, enhancing cross-departmental delivery velocity by 34%.',
        'Oversaw annual operating budget of $28M, successfully achieving a 14% bottom-line margin expansion.',
        'Implemented enterprise-wide ERP modernization unifying finance, customer success, and procurement data.'
      ]
    },
    {
      id: 'e2',
      title: 'Senior Manager, Operational Strategy',
      company: 'Crestview Consulting Group',
      period: '2017 - 2021',
      bullets: [
        'Delivered 12 enterprise transformation engagements for Fortune 500 financial institutions.',
        'Designed post-merger integration playbook adopted across 3 global acquisitions totaling $850M in enterprise value.'
      ]
    }
  ],
  education: [
    {
      id: 'ed1',
      degree: 'Master of Business Administration (MBA)',
      institution: 'Northwestern University, Kellogg School of Management',
      year: '2017',
      score: "Dean's Honor List"
    },
    {
      id: 'ed2',
      degree: 'Bachelor of Arts in Economics & Public Policy',
      institution: 'University of Chicago, Chicago, IL',
      year: '2013',
      score: '3.89 GPA'
    }
  ],
  biodata: {
    fatherName: 'Marcus Vance',
    dob: '1989-11-23',
    nationality: 'American',
    gender: 'Female',
    maritalStatus: 'Married',
    address: '450 North Michigan Avenue, Tower 12, Chicago, IL 60611'
  },
  declaration: {
    enabled: true,
    text: 'I hereby declare and affirm that the details and qualifications presented herein are true and accurate in every respect.',
    place: 'Chicago, IL',
    date: '2026-09-13',
    signatureName: 'ELENA VANCE'
  }
};
