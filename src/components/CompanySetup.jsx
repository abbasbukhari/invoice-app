import { useState, useEffect } from 'react';
import { loadCompanyInfo, saveCompanyInfo, loadSettings, saveSettings } from '../utils/storage';

const PAYMENT_METHODS = ['EMT (e-Transfer)', 'Bank Transfer', 'Cheque', 'Credit Card', 'Cash', 'PayPal'];
const PAYMENT_TERMS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt'];

export default function CompanySetup() {
  const [company, setCompany] = useState({
    name: '',
    tagline: '',
    email: '',
    phone: '',
    logoUrl: '',
    accountName: '',
  });
  const [settings, setSettings] = useState({
    paymentMethod: 'EMT (e-Transfer)',
    paymentTerms: 'Net 30',
    taxRate: 13,
    satisfactionGuarantee: 'We guarantee satisfaction with all our services. If you are not fully satisfied, please contact us within 7 days.',
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedCompany = loadCompanyInfo();
    const savedSettings = loadSettings();
    if (Object.keys(savedCompany).length > 0) setCompany(savedCompany);
    if (Object.keys(savedSettings).length > 0) {
      setSettings({
        ...savedSettings,
        taxRate: savedSettings.taxRate ? savedSettings.taxRate * 100 : 13,
      });
    }
  }, []);

  function validate() {
    const errs = {};
    if (!company.name.trim()) errs.name = 'Company name is required.';
    if (!company.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!company.phone.trim()) errs.phone = 'Phone number is required.';
    return errs;
  }

  function handleSave(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    saveCompanyInfo(company);
    saveSettings({ ...settings, taxRate: parseFloat(settings.taxRate) / 100 });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCompany((prev) => ({ ...prev, logoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setCompany((prev) => ({ ...prev, logoUrl: '' }));
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Company Information</h2>
        <p className="text-sm text-gray-500">Saved once and reused across all your invoices.</p>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
        <div className="flex items-center gap-4">
          {company.logoUrl ? (
            <div className="relative">
              <img src={company.logoUrl} alt="Logo" className="h-16 w-auto object-contain border border-gray-200 rounded p-1" />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="h-16 w-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-400">
              No logo
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Upload Logo
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={company.name}
          onChange={(e) => setCompany((p) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. NSK Consulting"
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Tagline</label>
        <input
          type="text"
          value={company.tagline}
          onChange={(e) => setCompany((p) => ({ ...p, tagline: e.target.value }))}
          placeholder="e.g. Professional Services"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Payment Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={company.email}
          onChange={(e) => setCompany((p) => ({ ...p, email: e.target.value }))}
          placeholder="billing@yourcompany.com"
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={company.phone}
          onChange={(e) => setCompany((p) => ({ ...p, phone: e.target.value }))}
          placeholder="+1 (416) 555-0000"
          className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-black ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Account Name (shown on invoice Payment Details) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Account Name</label>
        <input
          type="text"
          value={company.accountName}
          onChange={(e) => setCompany((p) => ({ ...p, accountName: e.target.value }))}
          placeholder="Name on your payment account (e.g. NSK Consulting)"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
        <p className="text-xs text-gray-400 mt-1">Appears in the Payment Details section of the invoice.</p>
      </div>

      <hr className="border-gray-200" />
      <h3 className="text-lg font-bold text-gray-800">Invoice Settings</h3>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
        <select
          value={settings.paymentMethod}
          onChange={(e) => setSettings((p) => ({ ...p, paymentMethod: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Terms</label>
        <select
          value={settings.paymentTerms}
          onChange={(e) => setSettings((p) => ({ ...p, paymentTerms: e.target.value }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        >
          {PAYMENT_TERMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Tax Rate */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Tax Rate (%)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={settings.taxRate}
            onChange={(e) => setSettings((p) => ({ ...p, taxRate: e.target.value }))}
            className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
          <span className="text-sm text-gray-500">% (e.g. 13 for Ontario HST)</span>
        </div>
      </div>

      {/* Satisfaction Guarantee */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Satisfaction Guarantee Text</label>
        <textarea
          value={settings.satisfactionGuarantee}
          onChange={(e) => setSettings((p) => ({ ...p, satisfactionGuarantee: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          Save Company Info
        </button>
        {saved && (
          <span className="text-green-600 text-sm font-medium">
            ✓ Company info saved!
          </span>
        )}
      </div>
    </form>
  );
}
