import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = "0,00", className, disabled }: CurrencyInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        R$
      </span>
      <Input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled}
        min="0"
        step="0.01"
      />
    </div>
  );
}