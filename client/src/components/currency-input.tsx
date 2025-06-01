import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = "0,00", className, disabled }: CurrencyInputProps) {
  const formatCurrency = (num: number): string => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números
    const numbersOnly = inputValue.replace(/[^\d]/g, '');
    
    if (numbersOnly === '') {
      onChange(0);
      return;
    }
    
    // Converte diretamente para número
    const numericValue = parseInt(numbersOnly);
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        R$
      </span>
      <Input
        type="text"
        value={value === 0 ? '' : formatCurrency(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled}
      />
    </div>
  );
}