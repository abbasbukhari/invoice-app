const RED = '#CC0000';

const steps = [
  {
    number: '1',
    title: 'Set Up Your Company',
    subtitle: 'Do this once — it saves automatically',
    tab: 'Company Setup tab',
    color: '#1a1a1a',
    fields: [
      { label: 'Company Logo', detail: 'Upload your logo (PNG or JPG). It appears at the top-left of every invoice.' },
      { label: 'Company Name', detail: 'Your registered business name. Required.' },
      { label: 'Company Tagline', detail: 'Optional — a short description (e.g. "Professional Consulting Services").' },
      { label: 'Payment Email', detail: 'The email clients send e-Transfers to. Required.' },
      { label: 'Phone Number', detail: 'Your business phone number. Required.' },
      { label: 'Account Name', detail: 'The name on your payment account — shown in the Payment Details section of the invoice.' },
      { label: 'Payment Method', detail: 'How you accept payment (e.g. EMT / e-Transfer, Cheque, Bank Transfer).' },
      { label: 'Payment Terms', detail: 'How many days clients have to pay (e.g. Net 30 = 30 days). The due date calculates automatically.' },
      { label: 'Tax Rate', detail: 'Default is 13% (Ontario HST). Change this if your region uses a different rate.' },
      { label: 'Satisfaction Guarantee', detail: 'Your client satisfaction policy text. Appears at the bottom of every invoice.' },
    ],
    tip: 'Click "Save Company Info" when done. Your info is stored in your browser and will be there next time you open the app.',
  },
  {
    number: '2',
    title: 'Fill In the Invoice',
    subtitle: 'A new draft is ready every time you open the app',
    tab: 'Create Invoice tab',
    color: '#1a1a1a',
    sections: [
      {
        name: 'Invoice Details',
        items: [
          { label: 'Invoice Number', detail: 'Auto-generated (e.g. INV-2026-001). You can edit it to match your own numbering.' },
          { label: 'Invoice Date', detail: 'Defaults to today. Change it if needed.' },
          { label: 'Due Date', detail: 'Auto-calculated from your Payment Terms (e.g. +30 days). You can override it manually.' },
        ],
      },
      {
        name: 'Bill To',
        items: [
          { label: 'Client Name', detail: 'The person or company you are billing. Required.' },
          { label: 'Client Phone / Email / Address', detail: 'Optional — include what you have on file.' },
        ],
      },
      {
        name: 'Matter / Project Reference',
        items: [
          { label: 'File / Reference Number', detail: 'Your internal file or project number (e.g. 00847-Smith). Optional.' },
          { label: 'Matter / Project Name', detail: 'The name of the case or project (e.g. Smith v. Anderson). Optional.' },
        ],
      },
      {
        name: 'Services / Items',
        items: [
          { label: 'Type', detail: 'Choose Service or Expense from the dropdown.' },
          { label: 'Date', detail: 'The date this service was performed.' },
          { label: 'Notes / Description', detail: 'What you did (e.g. "Initial consultation; review of matter").' },
          { label: 'Qty / Hrs', detail: 'Hours worked or quantity (e.g. 1.5 for 1.5 hours, 1 for a fixed-fee item).' },
          { label: 'Rate ($)', detail: 'Your hourly rate or the fixed price for this item.' },
          { label: 'Total', detail: 'Calculates automatically: Qty × Rate.' },
        ],
      },
    ],
    tip: 'Click "+ Add Row" to add more service lines. Click × to remove a row. Totals update instantly.',
  },
  {
    number: '3',
    title: 'Preview Your Invoice',
    subtitle: 'See exactly what the PDF will look like before downloading',
    tab: null,
    color: '#1a1a1a',
    bullets: [
      'On desktop — the live preview is on the right side of the screen, updating as you type.',
      'On mobile — tap the "Preview" button (top of screen) to switch between the form and the preview.',
      'Check that all details are correct: client name, dates, service descriptions, and totals.',
      'The invoice automatically shows your company info, payment details, and satisfaction guarantee.',
    ],
    tip: null,
  },
  {
    number: '4',
    title: 'Download as PDF',
    subtitle: 'One click — saves to your device',
    tab: null,
    color: '#1a1a1a',
    bullets: [
      'Click the "Download PDF" button at the top of the screen.',
      'The PDF is named after your invoice number automatically (e.g. INV-2026-001.pdf).',
      'The PDF is saved to your Downloads folder.',
      'On mobile, you may be prompted to choose where to save or open the file.',
      'Send the PDF to your client by email, message, or however you prefer.',
    ],
    tip: 'The Download PDF button is disabled until you fill in a client name.',
  },
];

