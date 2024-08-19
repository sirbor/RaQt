import { Grid } from '@mui/material';
import { SolutionType } from 'types/solution';
import styles from './PillarSolution.module.scss';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';

const solutions: SolutionType[] = [
  {
    title: 'Market and Competitive Analysis',
    icon: <CachedOutlinedIcon htmlColor="#e72d65" />,
    content:
      'Market and competitive analysis combines the study of market trends, consumer behavior, and competitor strategies to identify growth opportunities and refine business strategies. By integrating qualitative and quantitative research methods—such as surveys and data analytics—this analysis offers insights into market dynamics and competitor positioning. The deliverables include detailed reports with trend forecasts, competitive insights, and strategic recommendations, enabling businesses to capitalize on opportunities and enhance their competitive edge.',
  },
  {
    title: 'Custom Research Reports',
    icon: <KeyOutlinedIcon htmlColor="#e72d65" />,
    content:
      'Custom research reports are designed to address specific questions or challenges unique to a business, providing tailored insights and solutions. This approach involves a bespoke research methodology, which may include targeted surveys, in-depth interviews, and comprehensive data analysis, all aligned with the business’s unique needs and objectives. The outcome is a customized report that presents detailed findings, actionable recommendations, and strategic insights, enabling businesses to tackle particular issues or explore new opportunities with a data-driven approach.',
  },
  {
    title: 'Trend Forecasting',
    icon: <PriceCheckIcon htmlColor="#e72d65" />,
    content:
      'Trend forecasting aims to predict future market conditions and movements based on historical data and analytical techniques. By employing statistical methods, data modeling, and trend analysis, this process generates forecasts that provide a glimpse into potential future scenarios and market changes. The deliverables include forecast reports that outline anticipated trends and their implications for strategic planning. This forward-looking approach helps businesses anticipate market shifts, plan accordingly, and make proactive decisions to stay ahead of the competition.',
  },
];

const PillarSolution = () => {
  return (
    <section id="solutions" className={styles['pillar-solution']}>
      <div className={styles['pillar-solution-header']}>
        <h3>Research</h3>
      </div>
      <div className={styles['pillar-solution-content']}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {solutions.map((solution, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <div className={styles['pillar-solution-content-item']}>
                {solution.icon}
                <h3>{solution.title}</h3>
                <p>{solution.content}</p>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default PillarSolution;