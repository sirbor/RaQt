/**
 * Editable marketing homepage copy. Persisted in localStorage for the site editor;
 * merge with defaults via normalizeHomepageContent().
 */

export const HOMEPAGE_STORAGE_KEY = 'kdinsight_homepage_v1';

export type HeroContent = {
  eyebrow: string;
  title: string;
  lead1: string;
  lead2: string;
  primaryCta: string;
  secondaryCta: string;
};

export type HighlightItemContent = {
  title: string;
  body: string;
};

export type HighlightsContent = {
  eyebrow: string;
  title: string;
  intro: string;
  items: HighlightItemContent[];
};

export type UseCaseCardContent = {
  emoji: string;
  label: string;
  detail: string;
  features: string[];
};

export type UseCasesContent = {
  eyebrow: string;
  title: string;
  lead: string;
  cases: UseCaseCardContent[];
};

export type PricingPlanContent = {
  ribbon: string;
  name: string;
  price: string;
  per: string;
  features: string[];
  cta: string;
  note?: string;
};

export type PricingContent = {
  eyebrow: string;
  title: string;
  lead: string;
  standard: PricingPlanContent;
  plus: PricingPlanContent & { note: string };
  examplesTitle: string;
  examples: { label: string; amount: string }[];
  paystackTitle: string;
  paystackCopy: string;
};

export type CtaContent = {
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
};

export type HomepageContent = {
  hero: HeroContent;
  highlights: HighlightsContent;
  useCases: UseCasesContent;
  pricing: PricingContent;
  cta: CtaContent;
};

