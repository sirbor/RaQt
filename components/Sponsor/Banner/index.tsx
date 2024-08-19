import { handleMoveToId } from 'utils';
import styles from './Banner.module.scss';
interface Props {
  imgSrc: string;
}

const Banner: React.FC<Props> = ({ imgSrc }) => {
  return (
    <section
      className={`${styles.banner} padding-wrapper complete`}
      style={{ backgroundImage: `url(${imgSrc})` }}>
      <div className={styles['banner-content']}>
        <div className={styles['banner-content-solutions']}>
          <div className={styles['banner-content-solutions-container']}>
            <img src="/career/logo.svg"></img>
          </div>
          <h6>SOLUTIONS</h6>
        </div>
        <h1>RAQT delivers research, quantitative analysis, fintech solutions, and data analytics to drive informed decisions and optimize operations.</h1>
                <p className={`${styles['large']} ${styles.shinyText}`}>
          RAQT provides expert research to guide strategic decisions. We deliver advanced quantitative analysis for data-driven insights. Our fintech solutions streamline financial operations with secure, innovative technology. Additionally, our data analytics unlock the potential of your data for optimized business performance.
        </p>
        <div className={styles['button-container']}>
          <button className="ui-button-2" onClick={() => handleMoveToId()}>
            SCHEDULE A CALL
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
