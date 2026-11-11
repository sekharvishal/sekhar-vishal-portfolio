export const frontierResume = {
  contact: {
    address: '15-635/1, Saravanapuram, Chittoor, Andhra Pradesh',
    phone: '9652318496',
    email: 'vishal944170@gmail.com',
    linkedin: 'https://linkedin.com/in/sekhar-vishal-0501602b1',
    github: 'https://github.com/sekharvishal',
  },
  projects: [
    {
      id: 'denoising',
      title: 'Unpaired Image Denoising in Digital Images',
      date: 'November 2023',
      focus: 'Computer vision · optical flow · motion estimation',
      summary: 'Explored flow-based techniques to reduce noise in digital images without requiring paired clean/noisy training examples.',
      details: [
        'Applied optical flow and motion estimation as part of an unpaired image-denoising approach.',
        'Combined flow-based methods to improve visual clarity, as described in the résumé.',
        'No benchmark, numerical performance result, or dataset name was supplied.',
      ],
      technologies: ['Digital image processing', 'Optical flow', 'Motion estimation', 'Unpaired denoising'],
    },
    {
      id: 'phone-detector',
      title: 'Mobile Phone Detector using the LM358',
      date: 'January 2024',
      focus: 'Analog electronics · operational amplifier · detection circuit',
      summary: 'Designed an LM358-based circuit intended to detect electromagnetic interference associated with nearby mobile phones and provide an alert.',
      details: [
        'Used the LM358 operational amplifier in the detector circuit.',
        'The résumé describes sensitivity and accuracy tuning, but gives no measured test results.',
        'The source résumé leaves the specific application or system incomplete; no use case is assumed here.',
      ],
      technologies: ['LM358', 'Operational amplifier', 'Electromagnetic interference', 'Analog circuit design'],
    },
  ],
  internships: [
    {
      title: 'Embedded Systems Developer',
      organization: 'EduSkills · virtual internship',
      date: 'June 2024',
      description: 'Virtual internship experience developing and testing embedded software for microcontroller-based systems.',
      details: [
        'Used C/C++ to implement features and troubleshoot embedded application issues.',
        'Worked on hardware interfaces and communication protocols, including UART and SPI.',
        'Résumé describes virtual-team collaboration, code review, and testing practices.',
      ],
      technologies: ['Embedded systems', 'Microcontrollers', 'C / C++', 'UART', 'SPI'],
    },
    {
      title: 'Very-Large-Scale Integration',
      organization: 'SkillDzire · virtual internship',
      date: 'July 2024',
      description: 'Virtual internship experience covering digital and analog VLSI design and verification.',
      details: [
        'Résumé lists Cadence and Synopsys tools for circuit simulation and layout.',
        'Worked with RTL development and functional verification concepts.',
        'Explored power, performance, and area (PPA) analysis and optimization.',
      ],
      technologies: ['VLSI', 'RTL', 'Cadence', 'Synopsys', 'Functional verification', 'PPA'],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Technology',
      subject: 'Electronics and Communication Engineering',
      institution: 'Mother Theresa Institute of Engineering and Technology',
      place: 'Palamaner, Andhra Pradesh',
      date: 'November 2021 – June 2025',
    },
    {
      degree: 'Intermediate',
      subject: 'Mathematics · Physics · Chemistry',
      institution: 'Sri Vivekananda Junior College',
      place: 'Palamaner, Andhra Pradesh',
      date: 'July 2019 – June 2021',
    },
    {
      degree: 'SSC',
      subject: 'Secondary School Certificate',
      institution: 'Vignana Deepthi English Medium School',
      place: 'Chittoor, Andhra Pradesh',
      date: 'June 2018 – June 2019',
    },
  ],
  skillGroups: [
    {
      name: 'Circuit design & analysis',
      skills: ['Analog circuits', 'Digital circuits', 'PCB layout', 'Power management', 'Signal processing'],
    },
    {
      name: 'Embedded systems',
      skills: ['Microcontrollers', 'Microprocessors', 'C / C++', 'Peripheral interfacing'],
    },
    {
      name: 'Test & troubleshooting',
      skills: ['Oscilloscope', 'Multimeter', 'Logic analyzer', 'Circuit debugging'],
    },
    {
      name: 'Analog & digital electronics',
      skills: ['Operational amplifiers', 'Filters', 'Oscillators', 'Logic gates'],
    },
  ],
  certification: {
    title: 'TCS iON Career Edge – Young Professional',
    issuer: 'Learner · Tata Group',
    date: '11 October 2023 – 26 October 2023',
    topics: [
      'Communication, presentation, and soft skills',
      'Career guidance, résumé writing, group discussion, and interview skills',
      'Business etiquette, email writing, and telephone etiquette',
      'Accounting fundamentals and IT foundational skills',
      'Overview of artificial intelligence',
    ],
  },
} as const
