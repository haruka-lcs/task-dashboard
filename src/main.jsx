import React from "react";

// ReactアプリをHTMLに表示するためのReactDOMを読み込んでいる
import ReactDOM from "react-dom/client";

// メインで表示するAppコンポーネントを読み込んでいる
import App from "./App";
import App2 from "./App2";

// タスク情報をアプリ全体で使えるようにするTaskProviderを読み込んでいる
import { TaskProvider } from "./contexts/TaskContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.css";

// HTMLのid="root"の要素を取得して、そこにReactアプリを表示する準備をしている
ReactDOM.createRoot(document.getElementById("root")).render(

  //上から順番に、テーマ情報をAppの中で使えるようにしている
  //Reactの開発用チェック機能を有効にしている
  //タスク情報をAppの中で使えるようにしている
  //メインのAppコンポーネントを表示している
  <React.StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ThemeProvider>

    <App2 />
  </React.StrictMode>
);