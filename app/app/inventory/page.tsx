'use client';

import React, { useState, useEffect } from 'react';
import { Resource, Warehouse } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Warehouse as WarehouseIcon,
  Phone,
  User,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function InventoryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Restock modal state
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState<string>('');
  const [restockQty, setRestockQty] = useState<number>(5000);
  const [isSubmittingRestock, setIsSubmittingRestock] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getInventory();
      setResources(data.resources);
      setWarehouses(data.warehouses as Warehouse[]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRestock = (resourceId?: string) => {
    if (resourceId) setSelectedResId(resourceId);
    else if (resources.length > 0) setSelectedResId(resources[0].id);
    setIsRestockOpen(true);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || restockQty <= 0) return;

    setIsSubmittingRestock(true);
    try {
      await apiClient.requestRestock(selectedResId, restockQty);
      const resItem = resources.find((r) => r.id === selectedResId);
      setSuccessNotice(`Restock procurement order for ${formatNumber(restockQty)} ${resItem?.unit || 'units'} submitted to State Emergency Logistics.`);
      setIsRestockOpen(false);
      loadData();
      setTimeout(() => setSuccessNotice(null), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRestock(false);
    }
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse =
      warehouseFilter === 'all' || res.warehouseId === warehouseFilter;
    const isLow = res.totalAvailable <= res.minThreshold * 1.5;
    const matchesLowStock = !lowStockOnly || isLow;

    return matchesSearch && matchesWarehouse && matchesLowStock;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Warehouse Inventory &amp; Stock Levels
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border">
              3 Strategic AP Depots
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock ledger, procurement triggers, and forward staging points in Krishna District.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => handleOpenRestock()}
          className="shadow-soft gap-1.5 font-bold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Procure / Restock Supplies</span>
        </Button>
      </div>

      {/* Success Notice */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Warehouses Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map((wh) => (
          <Card key={wh.id} className="p-5 bg-white/90 border-slate-200/90 shadow-sm rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <WarehouseIcon className="w-4 h-4 text-pastel-butter" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Capacity: {wh.capacityScore}%
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{wh.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{wh.location}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                <span>Base Lead: {wh.managerName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{wh.contact}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-card bg-white/80 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory supplies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="all">All AP Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              lowStockOnly
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Low Stock Only
          </button>
        </div>
      </div>

      {/* Inventory Data Table */}
      <Card className="bg-white/95 border-slate-200/90 shadow-md rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
              <tr>
                <th className="py-3.5 px-5">Supply Commodity</th>
                <th className="py-3.5 px-4">Available In Stock</th>
                <th className="py-3.5 px-4">Status &amp; Alert</th>
                <th className="py-3.5 px-4">Primary Staging Depot</th>
                <th className="py-3.5 px-4">Min Safe Threshold</th>
                <th className="py-3.5 px-5 text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map((res) => {
                const isCriticalLow = res.totalAvailable <= res.minThreshold;
                const isWarningLow = !isCriticalLow && res.totalAvailable <= res.minThreshold * 1.5;

                return (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div>
                        <span>{res.name}</span>
                        <p className="text-[10px] text-slate-400 capitalize font-medium">{res.type.replace('_', ' ')}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-800 text-sm">
                      {formatNumber(res.totalAvailable)} <span className="text-xs text-slate-400 font-normal">{res.unit}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isCriticalLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-rose text-pastel-rose-dark border border-pastel-rose-border font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3" />
                          Critical Low
                        </span>
                      ) : isWarningLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-butter text-pastel-butter-dark border border-pastel-butter-border font-bold text-[10px]">
                          Stock Depleting
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Sufficient
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {res.warehouseName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {formatNumber(res.minThreshold)} {res.unit}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenRestock(res.id)}
                        className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs transition-colors"
                      >
                        Request Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restock Procurement Modal */}
      <Modal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        title="Procurement Restock Request"
        description="Dispatch automated restocking indent to District Central Depot."
        maxWidth="md"
      >
        <form onSubmit={handleRestockSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Supply Item
            </label>
            <select
              value={selectedResId}
              onChange={(e) => setSelectedResId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Current: {formatNumber(r.totalAvailable)} {r.unit})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Additional Quantity to Procure"
            type="number"
            min={10}
            step={10}
            value={restockQty}
            onChange={(e) => setRestockQty(Number(e.target.value))}
            required
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsRestockOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingRestock}
              className="shadow-soft font-bold"
            >
              Confirm Indent Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
