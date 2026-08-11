export interface RedirectEntry {
  source: string;
  destination: string;
}

export const LEGACY_REDIRECTS: RedirectEntry[] = [
  { source: '/inverter-warranty', destination: '/warranty/inverter' },
  { source: '/battery-warranty', destination: '/warranty/battery' },
  { source: '/solar-warranty', destination: '/warranty/solar' },
  { source: '/stabilizer-warranty', destination: '/warranty/stabilizer' },
  { source: '/stabilizer', destination: '/products/voltage-stabilizers' },
  { source: '/products/all-prag-stabilizers', destination: '/products/voltage-stabilizers' },
  { source: '/inverter', destination: '/products/inverters' },
  { source: '/solar', destination: '/products/solar' },
  { source: '/batteries', destination: '/products/batteries' },
];
