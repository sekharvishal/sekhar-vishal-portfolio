import type {
  Achievement,
  Credential,
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
  Stat,
} from './types'

/**
 * All portfolio copy lives here. Facts come from the information supplied by Sekhar.
 * Nothing in this file invents metrics, awards or certificate IDs.
 * Search for `TODO` and `verified: false` to find items that still need confirmation.
 */

export const profile: Profile = {
  name: 'Sekhar Vishal',
  role: 'Full Stack Java Developer',
  stackLine: 'Java · Spring Boot · Angular · Cloud · AI',
  headline: 'Building software that solves real problems.',
  subheadline:
    'Full Stack Java Developer focused on backend engineering, full-stack applications, cloud technologies and AI.',
  summary: [
    'I am a Full Stack Java Developer with professional experience building and enhancing enterprise applications at SecureW2. My technical expertise includes Java, Spring Boot, Angular, Apache Wicket, REST APIs, MySQL, MongoDB and RabbitMQ, along with exposure to AWS Lambda, Amazon Kinesis and AI-powered application development.',
    'I enjoy solving real-world engineering problems, understanding complex application workflows, improving backend and frontend integration, debugging production issues and writing maintainable code. My experience also includes application security, vulnerability mitigation, testing, code reviews and Agile development practices.',
    'Alongside my professional work, I have built academic and full-stack projects, completed industry-oriented internships and technical learning programs, and continue exploring cloud computing, generative AI and modern software engineering practices.',
    'My goal is to build reliable, secure and scalable software that solves meaningful problems.',
  ],
  // TODO: replace with the real address / profile URLs before publishing.
  email: 'sekhar@example.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/TODO-your-handle' },
    { label: 'GitHub', href: 'https://github.com/TODO-your-handle' },
  ],
  resumeHref: '/resume.pdf',
}

export const experience: ExperienceItem[] = [
  {
    role: 'Full Stack Java Developer',
    org: 'SecureW2',
    period: 'Professional experience · approx. 1 year',
    type: 'employment',
    bullets: [
      'Contribute to enterprise application development and feature enhancements.',
      'Work across Java, Spring Boot, Angular, Apache Wicket and REST API integrations.',
      'Work with relational and NoSQL databases, including MySQL and MongoDB.',
      'Work with asynchronous and event-driven technologies such as RabbitMQ, AWS Lambda and Amazon Kinesis.',
      'Debug application issues and investigate frontend-to-backend data flow.',
      'Contribute to vulnerability mitigation, secure coding, deployments and production support.',
      'Participate in code reviews and Agile development workflows.',
    ],
  },
  {
    role: 'Software Development Intern',
    org: 'SecureW2',
    period: '6-month internship',
    type: 'internship',
    bullets: [
      'Gained hands-on experience with enterprise software development.',
      'Built familiarity with a production codebase and its application workflows.',
      'Developed practical experience with Java full-stack technologies.',
      'Learned to work with frontend components, backend services, APIs and databases.',
      'Built a foundation in debugging, maintainable coding practices and collaborative development.',
    ],
  },
  {
    role: 'Full Stack Development Intern',
    org: 'Infosys Springboard',
    period: 'Internship 5.0 · B1',
    type: 'internship',
    bullets: [
      'Practiced full-stack web application development with Angular, Spring Boot, Java, HTML, CSS and MySQL.',
      'Applied REST APIs to connect frontend interfaces with backend services.',
      'Worked on the E-Doctor Appointment Management System as part of the internship project.',
    ],
  },
  {
    role: 'AI and Cloud Intern',
    org: 'Edunet Foundation / AICTE',
    period: 'January 2024 · four-week program',
    type: 'internship',
    bullets: [
      'Completed AI and cloud-oriented learning through SkillsBuild and IBM Cloud.',
      'Worked with Python data tools such as Pandas and NumPy.',
      'Gained exposure to preparing and presenting data through web-based reports.',
    ],
  },
  {
    role: 'IAM / Security Analyst virtual experience',
    org: 'TCS · Forage',
    period: 'Virtual work experience',
    type: 'virtual',
    bullets: [
      'Virtual simulation, kept distinct from paid employment and formal internships.',
      'TODO: list the specific IAM / cybersecurity tasks completed once confirmed.',
    ],
  },
]

