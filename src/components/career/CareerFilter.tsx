"use client";

import { FilterPills, type FilterOption } from "@/components/FilterPills";
import { careerTagLabels, careerTags, type CareerTag } from "@/data/career";

export type CareerFilterValue = CareerTag | "all";

export const careerFilterValues: CareerFilterValue[] = ["all", ...careerTags];

const options: FilterOption<CareerFilterValue>[] = [
  { value: "all", label: "すべて" },
  ...careerTags.map((t) => ({ value: t, label: careerTagLabels[t] })),
];

export function CareerFilter({
  value,
  onChange,
}: {
  value: CareerFilterValue;
  onChange: (v: CareerFilterValue) => void;
}) {
  return <FilterPills label="経歴の種類" options={options} value={value} onChange={onChange} />;
}
