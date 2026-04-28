'use client';

import { useState } from 'react';
import { Pencil, User } from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors";

export default function PersonalInfoPage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="w-[941px] p-11 bg-white rounded-[20px] outline outline-1 outline-zinc-100 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">Personal Information</h2>
        <button onClick={() => setEditing(!editing)}
          className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-zinc-500 flex items-center gap-2 hover:outline-sky-700 hover:text-sky-700 transition-colors">
          <span className="text-zinc-500 text-sm font-medium font-['Space_Grotesk'] leading-5">{editing ? 'Save' : 'Edit'}</span>
          <Pencil className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Avatar */}
      <div className="relative inline-flex items-center gap-5">
        <div className="relative w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center outline outline-1 outline-slate-200">
          <User className="w-12 h-12 text-slate-400" />
          <button className="absolute bottom-0 right-0 w-7 h-7 p-1.5 bg-white rounded-full shadow flex items-center justify-center">
            <Pencil className="w-4 h-4 text-sky-700" />
          </button>
        </div>
      </div>

      {/* Contact fields */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">First Name</label>
            <input type="text" defaultValue="" disabled={!editing} placeholder="John" className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Last Name</label>
            <input type="text" defaultValue="" disabled={!editing} placeholder="Doe" className={inputCls} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Email Address</label>
          <input type="email" defaultValue="" disabled={!editing} placeholder="you@company.com" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Phone Number</label>
          <input type="tel" defaultValue="" disabled={!editing} placeholder="+234..." className={inputCls} />
        </div>
      </div>

      {/* Shipping address */}
      <h3 className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">Shipping Address</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Street Address</label>
          <input type="text" defaultValue="" disabled={!editing} placeholder="Address" className={inputCls} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">City</label>
            <input type="text" defaultValue="" disabled={!editing} placeholder="City" className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">State / Region</label>
            <select disabled={!editing} className={inputCls}>
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">ZIP / Postal Code</label>
            <input type="text" defaultValue="" disabled={!editing} placeholder="100001" className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Country</label>
            <input type="text" defaultValue="Nigeria" disabled className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}
