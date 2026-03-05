import { formatCurrency, formatDate } from '../utils/calculations';

export const PREVIEW_ELEMENT_ID = 'invoice-preview-render';

export default function InvoicePreview({ invoice, company, settings }) {
  if (!invoice || !company) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Fill in the form to see your invoice preview.
      </div>
    );
  }

  const {
    invoiceNumber = '',
    date = '',
    dueDate = '',
    clientName = '',
    clientPhone = '',
    clientEmail = '',
    clientAddress = '',
    services = [],
    subtotal = 0,
    taxAmount = 0,
    total = 0,
    taxRate = 0.13,
  } = invoice;

  const {
    name: companyName = 'Your Company',
    tagline = '',
    email: companyEmail = '',
    phone: companyPhone = '',
    logoUrl = '',
  } = company;

  const {
    paymentMethod = 'EMT (e-Transfer)',
    satisfactionGuarantee = '',
  } = settings || {};

  const taxPct = Math.round((taxRate || 0.13) * 100);

  return (
    <div
      id={PREVIEW_ELEMENT_ID}
      className="bg-white text-black font-sans text-sm"
      style={{ minWidth: 480 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start p-8 pb-6">
        {/* Left: Logo + Company */}
        <div className="flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-14 w-auto object-contain mb-2" />
          ) : (
            <div className="text-2xl font-black text-black mb-1">{companyName}</div>
          )}
          {logoUrl && <div className="text-base font-bold text-black">{companyName}</div>}
          {tagline && <div className="text-xs text-gray-500 mt-0.5">{tagline}</div>}
          <div className="mt-2 text-xs text-gray-600 space-y-0.5">
            {companyPhone && <div>{companyPhone}</div>}
            {companyEmail && <div>{companyEmail}</div>}
          </div>
        </div>

        {/* Right: INVOICE title + details */}
        <div className="text-right ml-6">
          <div className="text-3xl font-black text-black mb-3">INVOICE</div>
          <table className="text-xs ml-auto">
            <tbody>
              <tr>
                <td className="text-gray-500 pr-4 pb-1">Invoice #</td>
                <td className="font-semibold text-right">{invoiceNumber || '—'}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-4 pb-1">Date</td>
                <td className="font-semibold text-right">{formatDate(date) || '—'}</td>
              </tr>
              <tr>
                <td className="text-gray-500 pr-4">Due Date</td>
                <td className="font-semibold text-right">{formatDate(dueDate) || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-black mx-8" />

      {/* Bill To */}
      <div className="px-8 py-5">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bill To</div>
        {clientName ? (
          <div>
            <div className="font-bold text-base text-black">{clientName}</div>
            {clientAddress && <div className="text-xs text-gray-600 mt-0.5">{clientAddress}</div>}
            {clientPhone && <div className="text-xs text-gray-600">{clientPhone}</div>}
            {clientEmail && <div className="text-xs text-gray-600">{clientEmail}</div>}
          </div>
        ) : (
          <div className="text-gray-400 text-xs">Client information will appear here.</div>
        )}
      </div>

      {/* Services Table */}
      <div className="px-8 pb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide">Description</th>
              <th className="text-center py-2 px-3 text-xs font-bold uppercase tracking-wide w-12">Qty</th>
              <th className="text-right py-2 px-3 text-xs font-bold uppercase tracking-wide w-24">Rate</th>
              <th className="text-right py-2 px-3 text-xs font-bold uppercase tracking-wide w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => {
              const lineTotal = (parseFloat(service.quantity) || 0) * (parseFloat(service.rate) || 0);
              return (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-2 px-3 text-xs border-b border-gray-100">
                    {service.description || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-2 px-3 text-xs text-center border-b border-gray-100">
                    {service.quantity || '—'}
                  </td>
                  <td className="py-2 px-3 text-xs text-right border-b border-gray-100">
                    {service.rate ? formatCurrency(parseFloat(service.rate)) : '—'}
                  </td>
                  <td className="py-2 px-3 text-xs text-right border-b border-gray-100 font-medium">
                    {lineTotal > 0 ? formatCurrency(lineTotal) : '—'}
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 px-3 text-center text-gray-300 text-xs">
                  No services added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 pb-6">
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1 text-xs text-gray-600 border-t border-gray-200">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-xs text-gray-600">
              <span>HST ({taxPct}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-2 px-3 mt-1 bg-black text-white font-bold text-sm rounded">
              <span>TOTAL DUE</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      {(paymentMethod || companyEmail) && (
        <div className="px-8 pb-5 border-t border-gray-200 pt-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Payment Instructions</div>
          <div className="text-xs text-gray-700 space-y-1">
            {paymentMethod && <div><span className="font-semibold">Method:</span> {paymentMethod}</div>}
            {companyEmail && paymentMethod?.toLowerCase().includes('emt') && (
              <div><span className="font-semibold">Send to:</span> {companyEmail}</div>
            )}
            {!paymentMethod?.toLowerCase().includes('emt') && companyEmail && (
              <div><span className="font-semibold">Contact:</span> {companyEmail}</div>
            )}
          </div>
        </div>
      )}

      {/* Satisfaction Guarantee */}
      {satisfactionGuarantee && (
        <div className="px-8 pb-8 border-t border-gray-100 pt-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Satisfaction Guarantee</div>
          <p className="text-xs text-gray-600 leading-relaxed">{satisfactionGuarantee}</p>
        </div>
      )}

      {/* Footer */}
      <div className="h-1 bg-black mx-8 mb-8" />
    </div>
  );
}
