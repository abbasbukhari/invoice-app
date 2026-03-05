import { formatCurrency, formatDate } from '../utils/calculations';

export const PREVIEW_ELEMENT_ID = 'invoice-preview-render';

// Matches the approved Google Sheets design:
// - RED (#CC0000) = "INVOICE" title, table header bg, Total row text, divider bar
// - BLACK = company name, section labels, all data
// - WHITE = all backgrounds
// - LIGHT GREY (#F2F2F2) = alternating service rows
// - MID GREY (#CCCCCC) = borders

const RED   = '#CC0000';
const BLACK = '#000000';
const LGREY = '#F2F2F2';
const MGREY = '#CCCCCC';

export default function InvoicePreview({ invoice, company, settings }) {
  if (!invoice || !company) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm bg-white">
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
    matterReference = '',
    matterName = '',
    services = [],
    subtotal = 0,
    taxAmount = 0,
    total = 0,
    taxRate = 0.13,
  } = invoice;

  const {
    name: companyName = '',
    tagline = '',
    email: companyEmail = '',
    phone: companyPhone = '',
    logoUrl = '',
    accountName = '',
  } = company;

  const {
    paymentMethod = '',
    satisfactionGuarantee = '',
  } = settings || {};

  const taxPct = Math.round((taxRate || 0.13) * 100);
  const quantitySubtotal = services.reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0);

  return (
    <div
      id={PREVIEW_ELEMENT_ID}
      style={{ backgroundColor: '#FFFFFF', color: BLACK, fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 11 }}
    >
      {/* ══ ROW 2: Logo + INVOICE title ══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '28px 28px 16px 28px' }}>
        {/* Left: Logo + Company */}
        <div style={{ flex: 1 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block', marginBottom: 6 }}
            />
          ) : (
            <div style={{
              width: 72, height: 52, border: `1px solid ${MGREY}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: RED, marginBottom: 6,
            }}>
              YOUR LOGO
            </div>
          )}
          <div style={{ fontSize: 20, fontWeight: 'bold', color: BLACK, lineHeight: 1.2 }}>
            {companyName || 'Your Company Name'}
          </div>
          {tagline && <div style={{ fontSize: 9, color: '#666666', marginTop: 2 }}>{tagline}</div>}
          <div style={{ marginTop: 4, fontSize: 9, color: '#444444', lineHeight: 1.6 }}>
            {companyPhone && <div>{companyPhone}</div>}
            {companyEmail && <div>{companyEmail}</div>}
          </div>
        </div>

        {/* Right: INVOICE title + meta */}
        <div style={{ textAlign: 'right', marginLeft: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: RED, marginBottom: 10, lineHeight: 1 }}>
            INVOICE
          </div>
          <table style={{ marginLeft: 'auto', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ color: '#444444', fontSize: 9, paddingRight: 12, paddingBottom: 3, whiteSpace: 'nowrap' }}>Invoice #</td>
                <td style={{ fontSize: 9, fontWeight: '600', textAlign: 'right', color: BLACK }}>{invoiceNumber || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#444444', fontSize: 9, paddingRight: 12, paddingBottom: 3 }}>Date:</td>
                <td style={{ fontSize: 9, fontWeight: '600', textAlign: 'right', color: BLACK }}>{formatDate(date) || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#444444', fontSize: 9, paddingRight: 12 }}>Due On:</td>
                <td style={{ fontSize: 9, fontWeight: '600', textAlign: 'right', color: BLACK }}>{formatDate(dueDate) || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ COMPANY ADDRESS (rows 9-11) ══ */}
      {/* (Shown as part of company block above — address is kept with company info) */}

      {/* ══ BILL TO (rows 14-17) ══ */}
      <div style={{ padding: '0 28px 16px 28px' }}>
        <div style={{ fontSize: 9, fontWeight: 'bold', color: '#444444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Bill To
        </div>
        {clientName ? (
          <div style={{ fontSize: 10, color: BLACK, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 'bold', fontSize: 11 }}>{clientName}</div>
            {clientAddress && <div>{clientAddress}</div>}
            {clientPhone && <div>{clientPhone}</div>}
            {clientEmail && <div>{clientEmail}</div>}
          </div>
        ) : (
          <div style={{ fontSize: 9, color: MGREY }}>Client information will appear here.</div>
        )}
      </div>

      {/* ══ MATTER / FILE REFERENCE (row 19) ══ */}
      {(matterReference || matterName) && (
        <div style={{ padding: '0 28px 4px 28px' }}>
          {matterReference && (
            <div style={{ fontSize: 13, fontWeight: 'bold', color: BLACK, marginBottom: 2 }}>
              {matterReference}
            </div>
          )}
          {matterName && (
            <div style={{ fontSize: 15, fontWeight: 'bold', color: BLACK, marginBottom: 8 }}>
              {matterName}
            </div>
          )}
        </div>
      )}

      {/* ══ ROW 23: TABLE HEADER — RED bg, white text ══ */}
      <div style={{ padding: '0 28px 4px 28px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: RED }}>
              <th style={{ ...thStyle, width: 70 }}>Type</th>
              <th style={{ ...thStyle, width: 80 }}>Date</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Notes</th>
              <th style={{ ...thStyle, width: 60 }}>Quantity</th>
              <th style={{ ...thStyle, width: 72, textAlign: 'right' }}>Rate</th>
              <th style={{ ...thStyle, width: 80, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => {
              const lineTotal = (parseFloat(service.quantity) || 0) * (parseFloat(service.rate) || 0);
              const rowBg = idx % 2 === 0 ? '#FFFFFF' : LGREY;
              return (
                <tr key={idx} style={{ backgroundColor: rowBg, borderBottom: `1px solid ${MGREY}` }}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {service.type || <Blank />}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {service.date ? formatDate(service.date) : <Blank />}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    {service.description || <Blank />}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {service.quantity !== '' && service.quantity !== undefined ? service.quantity : <Blank />}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {service.rate ? formatCurrency(parseFloat(service.rate)) : <Blank />}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '500' }}>
                    {lineTotal > 0 ? formatCurrency(lineTotal) : <Blank />}
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '14px 8px', textAlign: 'center', color: MGREY, fontSize: 9 }}>
                  No services added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══ SUMMARY ROWS (rows 40-45) ══ */}
      <div style={{ padding: '8px 28px 16px 28px' }}>
        <table style={{ marginLeft: 'auto', borderCollapse: 'collapse', borderLeft: `1px solid ${MGREY}` }}>
          <tbody>
            {/* Quantity Subtotal (row 40) */}
            <tr>
              <td style={summaryLabelStyle}>Quantity Subtotal</td>
              <td style={summaryValueStyle}>{quantitySubtotal.toFixed(2)}</td>
            </tr>
            {/* Subtotal (row 43) */}
            <tr>
              <td style={summaryLabelStyle}>Subtotal</td>
              <td style={summaryValueStyle}>{formatCurrency(subtotal)}</td>
            </tr>
            {/* HST (row 44) */}
            <tr>
              <td style={summaryLabelStyle}>HST Tax ({taxPct}.0%)</td>
              <td style={summaryValueStyle}>{formatCurrency(taxAmount)}</td>
            </tr>
            {/* Total (row 45) — RED bold */}
            <tr>
              <td style={{ ...summaryLabelStyle, color: RED, fontWeight: 'bold', fontSize: 11 }}>Total</td>
              <td style={{ ...summaryValueStyle, color: RED, fontWeight: 'bold', fontSize: 11 }}>{formatCurrency(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══ PAYMENT DETAILS (rows 48-52) ══ */}
      <div style={{ padding: '12px 28px 12px 28px' }}>
        <div style={{ fontSize: 9, fontWeight: 'bold', color: BLACK, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Payment Details
        </div>
        <table style={{ borderCollapse: 'collapse', fontSize: 10 }}>
          <tbody>
            {paymentMethod && (
              <tr>
                <td style={{ fontWeight: 'bold', paddingRight: 16, paddingBottom: 3, color: BLACK, whiteSpace: 'nowrap' }}>Payment Method</td>
                <td style={{ color: BLACK, paddingBottom: 3 }}>{paymentMethod}</td>
              </tr>
            )}
            {companyEmail && (
              <tr>
                <td style={{ fontWeight: 'bold', paddingRight: 16, paddingBottom: 3, color: BLACK, whiteSpace: 'nowrap' }}>Send To</td>
                <td style={{ color: BLACK, paddingBottom: 3 }}>{companyEmail}</td>
              </tr>
            )}
            {(accountName || companyName) && (
              <tr>
                <td style={{ fontWeight: 'bold', paddingRight: 16, paddingBottom: 3, color: BLACK, whiteSpace: 'nowrap' }}>Account Name</td>
                <td style={{ color: BLACK, paddingBottom: 3 }}>{accountName || companyName}</td>
              </tr>
            )}
            {dueDate && (
              <tr>
                <td style={{ fontWeight: 'bold', paddingRight: 16, color: BLACK, whiteSpace: 'nowrap' }}>Due Date</td>
                <td style={{ color: BLACK }}>{formatDate(dueDate)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ══ RED DIVIDER BAR (row 53) ══ */}
      <div style={{ height: 8, backgroundColor: RED, margin: '0 28px' }} />

      {/* ══ SATISFACTION GUARANTEE (rows 55-56) ══ */}
      {satisfactionGuarantee && (
        <div style={{ padding: '12px 28px 8px 28px' }}>
          <div style={{ fontSize: 9, fontWeight: 'bold', color: BLACK, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Satisfaction Guarantee
          </div>
          <div style={{ fontSize: 9, color: '#444444', fontStyle: 'italic', lineHeight: 1.5 }}>
            {satisfactionGuarantee}
          </div>
        </div>
      )}

      {/* ══ THANK YOU (row 58) ══ */}
      <div style={{ padding: '12px 28px 28px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 'bold', color: BLACK }}>
          Thank you for your business!
        </div>
      </div>
    </div>
  );
}

// ── Shared cell styles
const thStyle = {
  padding: '7px 8px',
  fontSize: 9,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  border: `1px solid ${MGREY}`,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle = {
  padding: '6px 8px',
  fontSize: 9,
  color: '#000000',
};

const summaryLabelStyle = {
  fontSize: 9,
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'right',
  paddingRight: 16,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 20,
  whiteSpace: 'nowrap',
};

const summaryValueStyle = {
  fontSize: 9,
  color: '#000000',
  textAlign: 'right',
  paddingRight: 4,
  paddingTop: 4,
  paddingBottom: 4,
};

function Blank() {
  return <span style={{ color: '#CCCCCC' }}>—</span>;
}
