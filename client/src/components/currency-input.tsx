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
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseCurrency = (str: string): number => {
    // Remove tudo exceto números, vírgulas e pontos
    const cleanStr = str.replace(/[^\d,]/g, '');
    
    // Se está vazio, retorna 0
    if (!cleanStr) return 0;
    
    // Se tem vírgula, considera como separador decimal
    if (cleanStr.includes(',')) {
      const parts = cleanStr.split(',');
      const integerPart = parts[0] || '0';
      const decimalPart = (parts[1] || '').padEnd(2, '0').substring(0, 2);
      return parseFloat(`${integerPart}.${decimalPart}`);
    }
    
    // Se não tem vírgula, trata como valor inteiro
    return parseFloat(cleanStr);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permite apenas números, vírgulas e remove outros caracteres
    const filteredValue = inputValue.replace(/[^\d,]/g, '');
    
    // Se o usuário digitou apenas números (ex: "20"), adiciona ,00 automaticamente
    if (/^\d+$/.test(filteredValue)) {
      const formattedValue = `${filteredValue},00`;
      setDisplayValue(formattedValue);
      onChange(parseCurrency(formattedValue));
      return;
    }
    
    // Se tem vírgula, permite edição dos decimais
    if (filteredValue.includes(',')) {
      const parts = filteredValue.split(',');
      if (parts.length === 2) {
        const integerPart = parts[0];
        const decimalPart = parts[1].substring(0, 2); // máximo 2 casas decimais
        const newValue = `${integerPart},${decimalPart}`;
        setDisplayValue(newValue);
        onChange(parseCurrency(newValue));
        return;
      }
    }
    
    setDisplayValue(filteredValue);
    onChange(parseCurrency(filteredValue));
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