const faqs = [
  {
    q: 'Where is my data saved?',
    a: 'Everything is saved in your browser\'s local storage — no account or internet connection needed. Your company info and current draft stay saved between sessions. Note: clearing your browser data will erase it.',
  },
  {
    q: 'Can I use this on my phone?',
    a: 'Yes. The app is fully mobile-friendly. Use the Form / Preview toggle buttons to switch between filling in the invoice and checking the preview.',
  },
  {
    q: 'How do I start a new invoice?',
    a: 'Click the "New Invoice" link (top right of the form panel). This clears the form and generates a new invoice number. Your company info stays saved.',
  },
  {
    q: 'What if my tax rate is not 13%?',
    a: 'Go to Company Setup and change the Tax Rate field to match your region (e.g. 5 for GST only, 15 for Nova Scotia HST).',
  },
  {
    q: 'The invoice number — should I change it?',
    a: 'The app generates one automatically (INV-YEAR-###). You can edit it to match your own numbering system. Always use a unique number for each invoice — never reuse one.',
  },
  {
    q: 'How many service rows can I add?',
    a: 'As many as you need. Click "+ Add Row" to keep adding lines. There is no hard limit.',
  },
  {
    q: 'My logo doesn\'t look right in the PDF — what should I do?',
    a: 'Use a PNG with a transparent or white background for best results. Avoid very large image files. A logo around 400×200 pixels works well.',
  },
];

export default function HowToUse() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-black mb-2">How to Use the Invoice App</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Follow these four steps to create and download a professional invoice.
          Your company info is saved automatically — you only need to set it up once.
        </p>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Set Up Company', 'Fill Invoice', 'Preview', 'Download PDF'].map((label, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm mx-auto mb-2"
              style={{ backgroundColor: RED }}
            >
              {i + 1}
            </div>
            <div className="text-xs font-semibold text-gray-700">{label}</div>
          </div>
        ))}
      </div>

      {/* Steps */}
      {steps.map((step) => (
        <div key={step.number} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Step Header */}
          <div className="flex items-start gap-4 p-5 pb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0 mt-0.5"
              style={{ backgroundColor: RED }}
            >
              {step.number}
            </div>
            <div>
              <h2 className="text-lg font-black text-black leading-tight">{step.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{step.subtitle}</p>
              {step.tab && (
                <span className="inline-block mt-2 text-xs font-semibold bg-black text-white px-2 py-0.5 rounded">
                  {step.tab}
                </span>
              )}
            </div>
          </div>

          {/* Fields list */}
          {step.fields && (
            <div className="border-t border-gray-100">
              {step.fields.map((field, i) => (
                <div
                  key={i}
                  className="flex gap-3 px-5 py-3 border-b border-gray-50 last:border-b-0"
                  style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9F9F9' }}
                >
                  <div className="w-36 flex-shrink-0 text-xs font-semibold text-gray-800 pt-0.5">{field.label}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{field.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* Sections */}
          {step.sections && (
            <div className="border-t border-gray-100">
              {step.sections.map((section) => (
                <div key={section.name}>
                  <div className="px-5 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {section.name}
                  </div>
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 px-5 py-3 border-b border-gray-50 last:border-b-0"
                      style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9F9F9' }}
                    >
                      <div className="w-28 flex-shrink-0 text-xs font-semibold text-gray-800 pt-0.5">{item.label}</div>
                      <div className="text-xs text-gray-600 leading-relaxed">{item.detail}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Bullet points */}
          {step.bullets && (
            <div className="border-t border-gray-100 px-5 py-4 space-y-2.5">
              {step.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2.5 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: RED }} />
                  {bullet}
                </div>
              ))}
            </div>
          )}

          {/* Tip */}
          {step.tip && (
            <div className="mx-5 mb-5 mt-1 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <div className="text-xs font-bold text-amber-800 mb-1">Tip</div>
              <div className="text-xs text-amber-900 leading-relaxed">{step.tip}</div>
            </div>
          )}
        </div>
      ))}

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-black text-black mb-4">Common Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-bold text-black mb-1.5">{faq.q}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div
        className="rounded-xl p-5 text-center"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="text-white font-bold text-sm mb-1">Need help?</div>
        <div className="text-gray-400 text-xs leading-relaxed">
          This app saves all your data directly in your browser.
          No account needed. Works on any device with a modern browser.
        </div>
      </div>
    </div>
  );
}