export function getDefaultHomepageContent(): HomepageContent {
  return {
    hero: {
      eyebrow: 'KDINSIGHT COMMERCE INFRASTRUCTURE',
      title: 'Unified Commerce',
      lead1:
        'KDInsight is commerce infrastructure for the hybrid economy, the connective layer that helps East African SMEs and microbusinesses move past fragmented POS, spreadsheets, online tools, and manual reconciliation. We unify sales, inventory, staff, subscriptions, and local rails you already use (including M-Pesa and Airtel Money) in one operating model for transaction capture, reconciliation, inventory synchronization, and settlement visibility as you scale from one shop to multi branch and international markets. Rooted in Kenya and built for the cloud, we aim to be the trusted backbone for seamless commerce across emerging and global economies while eliminating revenue fragmentation with the rigor finance teams need from a single source of truth.',
      lead2: '',
      primaryCta: 'View pricing',
      secondaryCta: 'Book A Demo',
    },
    highlights: {
      eyebrow: 'Solutions & platform layers',
      title: 'Retail grade control today and commerce infrastructure for the hybrid economy tomorrow.',
      intro:
        'Many enterprises still run disconnected systems: online checkout, POS, and field devices in silos; finance juggling multiple ledgers; inventory that lags between channels. KDInsight solves that with one connected record, while keeping the fast, polished experience teams feel on the shop floor. Below you will find the operational capabilities customers use every day, followed by the four strategic pillars that describe how we unify physical, digital, and automated commerce with audit minded discipline.',
      items: [
        {
          title: 'Multibranch support',
          body:
            'Manage multiple stores, warehouses, and service locations from one command view, aligned with how modern retail chains need central policy, branch autonomy, and consistent stock logic. Ideal when you are tightening controls across outlets without losing local flexibility, and when leadership needs the same numbers in operations and finance.',
        },
        {
          title: 'Real time analytics',
          body:
            'Monitor sales, margins, inventory turns, and branch performance as events happen, not after month end close. Built for operators who want executive level visibility without exporting five spreadsheets, and for teams preparing to layer in deeper insights as you scale internationally.',
        },
        {
          title: 'Team Management',
          body:
            'Role based access for owners, admins, managers, and cashiers so permissions match responsibility. Reduces leakage, strengthens internal controls, and keeps branch staff productive with a clear separation of duties that auditors and growing compliance programs expect.',
        },
        {
          title: 'Custom Receipts',
          body:
            'Branded receipts with auto incrementing numbers and traceable transaction identity, important for customer trust, returns, and dispute resolution. Pairs cleanly with regulated or high volume retail environments where documentation discipline matters.',
        },
        {
          title: 'Mobile Money Support',
          body:
            'Accept M-Pesa, Airtel Money, and traditional payment options alongside your core workflows, part of our Mobility and Wallet Bridge perspective on African commerce. Designed for mobile money heavy operations where speed of settlement and clean handoffs to your records are non negotiable.',
        },
        {
          title: 'Secure & Reliable',
          body:
            'Encrypted storage, resilient cloud operation, and automated backups help protect the continuity of your business. Matches the expectations of serious retailers and distributors who cannot afford downtime or silent data loss during peak trading periods.',
        },
        {
          title: 'Daily Reports',
          body:
            'Automated summaries with breakdowns by payment method, branch, and key performance lines, so finance and owners start the day aligned. Reduces manual reconciliation load and supports the move toward continuous, event driven visibility across channels.',
        },
        {
          title: 'WhatsApp Integration',
          body:
            'Operational alerts and customer facing receipts over channels your teams already use, ideal for fast moving retail and field heavy businesses. Keeps distributed teams in sync when a sale, stock exception, or payment event needs immediate attention.',
        },
        {
          title: 'Payment Processing (Paystack)',
          body:
            'Subscription billing through Paystack for predictable revenue on the software side, while your in store and mobile money flows stay tied back to the same operating picture. Helps teams separate “platform subscription” from “commerce settlement” without losing coherence in reporting.',
        },
        {
          title: 'The Global Gateway (roadmap aligned)',
          body:
            'A merchant of record oriented layer for international digital sales: broader payment acceptance, VAT and GST style compliance workflows, fraud and risk controls, and multi currency settlement routing, so SaaS and digital exporters can expand without bolting on a patchwork of disconnected gateways.',
        },
        {
          title: 'The Smart Retail Suite',
          body:
            'An ERP minded POS ecosystem for modern retail and hospitality: multi store inventory synchronization, SKU and batch discipline, recipe and portion controls where F&B demands precision, and high volume transaction handling with branch level controls that reduce stock discrepancies and revenue leakage.',
        },
        {
          title: 'The Mobility & Wallet Bridge',
          body:
            'Wallet orchestration, peer to peer and agency style workflows where applicable, and disciplined handshakes between mobile money and bank API reconciliation, expanding payment accessibility and shortening local settlement cycles for businesses embedded in East Africa’s digital finance fabric.',
        },
        {
          title: 'The Unmanned Engine (IoT ready)',
          body:
            'Infrastructure thinking for unattended and embedded commerce: reliable device messaging patterns, telemetry and command control, tap to pay and automated billing flows, and offline tolerant event buffering so field devices sync cleanly, supporting vending, kiosks, parking, utilities, and other distributed networks as you grow into automated channels.',
        },
      ],
    },
    useCases: {
      eyebrow: 'Industries & segments',
      title: 'Versatile by design, from neighborhood shops to hybrid global operators.',
      lead:
        'KDInsight adapts to how you actually sell: traditional storefronts, hospitality, property and services workflows, wholesale motion, and the emerging blend of physical retail plus digital exports and unmanned endpoints. Mix and match capabilities as your model evolves; the same connected record travels with you.',
      cases: [
        {
          emoji: '🛍️',
          label: 'Retail & General Trade',
          detail:
            'Supermarkets, convenience stores, hardware shops, pharmacies, electronics dealers, and wholesale distributors serving walk in and B2B customers across one or many locations.',
          features: [
            'POS and barcode driven checkout with inventory discipline',
            'Branch aware stock alerts and transfers',
            'Central oversight without slowing frontline teams',
            'Receipts and payment method reporting finance can trust',
          ],
        },
        {
          emoji: '🍽️',
          label: 'Food & Beverage',
          detail:
            'Restaurants, cafés, fast food, juice bars, bakeries, and cloud kitchens balancing menu agility with kitchen and store stock accuracy.',
          features: [
            'Menu lifecycle with availability controls',
            'Kitchen and store consumption visibility',
            'Sell through from POS with portion aware logic',
            'Peak hour reliability for high transaction volumes',
          ],
        },
        {
          emoji: '🏨',
          label: 'Hospitality & Accommodation',
          detail:
            'Hotels, guesthouses, lodges, Airbnbs, and serviced apartments coordinating rooms, guest folios, and ancillary charges through checkout.',
          features: [
            'Room catalogs, rate structures, and booking flow support',
            'Guest tabs for food, drinks, and services',
            'Check in and check out friendly totals',
            'Clear handoff between front desk and finance review',
          ],
        },
        {
          emoji: '🏢',
          label: 'Property Management',
          detail:
            'Landlords and managers juggling leases, recurring rent, notices, and receipts across residential or commercial portfolios.',
          features: [
            'Property and unit inventory with lease tracking',
            'Rent recording with audit friendly history',
            'Tenant communications via email and WhatsApp where configured',
            'Operational rhythm that scales with more units',
          ],
        },
        {
          emoji: '💆',
          label: 'Services & Salons',
          detail:
            'Salons, barbershops, spas, auto garages, laundries, tailors, and job based businesses measuring time, materials, and outcomes.',
          features: [
            'Service catalogues with pricing variants',
            'Job and order workflow from quote to completion',
            'Flat, tiered, or time based billing patterns',
            'Status tracking managers and clients can understand',
          ],
        },
        {
          emoji: '📦',
          label: 'Wholesale & Distribution',
          detail:
            'Importers, distributors, and stockists coordinating inbound receipts, outbound issuance, and branch replenishment with minimal mystery shrink.',
          features: [
            'Supplier and GRN oriented intake',
            'Issuance, dispatch, and allocation visibility',
            'Low stock and exception signals before stockouts',
            'Reporting that ties movement to revenue',
          ],
        },
        {
          emoji: '🌐',
          label: 'SaaS & Tech Exporters',
          detail:
            'Companies selling digital products or subscriptions globally that need compliant cross border commerce, cleaner tax workflows, and payment resilience as you expand beyond your home market.',
          features: [
            'Strategic alignment with global gateway thinking',
            'Multi currency and settlement routing considerations',
            'Risk and fraud posture suitable for digital goods',
            'Same leadership dashboard ethic as your retail operations',
          ],
        },
        {
          emoji: '🤖',
          label: 'Smart Infrastructure & Unmanned Commerce',
          detail:
            'Operators running vending, laundry kiosks, parking, utility style metering, and other distributed device networks that must report reliably and reconcile automatically.',
          features: [
            'Device and event first mental model for field scale',
            'Buffering and sync patterns for imperfect connectivity',
            'Telemetry friendly operations mindset',
            'Path from pilot deployments to fleet governance',
          ],
        },
        {
          emoji: '🏬',
          label: 'Modern Regional Retail Networks',
          detail:
            'Pharmacy, supermarket, and specialty retail chains across East Africa that need real time inventory, centralized policy, and executive visibility without losing local execution quality.',
          features: [
            'Network wide SKU and pricing discipline',
            'Settlement visibility across busy mobile money lanes',
            'Inventory accuracy programs that reduce leakage',
            'Scaffolding for more automated channels over time',
          ],
        },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'Pay only for what you use',
      lead:
        'Branch based pricing keeps costs predictable as you grow. Paystack secures subscription checkout and receipts while your commerce data stays organized for reconciliation, whether you are tightening store operations today or layering in more channels tomorrow.',
      standard: {
        ribbon: 'Most popular',
        name: 'Standard Plan',
        price: 'KES 1,000',
        per: 'per branch per month',
        features: [
          'Unlimited products & transactions',
          'Real time inventory tracking',
          'Custom branded receipts',
          'Mobile money integration (M-Pesa, Airtel Money, and more)',
          'Daily email reports',
          'WhatsApp notifications',
          'Multi user access with role separation',
          '24/7 customer support',
          'Secure cloud storage',
          'Analytics dashboard',
          'One connected operating picture across branches for finance review',
        ],
        cta: 'Create Account',
      },
      plus: {
        ribbon: 'Waitlist open',
        name: 'KD Insight Plus',
        price: 'KES 2,000',
        per: 'per branch per month',
        features: [
          'Everything in Standard',
          'AI business intelligence insights (planned)',
          'Automated business day reports (planned)',
          'Morning report schedule options: 3 AM or 6 AM',
          'Priority early access when KD Insight Plus features launch',
        ],
        cta: 'Join KD Insight Plus Waitlist',
        note: 'Subscribe now to reserve your KD Insight Plus slot while these features are being finalized',
      },
      examplesTitle: 'Pricing Examples',
      examples: [
        { label: 'Standard (1 branch)', amount: 'KES 1,000 per month' },
        { label: 'Standard (3 branches)', amount: 'KES 3,000 per month' },
        { label: 'KD Insight Plus (3 branches)', amount: 'KES 6,000 per month' },
      ],
      paystackTitle: 'Paystack payments',
      paystackCopy:
        'Secure billing with Paystack checkout and receipts for Standard and KD Insight Plus, keeping subscription revenue clean while your commerce operations stay visible in one system.',
    },
    cta: {
      eyebrow: 'Begin',
      title: 'Ready for one platform, one source of truth, and total revenue visibility?',
      lead:
        'KDInsight is more than a payment add on or a standalone POS: it is the full stack operating layer that helps you reduce leakage, improve inventory accuracy, scale internationally without fragmenting compliance workflows, and run every channel as one intelligent system, starting with the East African retailers and operators we serve today.',
      primaryCta: 'Book A Demo',
      secondaryCta: 'Compare plans',
    },
  };
}

function mergeStrings(patch: string[] | undefined, def: string[]): string[] {
  if (!patch?.length) return [...def];
  return def.map((s, i) => (patch[i] !== undefined && patch[i] !== '' ? patch[i] : s));
}

export function normalizeHomepageContent(raw: unknown): HomepageContent {
  const d = getDefaultHomepageContent();
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Partial<HomepageContent>;

  const hlItems = d.highlights.items.map((item, i) => ({
    ...item,
    ...p.highlights?.items?.[i],
  }));

  const cases = d.useCases.cases.map((c, i) => {
    const pc = p.useCases?.cases?.[i];
    if (!pc) return c;
    return {
      ...c,
      ...pc,
      features: mergeStrings(pc.features, c.features),
    };
  });

  const stdFeatures = mergeStrings(p.pricing?.standard?.features, d.pricing.standard.features);
  const plusFeatures = mergeStrings(p.pricing?.plus?.features, d.pricing.plus.features);
  const examples = d.pricing.examples.map((ex, i) => ({
    ...ex,
    ...p.pricing?.examples?.[i],
  }));

  return {
    hero: { ...d.hero, ...p.hero },
    highlights: {
      ...d.highlights,
      ...p.highlights,
      items: hlItems,
    },
    useCases: {
      ...d.useCases,
      ...p.useCases,
      cases,
    },
    pricing: {
      ...d.pricing,
      ...p.pricing,
      standard: {
        ...d.pricing.standard,
        ...p.pricing?.standard,
        features: stdFeatures,
      },
      plus: {
        ...d.pricing.plus,
        ...p.pricing?.plus,
        features: plusFeatures,
        note: p.pricing?.plus?.note ?? d.pricing.plus.note,
      },
      examples,
      paystackTitle: p.pricing?.paystackTitle ?? d.pricing.paystackTitle,
      paystackCopy: p.pricing?.paystackCopy ?? d.pricing.paystackCopy,
    },
    cta: { ...d.cta, ...p.cta },
  };
}

export function loadHomepageContentFromStorage(): Partial<HomepageContent> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(HOMEPAGE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<HomepageContent>;
  } catch {
    return null;
  }
}

export function saveHomepageContentToStorage(content: HomepageContent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(content));
}

export function clearHomepageContentStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HOMEPAGE_STORAGE_KEY);
}

export function dispatchHomepageUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('kdinsight-homepage-updated'));
}
