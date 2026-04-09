export type DemoUseCaseSeed = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  priceCents: number;
  sortOrder: number;
};

export const DEFAULT_DEMO_USE_CASES: DemoUseCaseSeed[] = [
  {
    slug: 'retail-general-trade',
    title: 'Retail & General Trade',
    summary:
      'Supermarkets, convenience stores, hardware shops, pharmacies, electronics dealers, and wholesale distributors serving walk in and B2B customers across one or many locations.\nPOS and barcode driven checkout with inventory discipline\nBranch aware stock alerts and transfers\nCentral oversight without slowing frontline teams\nReceipts and payment method reporting finance can trust',
    category: 'Retail',
    priceCents: 12500,
    sortOrder: 10,
  },
  {
    slug: 'food-beverage',
    title: 'Food & Beverage',
    summary:
      'Restaurants, cafes, fast food, juice bars, bakeries, and cloud kitchens balancing menu agility with kitchen and store stock accuracy.\nMenu lifecycle with availability controls\nKitchen and store consumption visibility\nSell through from POS with portion aware logic\nPeak hour reliability for high transaction volumes',
    category: 'F&B',
    priceCents: 10800,
    sortOrder: 20,
  },
  {
    slug: 'hospitality-accommodation',
    title: 'Hospitality & Accommodation',
    summary:
      'Hotels, guesthouses, lodges, Airbnbs, and serviced apartments coordinating rooms, guest folios, and ancillary charges through checkout.\nRoom catalogs, rate structures, and booking flow support\nGuest tabs for food, drinks, and services\nCheck in and check out friendly totals\nClear handoff between front desk and finance review',
    category: 'Hospitality',
    priceCents: 11800,
    sortOrder: 30,
  },
  {
    slug: 'property-management',
    title: 'Property Management',
    summary:
      'Landlords and managers juggling leases, recurring rent, notices, and receipts across residential or commercial portfolios.\nProperty and unit inventory with lease tracking\nRent recording with audit friendly history\nTenant communications via email and WhatsApp where configured\nOperational rhythm that scales with more units',
    category: 'Property',
    priceCents: 9800,
    sortOrder: 40,
  },
  {
    slug: 'services-salons',
    title: 'Services & Salons',
    summary:
      'Salons, barbershops, spas, auto garages, laundries, tailors, and job based businesses measuring time, materials, and outcomes.\nService catalogues with pricing variants\nJob and order workflow from quote to completion\nFlat, tiered, or time based billing patterns\nStatus tracking managers and clients can understand',
    category: 'Services',
    priceCents: 8600,
    sortOrder: 50,
  },
  {
    slug: 'wholesale-distribution',
    title: 'Wholesale & Distribution',
    summary:
      'Importers, distributors, and stockists coordinating inbound receipts, outbound issuance, and branch replenishment with minimal mystery shrink.\nSupplier and GRN oriented intake\nIssuance, dispatch, and allocation visibility\nLow stock and exception signals before stockouts\nReporting that ties movement to revenue',
    category: 'Distribution',
    priceCents: 10900,
    sortOrder: 60,
  },
  {
    slug: 'saas-tech-exporters',
    title: 'SaaS & Tech Exporters',
    summary:
      'Companies selling digital products or subscriptions globally that need compliant cross border commerce, cleaner tax workflows, and payment resilience as you expand beyond your home market.\nStrategic alignment with global gateway thinking\nMulti currency and settlement routing considerations\nRisk and fraud posture suitable for digital goods\nSame leadership dashboard ethic as your retail operations',
    category: 'SaaS',
    priceCents: 11500,
    sortOrder: 70,
  },
  {
    slug: 'smart-infrastructure-unmanned-commerce',
    title: 'Smart Infrastructure & Unmanned Commerce',
    summary:
      'Operators running vending, laundry kiosks, parking, utility style metering, and other distributed device networks that must report reliably and reconcile automatically.\nDevice and event first mental model for field scale\nBuffering and sync patterns for imperfect connectivity\nTelemetry friendly operations mindset\nPath from pilot deployments to fleet governance',
    category: 'Infrastructure',
    priceCents: 13200,
    sortOrder: 80,
  },
  {
    slug: 'modern-regional-retail-networks',
    title: 'Modern Regional Retail Networks',
    summary:
      'Pharmacy, supermarket, and specialty retail chains across East Africa that need real time inventory, centralized policy, and executive visibility without losing local execution quality.\nNetwork wide SKU and pricing discipline\nSettlement visibility across busy mobile money lanes\nInventory accuracy programs that reduce leakage\nScaffolding for more automated channels over time',
    category: 'Enterprise Retail',
    priceCents: 14500,
    sortOrder: 90,
  },
];

export function formatKes(cents: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
