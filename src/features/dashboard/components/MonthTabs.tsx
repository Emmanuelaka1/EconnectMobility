import React from "react";

const MONTHS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

type Props = {
  value: number; // 0-11
  onChange: (m: number) => void;
};

const MonthTabs: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {MONTHS.map((m, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={"px-3 py-1 rounded-full border " + (i===value ? "bg-orange-500 text-white border-orange-500" : "bg-white")}
        >
          {m}
        </button>
      ))}
    </div>
  );
};

export default MonthTabs;