export const projects: Project[] = [
  {
    slug: 'e-doctor-appointment',
    title: 'E-Doctor Appointment Management System',
    tagline: 'Booking and managing doctor appointments end to end.',
    status: 'shipped',
    kind: 'Full-stack web application · Infosys Springboard internship project',
    summary:
      'A web application designed to streamline doctor appointment booking and management, with a clear split between frontend, backend and database responsibilities.',
    stack: ['Angular', 'Spring Boot', 'Java', 'MySQL', 'HTML', 'CSS', 'REST APIs'],
    features: [
      'Doctor appointment scheduling and management.',
      'Frontend and backend integration through REST APIs.',
      'Database-backed storage of application information.',
      'Email confirmations as part of the appointment workflow.',
      'Structured separation of frontend, backend and database responsibilities.',
    ],
    caseStudy: {
      problem:
        'Booking a doctor appointment by phone or in person is slow and error-prone for both patients and clinics.',
      contribution:
        'Built full-stack features during the Infosys Springboard internship: Angular screens, Spring Boot REST endpoints and MySQL persistence for the appointment workflow.',
      challenge:
        'Keeping the Angular client and the Spring Boot API contract consistent while the appointment flow (including email confirmation) evolved.',
      // result intentionally omitted: add only with real evidence.
    },
  },
  {
    slug: 'student-information-management',
    title: 'Student Information Management System',
    tagline: 'Structured digital records for student data.',
    status: 'shipped',
    kind: 'Academic / software development project',
    summary:
      'An application for organizing and managing student information in a structured digital system.',
    stack: ['TODO: confirm'],
    features: [
      'Student record creation and maintenance.',
      'Searching, viewing and updating student information.',
      'Database integration and data validation.',
      'A structured interface for managing student records.',
    ],
    caseStudy: {
      problem: 'Student information kept in scattered documents is hard to search, update and keep consistent.',
      contribution: 'TODO: confirm which parts of the system were designed and implemented.',
      challenge: 'TODO: describe one real technical challenge from the implementation.',
    },
  },
  {
    slug: 'edu-eats',
    title: 'Edu Eats - Campus Food Ordering Platform',
    tagline: 'Connecting students with campus canteens and bakeries.',
    status: 'in-development',
    kind: 'In development / planned',
    summary:
      'A campus-focused food discovery and ordering platform connecting students with college canteens, bakeries and other food vendors. Currently in development: the features below are planned, not shipped.',
    stack: ['Angular 19', 'Spring Boot 3.3.10', 'Java', 'REST APIs'],
    features: [
      'Student and vendor-oriented workflows (planned).',
      'Campus-based food discovery (planned).',
      'Menus, food availability and preparation-time information (planned).',
      'Cart and user profile functionality (planned).',
      'Pickup-oriented ordering experience (planned).',
      'Frontend-to-backend integration (in progress).',
    ],
    caseStudy: {
      problem: 'Campus canteens are crowded at peak hours and students cannot see availability or waiting time.',
      contribution: 'Designing and building the Angular frontend and Spring Boot backend. TODO: confirm which features are implemented.',
      challenge: 'Modelling vendors, menus and preparation time so pickup estimates stay meaningful.',
    },
  },
  {
    slug: 'ai-agent-memory',
    title: 'AI Agent Memory and Reliability',
    tagline: 'Can more remembered context make an agent worse?',
    status: 'exploration',
    kind: 'Technical exploration · engineering presentation topic',
    summary:
      'A technical exploration for a SecureW2 Show & Tell session on how AI-agent memory affects response quality over time: memory accumulation, irrelevant context, retrieval quality, and whether storing more can reduce an agent\'s effectiveness. This is a research and presentation topic, not a shipped system.',
    stack: ['Generative AI', 'Retrieval', 'Agent memory'],
    features: [
      'Hypothesis: more stored memory does not always improve answers.',
      'Experiment design around memory accumulation and retrieval quality.',
      'Observations and conclusions to be documented (TODO).',
    ],
    caseStudy: {
      problem: 'Agents that accumulate memory may start to retrieve irrelevant context and answer worse over time.',
      contribution: 'Selected and framed the topic for a team Show & Tell discussion. TODO: add experiment notes if run.',
      challenge: 'Separating the effect of retrieval quality from the sheer volume of stored context.',
    },
  },
]

