// FilterButtonコンポーネントを定義している
// propsとして label / isActive / onClick を受け取っている
function FilterButton({ label, isActive, onClick }) {
  // 画面に表示する内容を返している
  return (
    // フィルター用のbuttonタグを表示している
    <button

      // ボタンにCSS用のクラス名を付けている
      // isActiveがtrueなら "active" クラスも追加される
      // isActiveがfalseなら "active" は付かない
      className={`filter-button ${isActive ? "active" : ""}`}

      // ボタンがクリックされたときに、親から受け取ったonClick関数を実行する
      onClick={onClick}
    >
      {/* ボタンに表示する文字を表示している */}
      {label}
    </button>
  );
}

// FilterButtonコンポーネントを他のファイルで使えるようにしている
export default FilterButton;