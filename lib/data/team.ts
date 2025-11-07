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
        title: `Artificial Intelligence and Multiagent Systems Lab
        Indian Institute of Information Technology, Allahabad`,
        email: 'bhupesh.it.iiita@gmail.com',
        link: 'https://www.linkedin.com/in/bhupesh-dewangan/',
        image: '/image/team/bhupeshdewangan.jpg',
      },
      {
        name: 'Debjyoti Ray',
        title: `Artificial Intelligence and Multiagent Systems Lab
        Indian Institute of Information Technology, Allahabad`,
        email: 'iec2022111@iiita.ac.in',
        link: 'https://www.linkedin.com/in/debjyotiray5811/',
        image: '/image/team/debjyotiray.jpg',
      },
      {
        name: 'Shraddha Srivastava',
        title: `Artificial Intelligence and Multiagent Systems Lab
        Indian Institute of Information Technology, Allahabad`,
        email: '	shraddhasrivas14@gmail.com',
        link: 'https://www.linkedin.com/in/shraddha-srivastava-898024212/',
        image: '/image/team/shraddhasrivastava.jpg',
      },
      {
        name: 'Yijie Ren',
        title: `Digital Biology Lab
        University of Missouri, Columbia`,
        email: 'yry7d@mail.missouri.edu',
        link: 'https://www.linkedin.com/in/yijie-ren-851a61141/',
        image: '/image/team/yijieren.jpg',
      },
      {
        name: 'Lei Jiang',
        title: `Digital Biology Lab
        University of Missouri, Columbia`,
        email: 'leijiang@missouri.edu',
        image: '/image/team/leijiang.jpg',
      },
    ],
  },
];
