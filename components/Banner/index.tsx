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
        <h1>RAQT delivers advanced solutions for research, quantitative analysis, fintech, and data analytics.</h1>
        <p className={`${styles['large']} large`}>
        Welcome to RAQT, where data drives our innovation. We specialize in cutting-edge research, quantitative analysis,
        fintech solutions, and data analytics to help businesses and investors achieve their goals.
        Our expert team is committed to providing actionable insights and state-of-the-art solutions.
        </p>
        <div className={styles['button-container']}>
          <button className="ui-button-2 primary" onClick={() => handleMoveToId()}>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
