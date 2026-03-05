const STORAGE_KEY = '4bag-invoice-data';

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadCompanyInfo() {
  return loadData().companyInfo || {};
}

export function saveCompanyInfo(companyInfo) {
  const data = loadData();
  saveData({ ...data, companyInfo });
}

export function loadSettings() {
  return loadData().settings || {
    paymentMethod: 'EMT',
    paymentTerms: 'Net 30',
    taxRate: 0.13,
    satisfactionGuarantee: 'We guarantee satisfaction with all our services. If you are not fully satisfied, please contact us within 7 days.',
  };
}

export function saveSettings(settings) {
  const data = loadData();
  saveData({ ...data, settings });
}

export function loadInvoices() {
  return loadData().invoices || [];
}

export function saveInvoices(invoices) {
  const data = loadData();
  saveData({ ...data, invoices });
}

export function saveInvoice(invoice) {
  const invoices = loadInvoices();
  const idx = invoices.findIndex((inv) => inv.id === invoice.id);
  if (idx >= 0) {
    invoices[idx] = invoice;
  } else {
    invoices.push(invoice);
  }
  saveInvoices(invoices);
}

export function loadDraftInvoice() {
  return loadData().draftInvoice || null;
}

export function saveDraftInvoice(invoice) {
  const data = loadData();
  saveData({ ...data, draftInvoice: invoice });
}

export function clearDraftInvoice() {
  const data = loadData();
  delete data.draftInvoice;
  saveData(data);
}
