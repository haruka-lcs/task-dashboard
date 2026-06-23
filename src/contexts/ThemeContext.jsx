// ReactからContextとstate管理に必要な機能を読み込んでいる
import { createContext, useContext, useState } from "react";

// ThemeContextを作成している
// テーマ情報をアプリ全体で共有するための箱
const ThemeContext = createContext();

// ThemeProviderコンポーネントを定義している
// childrenには、このProviderで囲まれたコンポーネントが入る
export function ThemeProvider({ children }) {
  // 現在のテーマを管理している
  // 初期値は"light"なので、最初はライトモード
  const [theme, setTheme] = useState("light");

  // テーマを切り替える関数を定義している
  const toggleTheme = () => {
    // 現在のテーマを見て、lightならdark、darkならlightに切り替えている
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Contextで共有する値をProviderに渡している
  return (
    // themeとtoggleThemeを、Providerで囲まれた子コンポーネント全体で使えるようにしている
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Providerで囲まれた子コンポーネントを表示している */}
      {children}
    </ThemeContext.Provider>
  );
}

// ThemeContextを簡単に使うためのカスタムフックを定義している
export function useTheme() {
  // ThemeContextに保存されているthemeやtoggleThemeを取得して返している
  return useContext(ThemeContext);
}