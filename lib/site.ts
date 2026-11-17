export const site = {
  name: "Faris Naufalianto",
  firstName: "Faris",
  monogram: "FN",
  email: "farisnovaal@gmail.com",
  linkedin: "https://www.linkedin.com/in/farisnaufalianto/",
  github: "https://github.com/farisnaufalianto",
  photo: "/faris.jpg",
  photoAlt: "Portrait of Faris Naufalianto in a navy Informatics Engineering jacket",
  description:
    "Portfolio of Faris Naufalianto, an Information Systems student at Universitas Trisakti focused on Front-End Development.",
} as const;

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export const hero = {
  status: "Available for opportunities",
  line1: "Hi, I’m Faris.",
  line2: "Building Digital Experiences.",
  intro:
    "Information Systems student at Universitas Trisakti, focused on Front-End Development and on building modern, responsive websites.",
  panel: [
    { label: "Studying", value: "Information Systems, Universitas Trisakti" },
    { label: "Focus", value: "Front-End Development" },
    { label: "This site", value: "Next.js, TypeScript, GSAP, Three.js" },
  ],
  items: [
    { icon: "code", label: "Front-End focus" },
    { icon: "book", label: "Always learning" },
    { icon: "responsive", label: "Responsive by default" },
    { icon: "open", label: "Open to opportunities" },
  ],
} as const;

export const about = {
  greeting: "Hi! I’m Faris Naufalianto.",
  scrubbed: [
    "I’m an Information Systems student at Universitas Trisakti with a strong interest in technology, web development, and digital innovation.",
    "I enjoy turning ideas into functional and visually appealing digital experiences. My main focus is Front-End Development, where I explore how design and technology work together to create websites that are not only attractive but also intuitive and user-friendly.",
  ],
  sequence: [
    "I’m continuously developing my skills in HTML, CSS, JavaScript, and various technologies while exploring new ways to solve problems through technology. I also enjoy working on personal projects that allow me to experiment, learn, and improve my development skills.",
    "I believe that growth comes from curiosity, consistency, and the willingness to keep learning. My goal is to become a skilled Front-End Developer and continue growing in the world of Software Development.",
  ],
  closing: "Always learning, always building, and always looking for new challenges.",
} as const;

export const skills = {
  intro:
    "I enjoy exploring different technologies and continuously improving my technical abilities. Here are some of the tools and technologies I have been learning and working with.",
  frontend: { title: "Frontend Development", items: ["HTML", "CSS", "JavaScript"] },
  backend: { title: "Programming & Database", items: ["Python", "SQL", "MySQL", "PHP"] },
  tools: {
    title: "Tools & Technologies",
    items: [
      { name: "Visual Studio Code", icon: "code" },
      { name: "Git & GitHub", icon: "git" },
      { name: "Laravel", icon: "layers" },
      { name: "Power BI", icon: "chart" },
      { name: "Postman", icon: "send" },
      { name: "Katalon", icon: "bug" },
    ],
  },
} as const;

export type Project = {
  id: string;
  title: string;
  short: string;
  description: string;
  tech: readonly string[];
  visual: "store" | "karate";
};

export const projects: readonly Project[] = [
  {
    id: "faris-store",
    title: "Faris Store: E-Commerce Login Interface",
    short: "A login interface for an e-commerce store.",
    description:
      "Faris Store is an e-commerce login interface built with HTML, CSS, and JavaScript. It is a front-end project focused on a clean, user-friendly sign-in experience.",
    tech: ["HTML", "CSS", "JavaScript"],
    visual: "store",
  },
  {
    id: "karate-attendance",
    title: "Karate Attendance Management System",
    short: "A digital attendance system concept for karate activities.",
    description:
      "A digital attendance management system concept for karate activities, built with Next.js, React, and TypeScript.",
    tech: ["Next.js", "React", "TypeScript"],
    visual: "karate",
  },
];

export const goal = {
  statement:
    "To grow as a Frontend Developer and become capable of building modern, responsive, and interactive web applications.",
  steps: [
    { title: "Learning", text: "Strengthening HTML, CSS, and JavaScript while exploring new technologies." },
    { title: "Building", text: "Personal projects to experiment, learn, and improve my development skills." },
    { title: "Frontend Developer", text: "Modern, responsive, and interactive web applications." },
  ],
} as const;

/** Public test account of the DummyJSON API. For testing only. */
export const demoAccount = { username: "emilys", password: "emilyspass" } as const;
