import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import PillarCard from './components/PillarCard';
import styles from './Pillar.module.scss';

interface iPillarCards {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  path?: string;
}

const pillarCardsContent: iPillarCards[] = [
  {
    image: '/landingpage/institution-quality.png',
    title: 'Research Solutions',
    subtitle: 'Comprehensive market and competitive analysis.',
    description:
      "Our Research Solutions provide in-depth market and competitive analysis to help you understand industry dynamics and identify growth opportunities. Through a blend of qualitative and quantitative research methods, we deliver comprehensive reports that highlight market trends, consumer behavior, and competitive positioning. Our tailored research reports address specific business challenges, offering actionable insights and strategic recommendations to guide your decision-making and drive success.",
  },
  {
    image: '/landingpage/data-first.png',
    title: 'Quantitative Analysis',
    subtitle: 'Advanced data modeling and risk management.',
    description:
      'RAQT’s Quantitative Analysis services include advanced data modeling and algorithm development to support sophisticated financial decision-making. We create predictive models and develop custom algorithms that solve complex financial problems, such as automated trading and risk assessment. Our risk assessment techniques evaluate credit, market, and operational risks, providing detailed reports and strategies to mitigate potential impacts and enhance financial stability.',
  },
  {
    image: '/landingpage/network-driven.png',
    title: 'Data Analytics',
    subtitle: 'Business intelligence and data visualization.',
    description:
      'RAQT’s Data Analytics services harness the power of big data to deliver actionable insights and drive business decisions. We utilize cutting-edge technologies to analyze large datasets and provide interactive business intelligence dashboards. Our data visualization tools present complex information in an easily understandable format, enabling you to make informed decisions and optimize your business strategies based on real-time data insights.',
  },
  {
    image: '/landingpage/capital-structure.png',
    title: 'Fintech Solutions',
    subtitle: 'Custom software development and payment integration.',
    description:
      'Our Fintech Solutions focus on developing customized software and integrating payment systems to enhance your financial operations. We design and build bespoke fintech applications tailored to your needs, ensuring seamless integration with payment gateways like Stripe and Visa. Additionally, we offer virtual card solutions that support multiple currencies and transaction types, enhancing security and flexibility for your financial transactions.',
    path: '/sponsor',
  },
];

const Pillars = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/sponsor');
  };

  return (
    <section className={styles.pillars}>
      <h3>Our Pillars</h3>
      <div className={styles['pillars-content']}>
        <Grid container>
          {pillarCardsContent.map(({ title, subtitle, description, image, path }, index) => {
            const isLast = index === pillarCardsContent.length - 1;
            return (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <div
                  onClick={isLast ? handleNavigate : undefined}
                  style={{ cursor: isLast ? 'pointer' : 'default', width: '100%' }}>
                  <PillarCard
                    title={title}
                    subtitle={subtitle}
                    description={description}
                    imageSrc={image}
                    styles={styles}
                  />
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </section>
  );
};

export default Pillars;
