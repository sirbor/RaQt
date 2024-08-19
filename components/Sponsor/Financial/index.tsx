import { Grid, useMediaQuery } from '@mui/material';
import { FinancialType } from 'types/financial';
import styles from './Financial.module.scss';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';

const financial: FinancialType[] = [
  {
    title: 'Research',
    icon: <PieChartOutlineOutlinedIcon htmlColor="#e72d65" />,

    content: 'Thorough market research and data analysis are crucial for guiding fintech investment strategies and aligning them with your financial goals.',
  },
  {
    title: 'Data',
    icon: <ReceiptLongOutlinedIcon htmlColor="#e72d65" />,

    content:
      'Effective portfolio management in fintech relies on leveraging data to balance risk, optimize performance, and make informed decisions about capital allocation.',
  },
  {
    title: 'Solutions',
    icon: <AccessibilityNewOutlinedIcon htmlColor="#e72d65" />,
    content: 'Streamlined tax and estate planning solutions ensure efficient management of financial decisions, avoiding forced sales and simplifying investor reporting.',
  },
];

const Financial = () => {
  const matches = useMediaQuery('(max-width:600px)');

  return (
    <section className={styles.financial}>
      <div className={styles['financial-header']}>
        {/* <h6>SPONSORS</h6> */}
        <h3>As an Owner you have financial needs that should drive your capital decisions</h3>
      </div>
      <div className={styles['financial-content']}>
        <Grid container rowSpacing={3} columnSpacing={2}>
          {financial.map((financial, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <div className={styles['financial-content-item']}>
                {financial.icon}
                <h2>{financial.title}</h2>
                <p>{financial.content}</p>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default Financial;
