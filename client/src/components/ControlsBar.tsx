import { type ChangeEvent } from "react";
import { type DateSort, type Filter } from "../App";

export type ControlsBarProps = {
  filter: Filter;
  search: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dateSort: DateSort;
  setFilter: (filter: Filter) => void;
  onDateSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const options = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

const ControlsBar = ({
  filter,
  search,
  onSearchChange,
  dateSort,
  setFilter,
  onDateSortChange,
}: ControlsBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="">Filters: </label>
      <button
        className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
        onClick={() => setFilter("all")}
        style={{ backgroundColor: filter === "all" ? "green" : "#f0f0f0" }}
      >
        All
      </button>
      <button
        className=" gap-3 px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
        onClick={() => setFilter("active")}
        style={{ backgroundColor: filter === "active" ? "green" : "#f0f0f0" }}
      >
        Active
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
        onClick={() => setFilter("done")}
        style={{ backgroundColor: filter === "done" ? "green" : "#f0f0f0" }}
      >
        Done
      </button>
      <label htmlFor="">Sort by</label>
      <select
        className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
        value={dateSort}
        onChange={onDateSortChange}
        name="date-filter"
        id="date-filter"
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="">Search</label>
      <input
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"

        type="text"
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default ControlsBar;
