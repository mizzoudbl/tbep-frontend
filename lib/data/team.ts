type TeamMember = {
  name: string;
  role?: string;
  title: string;
  email: string;
  link?: string;
  image: string;
};

type TeamCategory = {
  heading: string;
  members: TeamMember[];
};

export const team: TeamCategory[] = [
  {
    heading: 'Principal Investigator',
    members: [
      {
        name: 'Dr. Gyan P. Srivastava',
        title: `Department of Electrical Engineering and Computer Science
        University of Missouri, Columbia`,
        email: 'gps8b9@missouri.edu',
        link: 'https://engineering.missouri.edu/faculty/gyan-srivastava/',
        image: '/image/team/gpsrivastava.jpg',
      },
    ],
  },
  {
    heading: 'Co-Investigators',
    members: [
      {
        name: 'Prof. Dong Xu',
        title: `Department of Electrical Engineering and Computer Science
        University of Missouri, Columbia`,
        email: 'xudong@missouri.edu',
        link: 'https://engineering.missouri.edu/faculty/dong-xu/',
        image: '/image/team/dongxu.jpg',
      },
      {
        name: 'Dr. Muneendra Ojha',
        title: `Department of Information Technology
        Indian Institute of Information Technology, Allahabad`,
        email: 'muneendra@iiita.ac.in',
        link: 'https://www.linkedin.com/in/muneendra-ojha-a3153b15/',
        image: '/image/team/muneendraojha.jpg',
      },
    ],
  },
  {
    heading: 'Development Team',
    members: [
      {
        name: 'Bhupesh Dewangan',
        role: 'Platform Development Engineer',
        title: `B.Tech
        Indian Institute of Information Technology, Allahabad`,
        email: 'bhupesh.it.iiita@gmail.com',
        link: 'https://www.linkedin.com/in/bhupesh-dewangan/',
        image: '/image/team/bhupeshdewangan.jpg',
      },
      {
        name: 'Debjyoti Ray',
        role: 'AI Chatbot Developer',
        title: `B.Tech
        Indian Institute of Information Technology, Allahabad`,
        email: 'iec2022111@iiita.ac.in',
        link: 'https://www.linkedin.com/in/debjyotiray5811/',
        image: '/image/team/debjyotiray.jpg',
      },
      {
        name: 'Yijie Ren',
        role: 'Project Manager',
        title: `Manager
        Jianna Consulting, LLC`,
        email: 'manager@jianna.net',
        link: 'https://www.linkedin.com/in/yijie-ren-851a61141/',
        image: '/image/team/yijieren.jpg',
      },
      {
        name: 'Lei Jiang',
        role: 'Platform Deployment Engineer',
        title: `PhD
        University of Missouri, Columbia`,
        email: 'leijiang@missouri.edu',
        image: '/image/team/leijiang.jpg',
      },
      {
        name: 'Shraddha Srivastava',
        role: 'Data Management',
        title: `Bioinformatics Consultant
        Crecientech Infosystem, Bangalore`,
        email: 'shraddha.srivastava@crecientech.com',
        link: 'https://www.linkedin.com/in/shraddha-srivastava-898024212/',
        image: '/image/team/shraddhasrivastava.jpg',
      },
    ],
  },
];
