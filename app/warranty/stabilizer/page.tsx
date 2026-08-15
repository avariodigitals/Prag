export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType, getAdminContentSections } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'Stabilizer Warranty',
  alternates: { canonical: 'https://shop.prag.global/warranty/stabilizer' },
};

const FALLBACK_SECTIONS = [
  {
    heading: 'Overview',
    body: (
      <p>
        PRAG provides One-Year warranty from date of purchase on all PRAG stabilizers
        installed by us and our AUTHORISED distributors. Faults due to voltage surge,
        wrong/self-installation, malicious damage, and negligence due to the customer are not
        covered by warranty and cost of repairs/replacement will be charged separately.
        Warranty only applies when products are used according to the specifications mentioned
        herein.
      </p>
    ),
  },
  {
    heading: 'Warranty Terms',
    body: (
      <ol className="list-decimal pl-5 flex flex-col gap-2">
        <li>
          If, within the warranty period the PRAG stabilizer was installed and operated in
          accordance with Pragmatic Technologies standards and procedures, then the Company
          will, at its cost (subject to the terms of this document), correct any defects on the
          product or workmanship.
        </li>
        <li>
          If the product has been modified, recalibrated, repaired, opened or tampered with in
          any way by the customer, then this warranty will not apply.
        </li>
        <li>
          If the product has been damaged during transportation by the customer, then this
          warranty will not apply.
        </li>
        <li>
          Product failures due to fire, earthquake, humidity, flood, direct lightning strike,
          terrorism, pollution, exposure to poisonous gas and abnormal utility voltage are
          not covered under this warranty.
        </li>
        <li>
          Unless otherwise specified in this document, the product must be returned to
          Pragmatic Technologies Service Center at the customer&apos;s cost in the event of a
          claim under this warranty.
        </li>
        <li>
          If Pragmatic Technologies, at its sole discretion, determines that the conditions of
          this document have been met and the product has failed as a result of an event
          described in item (1), the Company will, at its cost, return the customer to
          subsisting condition(s) prior to the warranty claim.
        </li>
        <li>
          If the product failed due to reasons that Pragmatic Technologies, after
          inspection, determines to be outside of the conditions set out in this warranty
          document or is found to be not faulty, then a minimum inspection fee of ₦2,500.00
          (Two Thousand Five Hundred Naira Only) will be charged. In case of disconnection of
          the product for repairs or replacement, the customer will be responsible for
          transportation to and from the Service Center.
        </li>
        <li>
          Blown fuses/brushes are usually as a result of overload and are not considered to be
          a fault to which item (1) of this document applies. If it is determined that the
          product failed due to a blown fuse, a handling and inspection charge will apply as
          above and transportation costs will be borne by the customer as detailed in (7)
          above.
        </li>
      </ol>
    ),
  },
  {
    heading: 'Proper Usage of Stabilizer to Ensure Long Life',
    body: (
      <ol className="list-decimal pl-5 flex flex-col gap-2">
        <li>
          <strong>Load under Normal Voltage (200V – 240V):</strong> Load on the Prag
          Stabilizer must not exceed 70% of the rated capacity of the Stabilizer. This is
          recommended when the utility supply is above 200V AC.
        </li>
        <li>
          <strong>Load under Low Voltage (140V – 180V) – Servo Model:</strong> Load on the
          Prag Stabilizer must not exceed 50% of the rated capacity of the Stabilizer. This is
          recommended when the utility supply is below 180V AC.
        </li>
        <li>
          <strong>Load under Low Voltage (100V – 150V) – Relay Model:</strong> Load on the Prag
          Stabilizer must not exceed 50% of the rated capacity of the Stabilizer. This is
          recommended when the utility supply is below 150V AC.
        </li>
        <li>
          Please keep your Stabilizer in a well-ventilated environment.
        </li>
      </ol>
    ),
  },
  {
    heading: 'Service Centers',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          All defective products should be returned to our designated Service Centers in
          Lagos, Port-Harcourt and Abuja.
        </p>
        <p>
          <strong>Service Hotlines:</strong>
          <br />
          Lagos –{' '}
          <a href="tel:07036463977" className="text-sky-700 hover:underline">
            0703 646 3977
          </a>
          <br />
          Port-Harcourt –{' '}
          <a href="tel:08166258106" className="text-sky-700 hover:underline">
            0816 625 8106
          </a>
          <br />
          Abuja –{' '}
          <a href="tel:08081010747" className="text-sky-700 hover:underline">
            0808 101 0747
          </a>
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Lagos: 4, Obanikoro Street off Ikorodu Road, Obanikoro</li>
          <li>
            Port Harcourt: 18, Ezimgbu Link Road GRA Phase IV, Mopol 19, Mummy B By-Pass
          </li>
          <li>
            Abuja: Shop 6, Duplex Shops, Block 5, Section 5 (Beside Daviva), Garki II
            Ultra-Modern Market
          </li>
        </ul>
        <p>Monday to Friday, 9am to 5pm.</p>
        <p>
          e-Mail:{' '}
          <a href="mailto:pragobanikoro@prag.global" className="text-sky-700 hover:underline">
            pragobanikoro@prag.global
          </a>
        </p>
      </div>
    ),
  },
  {
    heading: 'Other Warranty Categories',
    body: (
      <div className="flex flex-wrap gap-3">
        <Link href="/warranty/inverter" className="text-sky-700 hover:underline">
          Inverter Warranty
        </Link>
        <span className="text-zinc-400">|</span>
        <Link href="/warranty/solar" className="text-sky-700 hover:underline">
          Solar Warranty
        </Link>
        <span className="text-zinc-400">|</span>
        <Link href="/warranty/battery" className="text-sky-700 hover:underline">
          Battery Warranty
        </Link>
      </div>
    ),
  },
];

export default async function StabilizerWarrantyPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/warranty/stabilizer');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const heroTitle = heroSection?.summary || 'Stabilizer Warranty';
  const adminSections = getAdminContentSections(page);

  return (
    <PolicyPageLayout
      title={heroTitle}
      sections={adminSections ?? FALLBACK_SECTIONS}
    />
  );
}
