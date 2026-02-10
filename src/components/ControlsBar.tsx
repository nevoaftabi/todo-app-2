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
  onDateSortChange
}: ControlsBarProps) => {
  return (
    <>
      <label htmlFor="">Filters: </label>
      <button
        onClick={() => setFilter("all")}
        style={{ backgroundColor: filter === "all" ? "green" : "#f0f0f0" }}
      >
        All
      </button>
      |
      <button
        onClick={() => setFilter("active")}
        style={{ backgroundColor: filter === "active" ? "green" : "#f0f0f0" }}
      >
        Active
      </button>
      |
      <button
        onClick={() => setFilter("done")}
        style={{ backgroundColor: filter === "done" ? "green" : "#f0f0f0" }}
      >
        Done
      </button>
      <label htmlFor="">Sort by</label>
      <select
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
      <input type="text" value={search} onChange={onSearchChange} />
    </>
  );
};

export default ControlsBar;
