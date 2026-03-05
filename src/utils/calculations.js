/**
 * Calculate subtotal from service rows.
 * @param {Array} services - Array of { quantity, rate }
 * @returns {number}
 */
export function calcSubtotal(services) {
  return services.reduce((sum, s) => {
    const qty = parseFloat(s.quantity) || 0;
    const rate = parseFloat(s.rate) || 0;
    return sum + qty * rate;
  }, 0);
}

/**
 * Calculate tax amount.
 * @param {number} subtotal
 * @param {number} taxRate - e.g. 0.13 for 13%
 * @returns {number}
 */
export function calcTax(subtotal, taxRate) {
  return subtotal * (parseFloat(taxRate) || 0);
}

/**
 * Calculate total.
 * @param {number} subtotal
 * @param {number} taxAmount
 * @returns {number}
 */
export function calcTotal(subtotal, taxAmount) {
  return subtotal + taxAmount;
}

/**
 * Format a number as currency string.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount || 0);
}

/**
 * Calculate due date from invoice date and payment terms string.
 * @param {string} invoiceDate - ISO date string e.g. "2026-03-04"
 * @param {string} paymentTerms - e.g. "Net 30", "Net 15", "Net 45", "Net 60"
 * @returns {string} - ISO date string
 */
export function calcDueDate(invoiceDate, paymentTerms) {
  if (!invoiceDate) return '';
  const days = parseInt((paymentTerms || 'Net 30').replace(/\D/g, '')) || 30;
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Generate next invoice number based on existing invoices.
 * @param {Array} invoices - existing saved invoices
 * @param {string} prefix - e.g. "INV"
 * @returns {string}
 */
export function generateInvoiceNumber(invoices, prefix = 'INV') {
  const year = new Date().getFullYear();
  const count = (invoices || []).filter((inv) =>
    inv.invoiceNumber?.startsWith(`${prefix}-${year}`)
  ).length;
  const num = String(count + 1).padStart(3, '0');
  return `${prefix}-${year}-${num}`;
}

/**
 * Format a date string (YYYY-MM-DD) for display.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

/**
 * Get today's date as YYYY-MM-DD.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
