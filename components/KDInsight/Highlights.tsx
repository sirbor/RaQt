'use client';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import GroupsIcon from '@mui/icons-material/Groups';
import HubIcon from '@mui/icons-material/Hub';
import InsightsIcon from '@mui/icons-material/Insights';
import LanguageIcon from '@mui/icons-material/Language';
import PaymentsIcon from '@mui/icons-material/Payments';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import styles from './kdinsight.module.scss';
import localStyles from './Highlights.module.scss';
import { useHomepageContent } from 'contexts/HomepageContentContext';

const HIGHLIGHT_ICONS = [
  HubIcon,
  InsightsIcon,
  GroupsIcon,
  ReceiptLongIcon,
  PaymentsIcon,
  VerifiedUserIcon,
  AssessmentIcon,
  ChatIcon,
  AccountBalanceWalletIcon,
  LanguageIcon,
  StorefrontIcon,
  PhoneIphoneIcon,
  DeveloperBoardIcon,
] as const;

const Highlights = () => {
  const { highlights: h } = useHomepageContent();

  return (
    <section className={styles.section} id="solutions" aria-labelledby="solutions-heading">
      <div className={localStyles.wrap}>
        <div className={styles.sectionInner}>
          <span className={styles.sectionEyebrow}>{h.eyebrow}</span>
          <h2 className={localStyles.gridTitle} id="solutions-heading">
            {h.title}
          </h2>
          <p className={localStyles.intro}>{h.intro}</p>
          <ul className={localStyles.grid}>
            {h.items.map((item, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? HIGHLIGHT_ICONS[0];
              return (
                <li key={`${item.title}-${i}`} className={localStyles.card}>
                  <div className={localStyles.icon} aria-hidden>
                    <Icon sx={{ fontSize: 26, color: '#8a734a' }} />
                  </div>
                  <h3 className={localStyles.cardTitle}>{item.title}</h3>
                  <p className={localStyles.cardBody}>{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
