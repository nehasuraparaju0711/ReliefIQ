'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings,
  User,
  Globe,
  Bell,
  CheckCircle2,
  Database,
  Shield,
  Smartphone,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, role, switchRole } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Dr. Ramesh Chandra IAS');
  const [email, setEmail] = useState(user?.email || 'collector.krishna@ap.gov.in');
  const [organization, setOrganization] = useState(
    user?.organization || 'District Disaster Management Authority (DDMA), Krishna'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'TE' | 'HI'>('EN');

  // Notification toggles
  const [criticalSmsAlerts, setCriticalSmsAlerts] = useState(true);
  const [floodGaugeAlerts, setFloodGaugeAlerts] = useState(true);
  const [citizenReportAlerts, setCitizenReportAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System &amp; Responder Preferences
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-lavender text-pastel-lavender-dark border border-pastel-lavender-border">
            Profile Settings
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure notification dispatch channels, regional language display, and responder clearance profile.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Preferences updated and saved to local administrative store.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Responder Clearance Profile Card */}
        <Card className="p-6 bg-white/90 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-slate-800">Responder Profile &amp; Clearance</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Officer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Official Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Input
            label="Administrative Organization / Department"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-800 capitalize">
                Assigned Role: {role?.replace('_', ' ')}
              </p>
              <p className="text-[11px] text-slate-500">
                Determines approval rights, dispatch control, and predictive simulation clearance.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-pastel-mint text-emerald-800 font-bold text-[10px]">
              Verified
            </span>
          </div>
        </Card>

        {/* Regional Language Preferences */}
        <Card className="p-6 bg-white/90 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Language &amp; Regional Localization (i18n)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedLanguage('EN')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLanguage === 'EN'
                  ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold text-slate-800">English (India)</p>
              <p className="text-[11px] text-slate-500 mt-1">Default administrative mode</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedLanguage('TE')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLanguage === 'TE'
                  ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold text-slate-800">తెలుగు (Telugu)</p>
              <p className="text-[11px] text-slate-500 mt-1">ఆంధ్రప్రదేశ్ అధికార భాష</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedLanguage('HI')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLanguage === 'HI'
                  ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold text-slate-800">हिन्दी (Hindi)</p>
              <p className="text-[11px] text-slate-500 mt-1">राष्ट्रीय आपदा प्रतिक्रिया</p>
            </button>
          </div>
        </Card>

        {/* Emergency Notification Dispatch Channels */}
        <Card className="p-6 bg-white/90 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-primary-600" />
            <h3 className="text-sm font-bold text-slate-800">Emergency Alert Notifications</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer border border-slate-200 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">Critical Red Alert SMS Broadcast</p>
                <p className="text-[11px] text-slate-500">
                  Instant SMS dispatch for imminent flood breaches (&gt; 80 Risk Score).
                </p>
              </div>
              <input
                type="checkbox"
                checked={criticalSmsAlerts}
                onChange={(e) => setCriticalSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer border border-slate-200 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">River &amp; Barrage Outflow Sensor Pushes</p>
                <p className="text-[11px] text-slate-500">
                  Notify when Prakasam Barrage discharge exceeds 6.0 Lakh Cusecs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={floodGaugeAlerts}
                onChange={(e) => setFloodGaugeAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer border border-slate-200 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-800">Citizen &amp; Volunteer Field Reports</p>
                <p className="text-[11px] text-slate-500">
                  Live notifications when emergency community incidents are filed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={citizenReportAlerts}
                onChange={(e) => setCitizenReportAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </Card>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" className="shadow-soft gap-2 font-bold">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
