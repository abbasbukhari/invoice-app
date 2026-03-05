import { useState, useEffect, useCallback } from 'react';
import ServiceRow from './ServiceRow';
import {
  calcSubtotal, calcTax, calcTotal, calcDueDate,
  generateInvoiceNumber, todayISO, formatCurrency,
} from '../utils/calculations';
import {
  loadSettings, loadInvoices, saveDraftInvoice, loadDraftInvoice,
} from '../utils/storage';

const EMPTY_SERVICE = { type: 'Service', date: '', description: '', quantity: 1, rate: '' };

function makeEmptyInvoice(invoices, settings) {
  const today = todayISO();
  return {
    id: `draft-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(invoices),
    date: today,
    dueDate: calcDueDate(today, settings.paymentTerms),
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    matterReference: '',
    matterName: '',
    services: [{ ...EMPTY_SERVICE }],
  };
}

export default function InvoiceForm({ onInvoiceChange }) {
  const [settings, setSettings] = useState({
    paymentMethod: 'EMT (e-Transfer)',
    paymentTerms: 'Net 30',
    taxRate: 0.13,
    satisfactionGuarantee: '',
  });
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
    const draft = loadDraftInvoice();
    const invoices = loadInvoices();
    setInvoice(draft || makeEmptyInvoice(invoices, savedSettings));
  }, []);

  const getCalculations = useCallback((inv, s) => {
    if (!inv) return { subtotal: 0, taxAmount: 0, total: 0 };
    const subtotal = calcSubtotal(inv.services);
    const taxAmount = calcTax(subtotal, s.taxRate);
    const total = calcTotal(subtotal, taxAmount);
    return { subtotal, taxAmount, total };
  }, []);

  useEffect(() => {
    if (!invoice) return;
    const calcs = getCalculations(invoice, settings);
    const full = { ...invoice, ...calcs, taxRate: settings.taxRate };
    saveDraftInvoice(full);
    if (onInvoiceChange) onInvoiceChange(full, settings);
  }, [invoice, settings, getCalculations, onInvoiceChange]);

  function updateInvoice(field, value) {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }

  function handleDateChange(value) {
    setInvoice((prev) => ({
      ...prev,
      date: value,
      dueDate: calcDueDate(value, settings.paymentTerms),
    }));
  }

  function handleServiceChange(idx, field, value) {
    setInvoice((prev) => {
      const services = prev.services.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      );
      return { ...prev, services };
    });
  }

  function addService() {
    setInvoice((prev) => ({
      ...prev,
      services: [...prev.services, { ...EMPTY_SERVICE, date: prev.date }],
    }));
  }

  function removeService(idx) {
    setInvoice((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== idx),
    }));
  }

  function handleReset() {
    const invoices = loadInvoices();
    setInvoice(makeEmptyInvoice(invoices, settings));
  }

  if (!invoice) return <div className="p-4 text-gray-500 text-sm">Loading...</div>;

  const { subtotal, taxAmount, total } = getCalculations(invoice, settings);
  const quantitySubtotal = invoice.services.reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Create Invoice</h2>
          <p className="text-sm text-gray-500">Fill in the details below to generate your invoice.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          New Invoice
        </button>
      </div>

      {/* Invoice Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoice.invoiceNumber}
            onChange={(e) => updateInvoice('invoiceNumber', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date</label>
          <input
            type="date"
            value={invoice.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => updateInvoice('dueDate', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Bill To */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-3">Bill To</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Client Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={invoice.clientName}
              onChange={(e) => updateInvoice('clientName', e.target.value)}
              placeholder="Client or company name"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Phone</label>
            <input
              type="tel"
              value={invoice.clientPhone}
              onChange={(e) => updateInvoice('clientPhone', e.target.value)}
              placeholder="+1 (416) 555-0000"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Email</label>
            <input
              type="email"
              value={invoice.clientEmail}
              onChange={(e) => updateInvoice('clientEmail', e.target.value)}
              placeholder="client@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client Address</label>
            <input
              type="text"
              value={invoice.clientAddress}
              onChange={(e) => updateInvoice('clientAddress', e.target.value)}
              placeholder="123 Main St, City, Province"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Matter / File Reference */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-3">Matter / Project Reference</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">File / Reference Number</label>
            <input
              type="text"
              value={invoice.matterReference}
              onChange={(e) => updateInvoice('matterReference', e.target.value)}
              placeholder="e.g. 00847-Smith"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Matter / Project Name</label>
            <input
              type="text"
              value={invoice.matterName}
              onChange={(e) => updateInvoice('matterName', e.target.value)}
              placeholder="e.g. Smith v. Anderson"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-3">Services / Items</h3>
        <div className="space-y-3">
          {invoice.services.map((service, idx) => (
            <ServiceRow
              key={idx}
              service={service}
              index={idx}
              onChange={handleServiceChange}
              onRemove={removeService}
              canRemove={invoice.services.length > 1}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addService}
          className="mt-3 inline-flex items-center gap-1 text-sm text-gray-600 border border-dashed border-gray-300 rounded px-4 py-2 hover:border-gray-500 hover:text-gray-800 transition-colors"
        >
          + Add Row
        </button>
      </div>

      {/* Totals Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Quantity Subtotal</span>
          <span>{quantitySubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>HST Tax ({Math.round((settings.taxRate || 0.13) * 100)}%)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-gray-300 pt-2 mt-1" style={{ color: '#CC0000' }}>
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
