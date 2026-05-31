import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelectDropdown({ options, value, onChange, placeholder = 'Select options', disabled }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300;
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [open]);

  const toggleOption = (opt: string) => {
    const newValue = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
    onChange(newValue);
  };

  const removeOption = (opt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== opt));
  };

  const selectAll = () => {
    onChange([...options]);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex flex-wrap items-center gap-1 min-h-10 p-2 border rounded-md cursor-pointer bg-white transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
        } ${open ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        ) : (
          <>
            {value.slice(0, 3).map(v => (
              <span key={v} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-sm">
                {v.length > 15 ? v.slice(0, 12) + '...' : v}
                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={(e) => removeOption(v, e)} />
              </span>
            ))}
            {value.length > 3 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                +{value.length - 3} more
              </span>
            )}
          </>
        )}
        <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      
      {open && (
        <div 
          className={`absolute z-50 w-full bg-white border rounded-md shadow-lg overflow-hidden ${
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          <div className="flex justify-between items-center p-2 border-b bg-gray-50">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map(opt => (
              <label
                key={opt}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500">
            {value.length} option{value.length !== 1 ? 's' : ''} selected
          </div>
        </div>
      )}
    </div>
  );
}