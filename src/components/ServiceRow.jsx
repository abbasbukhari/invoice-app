import { formatCurrency } from '../utils/calculations';

export default function ServiceRow({ service, index, onChange, onRemove, canRemove }) {
  const lineTotal = (parseFloat(service.quantity) || 0) * (parseFloat(service.rate) || 0);

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      {/* Description */}
      <div className="col-span-12 sm:col-span-5">
        {index === 0 && (
          <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
        )}
        <input
          type="text"
          value={service.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          placeholder="Service description"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Quantity */}
      <div className="col-span-4 sm:col-span-2">
        {index === 0 && (
          <label className="block text-xs font-semibold text-gray-600 mb-1">Qty</label>
        )}
        <input
          type="number"
          min="0"
          step="0.25"
          value={service.quantity}
          onChange={(e) => onChange(index, 'quantity', e.target.value)}
          placeholder="1"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Rate */}
      <div className="col-span-4 sm:col-span-3">
        {index === 0 && (
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rate ($)</label>
        )}
        <input
          type="number"
          min="0"
          step="0.01"
          value={service.rate}
          onChange={(e) => onChange(index, 'rate', e.target.value)}
          placeholder="0.00"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Total */}
      <div className="col-span-3 sm:col-span-2">
        {index === 0 && (
          <label className="block text-xs font-semibold text-gray-600 mb-1">Total</label>
        )}
        <div className="border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-700 font-medium">
          {formatCurrency(lineTotal)}
        </div>
      </div>

      {/* Remove Button */}
      <div className={`col-span-1 flex ${index === 0 ? 'items-end pb-0.5' : 'items-start'}`}>
        {index === 0 && <div className="h-5 mb-1" />}
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-400 hover:text-red-600 text-lg leading-none px-1 mt-1"
            title="Remove row"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
