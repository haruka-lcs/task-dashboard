// FilterButtonコンポーネントを読み込んでいる
// 実際のフィルターボタン1つ分を表示するために使う
import FilterButton from "./FilterButton";

// TaskContextからuseTaskを読み込んでいる
// 現在のフィルター状態や、フィルターを変更する関数を使うため
import { useTask } from "../contexts/TaskContext";

// FilterBarコンポーネントを定義している
function FilterBar() {
  // TaskContextからfilterとsetFilterを取り出している
  // filterは現在選択されているフィルター
  // setFilterはフィルターを変更するための関数
  const { filter, setFilter } = useTask();

  // 表示するフィルターの種類を配列で用意している
  // この配列の中身をもとにボタンを作る
  const filters = ["すべて", "未着手", "進行中", "完了"];

  // 画面に表示する内容を返している
  return (
    // フィルターボタン全体を囲むdiv
    // CSSで横並びなどの見た目を整えるためにclassNameを付けている
    <div className="filter-bar">

      {/* filters配列の中身を1つずつ取り出して、FilterButtonを作っている */}
      {filters.map((item) => (

        // フィルターボタン1つ分を表示している
        <FilterButton

          // Reactがリストを区別するためのkey
          // 今回は「すべて」「未着手」など、重複しない文字を使っている
          key={item}

          // ボタンに表示する文字を渡している
          // 例：「すべて」「未着手」「進行中」「完了」
          label={item}

          // 現在選択中のフィルターと、このボタンの文字が同じか判定している
          // 同じならtrueになり、選択中の見た目にできる
          isActive={filter === item}

          // ボタンがクリックされたときに実行する処理
          // filterの値をクリックされた項目に変更している
          onClick={() => setFilter(item)}
        />
      ))}
    </div>
  );
}

// FilterBarコンポーネントを他のファイルで使えるようにしている
export default FilterBar;