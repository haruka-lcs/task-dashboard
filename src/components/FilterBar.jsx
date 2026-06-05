import FilterButton from "./FilterButton";
import { useTask } from "../contexts/TaskContext";

function FilterBar() {
  const { filter, setFilter } = useTask();

  const filters = ["すべて", "未着手", "進行中", "完了"];

  return (
    <div className="filter-bar">
      {filters.map((item) => (
        <FilterButton
          key={item}
          label={item}
          isActive={filter === item}
          onClick={() => setFilter(item)}
        />
      ))}
    </div>
  );
}

export default FilterBar;