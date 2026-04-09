import React from 'react';

interface Props {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
  styles: Record<string, string>;
}

const PillarCard: React.FC<Props> = ({ imageSrc, title, subtitle, description, styles }) => {
  return (
    <div className={styles['pillar-card']}>
      <div className={styles['pillar-card-content']}>
        <div className={styles['pillar-card-image-wrap']}>
          <img className={styles['pillar-card-image']} src={imageSrc} alt={title} loading="lazy" />
        </div>
        <div className={styles['pillar-card-text']}>
          <h4>{title}</h4>
          <p className="large">{subtitle}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PillarCard;
