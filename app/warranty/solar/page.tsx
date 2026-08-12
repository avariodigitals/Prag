import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType, getAdminContentSections } from '@/lib/b2cContent';

export const metadata: Metadata = {
  title: 'Solar Warranty',
  alternates: { canonical: 'https://shop.prag.global/warranty/solar' },
};

const FALLBACK_SECTIONS = [
  {
    heading: 'Overview',
    body: (
      <p>
        PRAG provides Five-Years warranty on all PRAG Solar Panels installed by us and our
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
        <li>The solar panels must be transported back in original or equivalent packaging.</li>
        <li>
          The solar panels warranty does not cover transportation charges, cost on returning
          the panels, installation, removal or reinstallation of the solar panels.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Warranty Claims: Conditions',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          In claiming warranty, customer must bring along the invoice of purchase, receipt,
          dated filled and signed warranty card or delivery notes.
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
        The warranty shall only be applicable to the solar panels clearly identified by the
        serial number. Other installation accessories shall not be covered by warranty.
      </p>
    ),
  },
  {
    heading: 'Exceptions',
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1.5">
        <li>
          Failure to comply with the operating instructions, the installation guide and the
          maintenance instructions.
        </li>
        <li>Faulty installation of the device.</li>
        <li>Faulty start-up of the device.</li>
        <li>Damage during the transportation of the device by customer.</li>
        <li>Improper use or misuse of the device.</li>
        <li>Interference with the device by a third party not assigned by the Company.</li>
        <li>
          FORCE MAJEURE (violent, humid environment or stormy weather, lightning, overvoltage,
          fire, power failure surges, flood, accidental breakage or other events outside
          manufacturer&apos;s control, etc.).
        </li>
        <li>
          In the event of visit for Fault/Service/Repairs (FSR) by Company&apos;s Technician, a
          callout charge of ₦2,500.00 (Two Thousand Five Hundred Naira only) will be paid by
          the customer.
        </li>
      </ul>
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
        <Link href="/warranty/stabilizer" className="text-sky-700 hover:underline">
          Stabilizer Warranty
        </Link>
        <span className="text-zinc-400">|</span>
        <Link href="/warranty/battery" className="text-sky-700 hover:underline">
          Battery Warranty
        </Link>
      </div>
    ),
  },
];

export default async function SolarWarrantyPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/warranty/solar');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const heroTitle = heroSection?.summary || 'Solar Warranty';
  const adminSections = getAdminContentSections(page);

  return (
    <PolicyPageLayout
      title={heroTitle}
      sections={adminSections ?? FALLBACK_SECTIONS}
    />
  );
}
