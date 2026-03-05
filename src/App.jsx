import { useState, useEffect, useCallback } from 'react';
import CompanySetup from './components/CompanySetup';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview, { PREVIEW_ELEMENT_ID } from './components/InvoicePreview';
import { downloadInvoicePDF } from './utils/pdfGenerator';
import { loadCompanyInfo, loadSettings } from './utils/storage';

const TABS = [
  { id: 'company', label: 'Company Setup' },
  { id: 'invoice', label: 'Create Invoice' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('invoice');
  const [company, setCompany] = useState({});
  const [settings, setSettings] = useState({});
  const [invoiceData, setInvoiceData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  useEffect(() => {
    setCompany(loadCompanyInfo());
    setSettings(loadSettings());
  }, []);

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    if (tabId === 'invoice') {
      setCompany(loadCompanyInfo());
      setSettings(loadSettings());
    }
  }

  const handleInvoiceChange = useCallback((invoice, invoiceSettings) => {
    setInvoiceData(invoice);
    if (invoiceSettings) setSettings(invoiceSettings);
    setCompany(loadCompanyInfo());
  }, []);

  async function handleDownloadPDF() {
    if (!invoiceData) return;
    setPdfLoading(true);
    try {
      const filename = `${invoiceData.invoiceNumber || 'invoice'}.pdf`;
      await downloadInvoicePDF(PREVIEW_ELEMENT_ID, filename);
    } catch {
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  const hasCompany = company?.name;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company?.logoUrl ? (
              <img src={company.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
            ) : null}
            <span className="text-base font-black text-black">
              {company?.name || 'Invoice App'}
            </span>
          </div>

          {activeTab === 'invoice' && (
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading || !invoiceData?.clientName}
              className="hidden sm:inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {pdfLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-4">
          <nav className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Missing company info banner */}
      {activeTab === 'invoice' && !hasCompany && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800">
          Set up your company info first —{' '}
          <button
            className="font-semibold underline hover:no-underline"
            onClick={() => setActiveTab('company')}
          >
            Go to Company Setup
          </button>
        </div>
      )}

      {/* Body */}
      <main className="max-w-screen-xl mx-auto">
        {activeTab === 'company' && (
          <div className="max-w-lg mx-auto px-4 py-8">
            <CompanySetup />
          </div>
        )}

        {activeTab === 'invoice' && (
          <>
            {/* Mobile: form / preview toggle */}
            <div className="lg:hidden px-4 pt-4 flex gap-2">
              <button
                onClick={() => setShowPreviewMobile(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded border ${
                  !showPreviewMobile
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                Form
              </button>
              <button
                onClick={() => setShowPreviewMobile(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded border ${
                  showPreviewMobile
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                Preview
              </button>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
              {/* Form Panel */}
              <div
                className={`w-full lg:w-1/2 lg:border-r border-gray-200 px-4 py-6 lg:overflow-y-auto ${
                  showPreviewMobile ? 'hidden lg:block' : 'block'
                }`}
              >
                <InvoiceForm onInvoiceChange={handleInvoiceChange} />
              </div>

              {/* Preview Panel */}
              <div
                className={`w-full lg:w-1/2 bg-gray-50 px-4 py-6 lg:overflow-y-auto ${
                  showPreviewMobile ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Live Preview
                  </h2>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading || !invoiceData?.clientName}
                    className="sm:hidden inline-flex items-center gap-1 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pdfLoading ? 'Generating…' : 'Download PDF'}
                  </button>
                </div>

                <div className="shadow-lg rounded overflow-hidden border border-gray-200">
                  <InvoicePreview
                    invoice={invoiceData}
                    company={company}
                    settings={settings}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
