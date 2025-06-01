import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder = "0,00", className, disabled }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrency = (str: string): number => {
    // Remove tudo exceto números
    const numbersOnly = str.replace(/[^\d]/g, '');
    
    // Se está vazio, retorna 0
    if (!numbersOnly) return 0;
    
    // Converte para número
    return parseInt(numbersOnly);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números
    const numbersOnly = inputValue.replace(/[^\d]/g, '');
    
    if (numbersOnly === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }
    
    // Trata como número inteiro (47 = 47.00)
    const numericValue = parseInt(numbersOnly);
    setDisplayValue(numbersOnly);
    onChange(numericValue);
  };

  const handleBlur = () => {
    // Formata o valor final quando perde o foco
    setDisplayValue(formatCurrency(value));
  };

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