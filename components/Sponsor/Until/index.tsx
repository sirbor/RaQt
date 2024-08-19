import { Grid, useMediaQuery } from '@mui/material';
import classNames from 'classnames';
import styles from './Until.module.scss';

const untilNow = [
  'Analyze market trends and consumer behavior to identify growth opportunities through detailed reports and forecasts.',
  'Evaluate competitors strategies and market positioning to provide reports and recommendations for enhancing competitive advantage.',
  'Tailor research to address specific business challenges and deliver customized reports with actionable insights.',
  'Predict future market trends using historical data to guide strategic planning with forecast reports.',
];

const withPillar = [
  'Create predictive models using statistical and machine learning techniques to forecast trends and scenarios.P',
  'Develop and optimize custom algorithms for financial tasks, including performance evaluation and backtesting.',
  'Assess financial risks with quantitative models and stress testing to provide risk management reports and recommendations.',
  "Clean and prepare data for analysis by handling inconsistencies and delivering reliable datasets.",
];

const Until: React.FC = () => {
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <section className={styles.until}>
      <Grid container>
        <Grid item xs={12} sm={6} sx={{}}>
          <div className={styles['until-now']}>
            {/* <div className={styles['until-now-tag']}>
              <div>
                <img src="/sponsor/users.svg"></img>
              </div>
              <p>Then</p>
            </div> */}
            <h1>Research</h1>
            {untilNow.map((el, idx) => (
              <div key={idx} className={styles['until-now-item']}>
                <img src={`/sponsor/${matches ? 'remove.svg' : 'arrow-left.svg'}`} alt="plus-icon" />
                <p>{el}</p>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classNames(styles['until-now'], styles['right'])}>
            {/* <div className={styles['until-now-tag']}>
              <div>
                <img src="/sponsor/users.svg"></img>
              </div>
              <p>Now</p>
            </div> */}
            <h1 className={styles['right']}>Data Solutions</h1>
            {withPillar.map((el, idx) => (
              <div key={idx} className={styles['until-now-item']}>
                <img src={`/sponsor/check.svg`} alt="check" />
                <p className={styles['right']}>{el}</p>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </section>
  );
};

export default Until;
