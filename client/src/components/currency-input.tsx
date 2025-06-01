import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = "0,00", className, disabled }: CurrencyInputProps) {
  const [inputValue, setInputValue] = useState(value === 0 ? '' : value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Permite apenas números
    const numbersOnly = newValue.replace(/[^\d]/g, '');
    
    setInputValue(numbersOnly);
    
    if (numbersOnly === '') {
      onChange(0);
    } else {
      onChange(parseInt(numbersOnly));
    }
  };

  const handleBlur = () => {
    if (value > 0) {
      setInputValue(value.toString());
    }
  };

  const displayValue = inputValue === '' ? '' : `${inputValue},00`;

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
        R$
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        disabled={disabled}
      />
    </div>
  );
}