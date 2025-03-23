import React from "react";
//fetch limit option count

interface OptionRowLimitCountProps {
  options?: number[];
  onChange: (limit: number) => void;
  className: string;
  currentValue: number;
}

const OptionRowLimitCount = ({
  options = [5, 10, 50, 100, 200, 500],
  onChange,
  className,
  currentValue,
}: OptionRowLimitCountProps) => {
  return (
    <select
      className={`border rounded px-2 py-1 ${className}`}
      onChange={(e) => onChange(Number(e.target.value))}
      value={options.find((limit) => limit === currentValue) || options[0]}
    >
      {options.map((limit) => (
        <option key={limit} onClick={() => onChange(limit)}>
          {limit}
        </option>
      ))}
    </select>
  );
};

export default OptionRowLimitCount;
