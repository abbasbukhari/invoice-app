import { formatCurrency } from '../utils/calculations';

const SERVICE_TYPES = ['Service', 'Expense'];

export default function ServiceRow({ service, index, onChange, onRemove, canRemove }) {
  const lineTotal = (parseFloat(service.quantity) || 0) * (parseFloat(service.rate) || 0);

  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-white space-y-2 sm:space-y-0 sm:bg-transparent sm:border-0 sm:p-0">
      {/* Row 1 (mobile): Type + Date | (desktop): all fields in one grid row */}
      <div className={`grid gap-2 items-start grid-cols-2 sm:${canRemove ? 'grid-cols-[80px_110px_1fr_65px_75px_75px_28px]' : 'grid-cols-[80px_110px_1fr_65px_75px_75px]'}`}>
        {/* Type */}
        <div>
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>}
          <select
            value={service.type || 'Service'}
            onChange={(e) => onChange(index, 'type', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-2 text-xs focus:outline-none focus:border-gray-600 bg-white"
          >
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>}
          <input
            type="date"
            value={service.date || ''}
            onChange={(e) => onChange(index, 'date', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-2 text-xs focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Notes — full width on mobile (col-span-2), normal on desktop */}
        <div className="col-span-2 sm:col-span-1">
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Notes / Description</label>}
          <input
            type="text"
            value={service.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            placeholder="Service or expense description"
            className="w-full border border-gray-300 rounded px-2 py-2 text-xs focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Qty */}
        <div>
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Qty / Hrs</label>}
          <input
            type="number"
            min="0"
            step="0.25"
            value={service.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            placeholder="1"
            className="w-full border border-gray-300 rounded px-2 py-2 text-xs focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Rate */}
        <div>
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Rate ($)</label>}
          <input
            type="number"
            min="0"
            step="0.01"
            value={service.rate}
            onChange={(e) => onChange(index, 'rate', e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-2 py-2 text-xs focus:outline-none focus:border-gray-600"
          />
        </div>

        {/* Total */}
        <div>
          {index === 0 && <label className="block text-xs font-semibold text-gray-600 mb-1">Total</label>}
          <div className="border border-gray-200 bg-gray-50 rounded px-2 py-2 text-xs text-gray-700 font-medium text-right">
            {lineTotal > 0 ? formatCurrency(lineTotal) : '—'}
          </div>
        </div>

        {/* Remove */}
        {canRemove && (
          <div className={`hidden sm:flex ${index === 0 ? 'items-end pb-0.5' : 'items-center'}`}>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 text-lg leading-none w-7 h-8 flex items-center justify-center"
              title="Remove row"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Mobile-only remove button */}
      {canRemove && (
        <div className="flex justify-end sm:hidden">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1"
          >
            Remove row
          </button>
        </div>
      )}
    </div>
  );
}
