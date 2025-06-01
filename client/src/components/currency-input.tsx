import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = "0,00", className, disabled }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números
    const numbersOnly = inputValue.replace(/[^\d]/g, '');
    
    if (numbersOnly === '') {
      onChange(0);
      return;
    }
    
    // Converte para número sem formatação especial
    const numericValue = Number(numbersOnly);
    onChange(numericValue);
  };

  const displayValue = value === 0 ? '' : `${value},00`;

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        R$
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled}
      />
    </div>
  );
}