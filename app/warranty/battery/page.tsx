export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType, getAdminContentSections } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'Lithium Battery Warranty',
  alternates: { canonical: 'https://shop.prag.global/warranty/battery' },
};

const FALLBACK_SECTIONS = [
  {
    heading: 'Overview',
    body: (
      <p>
        PRAG provides five or ten-year warranty on all Lithium batteries installed by PRAG or
        its Authorized Distributors. Our Lithium batteries are built to the highest industry
        standards, designed for longevity and superior performance when used correctly. PRAG
        shall not be held responsible for improper battery usage or failure to comply with the
        provided specifications.
      </p>
    ),
  },
  {
    heading: 'Warranty Coverage',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          The warranty applies only when the batteries are used in accordance with the
          specifications outlined below:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <strong>Inverter:</strong> The specification of the inverter must be one that has
            the capacity to charge the batteries efficiently. It must be either an inverter
            that can communicate well with the battery BMS or an inverter that has a
            &ldquo;battery type settings&rdquo; feature embedded in it.
          </li>
          <li>
            <strong>Environment:</strong> The lithium battery must be installed in a
            well-ventilated space.
          </li>
          <li>
            <strong>Installation:</strong> Lithium batteries must be installed with the
            right inverter, cables, and other installation kits.
          </li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Application-Specific Warranty',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>
          <strong>Condition of Returned Batteries:</strong> Batteries must be returned in
          their original condition, without tampering or physical damage.
        </li>
        <li>
          <strong>Proration of Warranty:</strong> In the event of battery failure within the
          warranty period, a prorated refund will be issued. If a battery is found to be
          defective and cannot be repaired, the customer is entitled to a refund for the
          unused portion of the warranty period.
        </li>
        <li>
          <strong>Battery Retrieval:</strong> Batteries replaced or refunded under the
          proration terms become the property of PRAG.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Warranty Voidance',
    body: (
      <div className="flex flex-col gap-2">
        <p>This warranty will be voided if the batteries are:</p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>Transferred to any party other than the original purchaser.</li>
          <li>
            Used in applications other than inverters or for loads not specified during
            installation.
          </li>
        </ol>
      </div>
    ),
  },
  {
    heading: 'Warranty Exclusions',
    body: (
      <div className="flex flex-col gap-2">
        <p>The warranty does not cover the following:</p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            <strong>External Causes:</strong> Damages resulting from accidents, fire, natural
            disasters (e.g., earthquakes, floods), or other external factors beyond
            PRAG&apos;s control.
          </li>
          <li>
            <strong>Improper Use:</strong> Damage caused by faulty electrical systems,
            improper maintenance, incorrect charging, mishandling, or unauthorized
            repair/servicing by third parties.
          </li>
          <li>
            <strong>Physical Damage:</strong> Breakage of the container, cover, or terminals
            due to mechanical shock, hammering, or impact.
          </li>
          <li>
            <strong>Recharging:</strong> Recharging costs are not covered under this warranty.
          </li>
          <li>
            <strong>Extreme Conditions:</strong> Exposure to excessive heat or cold
            temperatures.
          </li>
        </ol>
      </div>
    ),
  },
  {
    heading: 'Proof of Purchase',
    body: (
      <p>
        Warranty claims must be accompanied by the original invoice, receipt, and delivery
        note. Claims without these documents will not be processed.
      </p>
    ),
  },
  {
    heading: 'Proper Usage Guidelines to Ensure Long Battery Life',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>
          <strong>Load Management:</strong> Minimize the load on the inverter to extend
          battery life. It is recommended not to exceed 40% of the inverter&apos;s maximum
          rated capacity.
        </li>
        <li>
          <strong>Avoid Mixing Battery Brands:</strong> Do not mix different brands of Lithium
          batteries, as this will significantly shorten the life of the battery set.
          Similarly, new batteries can only be added when only about 800 cycles of the old
          batteries have been used. Batteries in a set are to be replaced at the same time to
          maintain performance and longevity.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Notes',
    body: (
      <p>
        Backup time or autonomy decreases over time with battery usage. The battery life
        cycle depends on factors such as charge/discharge frequency, depth of discharge,
        charging quality, and general usage conditions.
      </p>
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
        <Link href="/warranty/stabilizer" className="text-sky-700 hover:underline">
          Stabilizer Warranty
        </Link>
        <span className="text-zinc-400">|</span>
        <Link href="/warranty/solar" className="text-sky-700 hover:underline">
          Solar Warranty
        </Link>
      </div>
    ),
  },
];

export default async function BatteryWarrantyPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/warranty/battery');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const heroTitle = heroSection?.summary || 'Lithium Battery Warranty';
  const adminSections = getAdminContentSections(page);

  return (
    <PolicyPageLayout
      title={heroTitle}
      sections={adminSections ?? FALLBACK_SECTIONS}
    />
  );
}
