export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType, getAdminContentSections } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'Inverter Warranty',
  alternates: { canonical: 'https://shop.prag.global/warranty/inverter' },
};

const FALLBACK_SECTIONS = [
  {
    heading: 'Overview',
    body: (
      <p>
        PRAG provides One-Year warranty on all PRAG inverters installed by us and our
        AUTHORISED distributors. Faults due to voltage surge, wrong/self-installation,
        malicious damage, and negligence due to the customer are not covered by warranty and
        cost of repairs/replacement will be charged separately. Warranty only applies when
        products are deployed and used according to the specifications mentioned herein.
      </p>
    ),
  },
  {
    heading: 'Service During the Warranty Period',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>Repair the defect(s) at the premises of Pragmatic Technologies or on site; or</li>
        <li>
          Provide equivalent replacement (used, repaired, re-engineered and tested) or a new
          device.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Transportation',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          Customer shall be responsible for the transportation of the inverter to the
          Company&apos;s Head Office situated at #4 Obanikoro Street, off Ikorodu Road, Via
          Falemi Building, Obanikoro, Lagos.
        </li>
        <li>The inverters must be transported back in original or equivalent packaging.</li>
      </ul>
    ),
  },
  {
    heading: 'Warranty Claims: Conditions',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          In claiming warranty, customer must bring along the invoice of purchase, receipt or
          delivery notes.
        </li>
        <li>The serial number of the device must not be removed or cleaned off.</li>
        <li>
          Any action taken in connection with warranty claims must be coordinated with
          Pragmatic Technologies.
        </li>
        <li>
          In the event of replacement of a device, the remaining warranty period shall not
          exceed the subsisting period.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Scope and Validity',
    body: (
      <p>
        The warranty shall only be applicable to the inverter clearly identified by the serial
        number. Other installation accessories (Control Box, DC &amp; AC cables) shall not be
        covered by warranty.
      </p>
    ),
  },
  {
    heading: 'Exceptions',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          Failure to comply with the load estimate, operating instructions, the installation
          guide and the maintenance instructions.
        </li>
        <li>Faulty installation of the device.</li>
        <li>Faulty start-up of the device.</li>
        <li>Damage during the transportation of the device by customer.</li>
        <li>Improper use or misuse of the device.</li>
        <li>Insufficient ventilation of the installation area/space of the device.</li>
        <li>Interference with the device by a third party not assigned by the Company.</li>
        <li>
          FORCE MAJEURE (violent, humid environment or stormy weather, lightning, overvoltage,
          fire, etc.).
        </li>
        <li>
          In the event of visit for Fault/Service/Repairs (FSR) by Company&apos;s Technician, a
          callout charge of ₦2,500.00 (Two Thousand Five Hundred Naira only) will be paid by
          the customer.
        </li>
        <li>
          Pragmatic Technologies will not be liable for compensation claims arising from
          poorly calibrated power input sources into the device during change of generators
          or mains supplies.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Charging With Generator',
    body: (
      <p>
        When public power supply (NEPA/PHCN) is not available, kindly ensure you use the
        right type of generator to charge. Please refer to your inverter manual or contact our
        support team for the appropriate generator capacity for your inverter model.
      </p>
    ),
  },
  {
    heading: 'Service Centers',
    body: (
      <div className="flex flex-col gap-3">
        <p>
          All defective products should be returned to our designated service centers in
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
        <Link href="/warranty/stabilizer" className="text-sky-700 hover:underline">
          Stabilizer Warranty
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

export default async function InverterWarrantyPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/warranty/inverter');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const heroTitle = heroSection?.summary || 'Inverter Warranty';
  const adminSections = getAdminContentSections(page);

  return (
    <PolicyPageLayout
      title={heroTitle}
      sections={adminSections ?? FALLBACK_SECTIONS}
    />
  );
}
