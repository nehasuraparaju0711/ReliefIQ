'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Report, Severity, Zone } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { SEED_ZONES } from '@/lib/seed/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { RiskBadge } from '@/components/ui/Badge';
import {
  FileText,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Image as ImageIcon,
  AlertTriangle,
  Search,
} from 'lucide-react';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const shouldOpenNew = searchParams.get('new') === 'true';

  const [reports, setReports] = useState<Report[]>([]);
  const [zones, setZones] = useState<Zone[]>(SEED_ZONES);
  const [isModalOpen, setIsModalOpen] = useState(shouldOpenNew);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [type, setType] = useState<Report['type']>('flood_inundation');
  const [zoneId, setZoneId] = useState<string>('zone-4');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<Severity>('critical');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('P. Ramesh');
  const [reporterPhone, setReporterPhone] = useState('+91 98480 12345');
  const [imageUrl, setImageUrl] = useState('');

  const fetchReports = async () => {
    try {
      const data = await apiClient.getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const reportTypeLabels: Record<Report['type'], string> = {
    flood_inundation: 'Flood Inundation & Trapped Persons',
    drinking_water_scarcity: 'Drinking Water Scarcity / Contamination',
    food_shortage: 'Dry Food / Ration Shortage in Shelter',
    medical_emergency: 'Medical Emergency & Snakebite',
    shelter_damaged: 'Shelter Damaged / Tin Roof Blown',
    power_road_blocked: 'Road Blocked / Submerged Causeway',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const zone = zones.find((z) => z.id === zoneId) || zones[0];
      const newRep = await apiClient.createReport({
        type,
        typeLabel: reportTypeLabels[type],
        zoneId,
        zoneName: zone.name,
        location,
        coordinates: zone.geometry.coordinates,
        urgency,
        description,
        reporterName,
        reporterPhone,
        imageUrl: imageUrl || undefined,
      });

      setReports((prev) => [newRep, ...prev]);
      setIsModalOpen(false);
      setSuccessMsg(`Incident #${newRep.id} successfully registered and posted to live dashboard feed.`);
      setTimeout(() => setSuccessMsg(null), 6000);

      // Reset form
      setLocation('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.zoneName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Community Incident Reports
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-butter text-pastel-butter-dark border border-pastel-butter-border">
              {reports.length} Filed Telemetries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Crowdsourced and volunteer field incident reports synced directly with spatial map and triage queue.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="shadow-soft gap-1.5 font-bold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File Emergency Incident</span>
        </Button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by location, village, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="action_assigned">Action Assigned</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            className="p-5 bg-white/90 border-slate-200/90 shadow-sm hover:shadow-md transition-all rounded-[22px] flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <RiskBadge severity={report.urgency} size="sm" />
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    report.status === 'resolved'
                      ? 'bg-pastel-mint text-emerald-800'
                      : report.status === 'action_assigned'
                      ? 'bg-pastel-sky text-sky-800'
                      : 'bg-pastel-butter text-amber-800'
                  }`}
                >
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {report.typeLabel}
                </h3>
                <p className="text-xs text-primary-700 font-semibold mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{report.location}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">{report.zoneName}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {report.description}
              </p>

              {/* Optional Photo Image */}
              {report.imageUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-100 mt-2">
                  <img
                    src={report.imageUrl}
                    alt="Field incident preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <User className="w-3 h-3 text-slate-400" />
                <span>{report.reporterName}</span>
              </span>
              <span>{report.createdAt}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Incident Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File Field Incident Report"
        description="Information will appear immediately on district dashboards and alerts feed."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Incident Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Nature / Need Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Report['type'])}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(reportTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Mandal Selection & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mandal Administrative Zone
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Severity)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="critical">Critical (Immediate Danger)</option>
                <option value="high">High (Urgent Attention)</option>
                <option value="medium">Medium (Moderate Need)</option>
                <option value="low">Low (Advisory)</option>
              </select>
            </div>
          </div>

          {/* Specific Location Landmark */}
          <Input
            label="Specific Village / Colony / Landmark"
            placeholder="e.g. Near Nagayalanka Jetty, Bhavani Island Hamlet"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Details &amp; Human Situation
            </label>
            <textarea
              rows={3}
              placeholder="Describe flood depth, stranded population, immediate needs (boats, potable water, milk formula)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Reporter Name"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="shadow-soft font-bold"
            >
              Broadcast Incident Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
