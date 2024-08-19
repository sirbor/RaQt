import React from 'react';
import { Grid } from '@mui/material';
import { PersonType } from 'types/person';
import Person from './components/Person';
import styles from './About.module.scss';

const people: PersonType[] = [
  {
    id: 1,
    name: 'Dominic Bor',
    avatar: '/people/1.jpeg',
    role: 'Founder & CTO',
    summary:
      'Results-driven technologist, Full-stack development, Data architecture, Fintech innovation',
    description: `Dominic Bor is a results-driven technologist with a strong background in full-stack development and a passion for innovation. As the driving force behind RAQT, Dominic has successfully led the development of scalable, secure applications that have significantly boosted user engagement and optimized performance. His expertise in Python, C/C++, and JavaScript, coupled with advanced frameworks, has enabled him to reduce vulnerabilities by 30% and automate 80% of data workflows. Dominic’s leadership in creating intelligent systems and enhancing data architecture has consistently delivered measurable improvements, including a 40% increase in content engagement rates. Fluent in English and Swahili, with a working knowledge of French, Dominic combines technical prowess with strategic vision, making him a key player in the fintech and data analytics space.`,
  },

  {
    id: 2,
    name: 'Anthony Dominguez',
    avatar: '/people/4.jpg',
    role: 'Software Engineer',
    summary:
      'Senior Software Engineer (RAQT), Full-stack development (Python, JavaScript, C++), Cloud technologies (AWS, Docker)',

    description: `Anthony Dominguez is a skilled Software Engineer at RAQT, bringing extensive experience in full-stack development and a passion for creating innovative solutions. With expertise in languages such as Python, JavaScript, and C++, Anthony has played a pivotal role in developing and optimizing RAQT’s fintech and data analytics platforms. His deep understanding of frameworks like React and Django, combined with his proficiency in cloud technologies such as AWS and Docker, enables him to build scalable, secure applications that meet the highest industry standards. Anthony’s commitment to continuous improvement and his ability to troubleshoot complex technical challenges have led to significant enhancements in system performance and user experience. As a key member of the RAQT team, Anthony leverages his technical acumen to drive innovation and deliver solutions that exceed client expectations.`,
  },

  {
    id: 3,
    name: 'James Illara',
    avatar: '/people/5.jpg',
    role: 'Finance Assistant',
    summary:
      'CPA, Financial management, Budgeting, Financial reporting, Financial analysis, Forecasting',

    description: `James Illara serves as the Finance Assistant at RAQT, where he leverages his CPA qualifications and financial expertise to manage the organization’s financial operations. With a strong background in accounting and financial management, James is responsible for overseeing budgeting, financial reporting, and ensuring compliance with financial regulations. His proficiency in financial analysis and forecasting has enabled RAQT to maintain fiscal discipline while supporting the company’s growth initiatives. James’s attention to detail and his ability to provide strategic financial insights are critical to RAQT’s success, ensuring that all financial decisions are data-driven and aligned with the company’s long-term objectives. His role is pivotal in ensuring that RAQT remains financially healthy and poised for continued growth in the competitive fintech landscape.`,
  },

  {
    id: 4,
    name: 'Farfalle Paya',
    avatar: '/people/3.jpg',
    role: 'Research Assistant',
    summary:
      'Legal research and analysis, Regulatory compliance, Contract law, Intellectual property rights',
    description: `Farfalle Paya is a dedicated Research Assistant at RAQT, specializing in legal research and analysis. With a strong legal background, Farfalle brings a unique perspective to RAQT’s research initiatives, ensuring that all data-driven insights are grounded in sound legal principles. Her expertise in regulatory compliance, contract law, and intellectual property rights has been instrumental in guiding RAQT’s strategic decisions and maintaining adherence to legal standards across all projects. Farfalle’s meticulous approach to research, combined with her ability to synthesize complex legal information into actionable insights, makes her an invaluable asset to the team. Her contributions ensure that RAQT’s solutions are not only innovative and effective but also compliant with the ever-evolving legal landscape.`,
  },
];
const About = () => {
  const [show, setShow] = React.useState(false);

  const toggleShow = () => {
    setShow((value) => !value);
  };

  return (
    <section id="about-us" className={styles.about}>
      <div className={styles['about-header']}>
        <h3>About Us</h3>
        <p>
          RAQT is at the forefront of data-driven innovation. Our mission is to harness the power of data 
          to drive financial excellence.
        </p>
        <p>
          We offer advanced solutions in research, quantitative analysis, fintech development, and data 
          analytics, tailored to meet the needs of our diverse clientele.
        </p>
      </div>
      <div className={styles['about-content']}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          {people.map((person, index) => (
            <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
              <Person person={person} styles={styles} show={show} toggleShow={toggleShow} />
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default About;
