'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ReliefIQ prevent algorithmic bias in crisis resource allocation?',
      a: 'ReliefIQ implements an explicit fairness cap (e.g. max 35% of any resource inventory allocated to a single zone) combined with a Gini inequality penalty. Even if an affluent urban zone has high demand, marginalized habitations and rural fishing thandas with high vulnerability indices are guaranteed baseline relief quotas.',
    },
    {
      q: 'Can District Magistrates override the AI recommendations?',
      a: 'Yes, absolutely. ReliefIQ is strictly a decision-support system. District Collectors and NGO leads can manually drag-and-drop quantities, adjust priority weights, or reassign dispatch depots before approving. The system provides real-time impact deltas (e.g., changes to people covered and response time) as adjustments are made.',
    },
    {
      q: 'How can this system operate during cellular network or power failure?',
      a: 'ReliefIQ is designed offline-first for field personnel. Volunteer task lists and community report forms cache data locally in IndexedDB / service workers. Once a device re-enters cellular range or links to a satellite HAM radio terminal, local queues synchronize seamlessly.',
    },
    {
      q: 'How is the risk score calculated for each zone?',
      a: 'Our transparent model assesses meteorological inputs (rainfall rate, peak wind speeds, ambient temperature), hydrological markers (river discharge, reservoir outflow), and topographic vulnerability (elevation, drainage capacity, density of kutcha housing). Each factor provides a plain-English SHAP contribution percentage.',
    },
    {
      q: 'How can our disaster authority or state DDMA integrate with ReliefIQ?',
      a: 'ReliefIQ exposes clean RESTful and GeoJSON API endpoints. It can ingest live telemetry from Indian Meteorological Department (IMD) APIs, Central Water Commission (CWC) gauge sensors, and National Disaster Management Authority (NDMA) incident databases without modifying existing emergency dispatch hardware.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-primary-600" />
          Frequently Asked Questions
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need to Know About ReliefIQ
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Architecture, ethical safeguards, and deployment guidelines for crisis responders.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              className="bg-white/85 border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 select-none"
              >
                <span className="text-sm sm:text-base font-bold text-slate-800">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-primary-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