export const skillGroups: SkillGroup[] = [
  {
    name: 'Backend',
    skills: ['Java', 'Spring Boot', 'REST APIs', 'JDBC', 'Servlets', 'Hibernate / JPA', 'JUnit 4', 'Mockito'],
  },
  {
    name: 'Frontend',
    skills: ['Angular', 'Apache Wicket', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Bootstrap'],
  },
  {
    name: 'Data & messaging',
    skills: ['MySQL', 'MongoDB', 'RabbitMQ', 'SQL', 'Event-driven systems'],
  },
  {
    name: 'Cloud & AI',
    skills: ['AWS Lambda', 'Amazon Kinesis', 'Microsoft Azure AI', 'Generative AI', 'Python', 'Pandas', 'NumPy', 'ML fundamentals'],
  },
  {
    name: 'Engineering practice',
    skills: ['Git', 'Debugging', 'Code reviews', 'Agile', 'Production support', 'Secure coding', 'XSS awareness', 'Host Header Injection awareness', 'API integration'],
  },
]

export const credentials: Credential[] = [
  {
    title: 'Microsoft Certified: Azure AI Cloud Developer Associate',
    issuer: 'Microsoft',
    kind: 'professional',
    summary: 'Azure AI and cloud-related development.',
    verified: false,
  },
  {
    title: 'Career Essentials in Generative AI',
    issuer: 'Microsoft and LinkedIn Learning',
    kind: 'course',
    summary: 'Foundational learning in generative AI and its applications.',
    verified: false,
  },
  {
    title: 'Generative AI',
    issuer: 'LinkedIn Learning',
    kind: 'course',
    summary: 'Structured learning in generative AI concepts and use cases.',
    verified: false,
  },
  {
    title: 'Data Analytics and Visualization Job Simulation',
    issuer: 'Accenture · Forage',
    kind: 'simulation',
    summary: 'Industry-oriented simulation in data analysis and visualization.',
    verified: false,
  },
  {
    title: 'Cybersecurity / Security Analyst Job Simulation',
    issuer: 'Tata · Forage',
    kind: 'simulation',
    summary: 'Cybersecurity virtual work experience.',
    verified: false,
  },
  {
    title: 'TCS Identity and Access Management (IAM)',
    issuer: 'TCS',
    kind: 'simulation',
    summary: 'Identity management and access-control concepts.',
    verified: false,
  },
  {
    title: 'Agile Project Management',
    issuer: 'HP LIFE',
    kind: 'course',
    summary: 'Agile project management concepts and delivery.',
    verified: false,
  },
  {
    title: 'ML101: Machine Learning at the Edge',
    issuer: 'Arm Education / edX',
    kind: 'course',
    summary: 'Machine learning in edge-computing environments.',
    verified: false,
  },
  {
    title: 'SQL and Relational Databases 101',
    issuer: 'IBM CognitiveClass.ai',
    kind: 'course',
    summary: 'Foundational SQL and relational database concepts.',
    verified: false,
  },
]

export const education: EducationItem[] = [
  {
    level: 'Bachelor of Technology (B.Tech)',
    institution: 'Mother Theresa Institute of Engineering and Technology, Palamaner',
    detail: 'JNTUA affiliation · Graduated 2025',
    score: '80%',
  },
  {
    level: 'Intermediate',
    institution: 'Sri Vivekananda Junior College',
    score: '90.1%',
  },
  {
    level: 'Secondary School (10th)',
    institution: 'Vignana Deepthi English Medium School',
    score: '9.7 CGPA',
  },
]

export const achievements: Achievement[] = [
  {
    title: 'Enterprise software engineering',
    body: 'Progressed from a six-month SecureW2 internship to a Full Stack Java Developer role.',
  },
  {
    title: 'Full-stack development',
    body: 'Experience across frontend, backend services, REST APIs and database integration with Java and modern web technologies.',
  },
  {
    title: 'Security-aware development',
    body: 'Practical exposure to secure coding, vulnerability mitigation and web security concepts.',
  },
  {
    title: 'Cloud and distributed systems',
    body: 'Familiarity with cloud technologies, event-driven processing and messaging through work and learning.',
  },
  {
    title: 'AI and emerging technology',
    body: 'AI-related learning programs, plus Azure AI and AI-agent memory explored as an engineering topic.',
  },
  {
    title: 'Consistent academics',
    body: 'B.Tech completed in 2025 with 80%, after 90.1% in Intermediate and 9.7 CGPA in 10th standard.',
  },
]

export const stats: Stat[] = [
  { value: '~1 yr', label: 'Professional experience', note: 'As reported, Full Stack Java Developer at SecureW2' },
  { value: '6 mo', label: 'SecureW2 internship', note: 'Software Development Intern' },
  { value: '3', label: 'Documented projects', note: 'Includes Edu Eats, currently in development' },
  { value: '9', label: 'Credentials & programs', note: 'Courses and simulations, not all professional certifications' },
]

export const caseStudyThemes: { title: string; body: string }[] = [
  { title: 'Frontend-to-backend data flow', body: 'Apache Wicket components, service calls and API integration.' },
  { title: 'Asynchronous processing', body: 'How REST services interact with RabbitMQ and downstream services.' },
  { title: 'Production debugging', body: 'Investigating database, ORM, startup and UI errors.' },
  { title: 'Application security', body: 'Secure coding, XSS, host-header injection and vulnerability mitigation.' },
  { title: 'Automated testing', body: 'JUnit 4 and Mockito testing for Java components.' },
  { title: 'Event-driven architecture', body: 'Learning and working with AWS Lambda and Amazon Kinesis.' },
]

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
