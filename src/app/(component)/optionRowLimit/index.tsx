import React from "react";
//fetch limit option count

interface OptionRowLimitCountProps {
  options?: number[];
  onChange: (limit: number) => void;
  className: string;
  currentValue: number;
  totalCount: number | undefined;
}

const OptionRowLimitCount = ({
  options = [5, 10, 50, 100, 200, 500],
  onChange,
  className,
  currentValue,
  totalCount,
}: OptionRowLimitCountProps) => {
  const modifiedOptions = totalCount
    ? Array.from(
        new Set([...options.filter((opt) => opt <= totalCount), totalCount])
      )
    : options;

  return (
    <div className="flex gap-1 items-center">
      <span>| Show: </span>
      <select
        className={`border rounded px-2 py-1 ${className}`}
        onChange={(e) => onChange(Number(e.target.value))}
        value={currentValue}
      >
        {modifiedOptions.map((limit) => (
          <option key={limit} value={limit}>
            {limit === totalCount ? "All" : limit}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OptionRowLimitCount;
