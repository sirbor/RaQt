import styles from './HowItWorks.module.scss';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const HowItWorks: React.FC = () => {
  return (
    <section className={styles['how-it-works']}>
      <h3>How it Works</h3>
      <h6>Provide actionable insights through market analysis and data-driven algorithms.</h6>
      <p>
        RAQT provides data <span>to institutional standards</span>
      </p>

      <div className={styles['how-it-works-cards']}>
        <div className={styles['how-it-works-cards-small']}>
          <WarningAmberOutlinedIcon htmlColor="#FFD130" />
          <h4>Data does not pass due diligence</h4>
          <p>
            <span>Data remains unreliable,</span> halting further processes as the analysis cannot proceed with poor-quality data.
          </p>
        </div>
        <div className={styles['how-it-works-cards-icon']}>
          <ArrowForwardIosIcon htmlColor="#00838F" />
        </div>
        <div className={styles['how-it-works-cards-large']}>
          <CheckCircleOutlineIcon htmlColor="#00838F" />
          <h4>Data passes due diligence</h4>
          <div className={styles['how-it-works-cards-large-row']}>
            <p>Data is cleaned and organized, ready for Advanced Data Modelin</p>

            <div className={styles['how-it-works-cards-large-row-icon']}>
              <ArrowForwardIosIcon />
            </div>

            <p>
            Predictive models are developed and validated, ready for Algorithm Development.
            </p>

            <div className={styles['how-it-works-cards-large-row-icon']}>
              <ArrowForwardIosIcon />
            </div>
            <p>Functional algorithms are delivered with performance reports and deployment plans.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
