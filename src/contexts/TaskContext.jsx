// Reactから必要な機能を読み込んでいる
import {
  // Contextを作るために使う
  createContext,

  // 作ったContextの値を使うために使う
  useContext,

  // 画面表示時など、処理を実行するために使う
  useEffect,

  // 状態を管理するために使う
  useState,
} from "react";

// TaskContextを作成している
// タスク情報や関数をアプリ全体で共有するための箱
const TaskContext = createContext();

// バックエンドAPIのURLを定数としてまとめている
// タスクの取得・追加・更新・削除で使う
const API_URL = "http://localhost:5228/api/tasks";

// TaskProviderコンポーネントを定義している
// childrenには、このProviderで囲まれたコンポーネントが入る
export function TaskProvider({ children }) {
  // タスク一覧を管理している
  // 初期値は空配列
  const [tasks, setTasks] = useState([]);

  // 現在選択されているフィルターを管理してる
  // 初期値は「すべて」
  const [filter, setFilter] = useState("すべて");

  // タスク取得中かどうかを管理している
  // 初期値はtrueなので、最初は読み込み中扱い
  const [loading, setLoading] = useState(true);

  // エラーメッセージを管理してる
  // エラーがないときは空文字
  const [error, setError] = useState("");

  // コンポーネントが最初に表示されたときに実行される処理
  useEffect(() => {
    // タスク一覧を取得する関数を定義してる
    const fetchTasks = async () => {
      try {
        // タスク取得開始なので、loadingをtrueにしてる
        setLoading(true);

        // 前回のエラーを消している
        setError("");

        // バックエンドのタスク一覧取得APIにGETリクエストを送っている
        const response = await fetch(API_URL);

        // レスポンスが正常ではなかった場合
        if (!response.ok) {
          // エラーを発生させてcatchに処理を移す
          throw new Error("タスクの取得に失敗しました");
        }

        // レスポンスのJSONデータをJavaScriptのデータに変換している
        const data = await response.json();

        // 取得したタスク一覧をtasksに保存している
        setTasks(data);
      } catch (error) {
        // エラーが発生した場合、コンソールに表示している
        console.error(error);

        // 画面で使えるようにエラーメッセージを保存している
        setError("タスクを取得できませんでした");
      } finally {
        // 成功しても失敗しても、取得処理は終わったのでloadingをfalseにする
        setLoading(false);
      }
    };

    // タスク一覧取得関数を実行している
    fetchTasks();

    // 空配列なので、最初に画面が表示されたときだけ実行される
  }, []);

  // 現在のfilterに合わせて、表示するタスク一覧を作っている
  const filteredTasks =
    // filterが「すべて」の場合
    filter === "すべて"
      // 全てのタスクを表示する
      ? tasks

      // filterが「すべて」以外の場合
      // タスクのstatusがfilterと一致するものだけを表示する
      : tasks.filter((task) => task.status === filter);

  // 新しいタスクを追加する関数
  const addTask = async (newTask) => {
    try {
      // 前回のエラーを消している
      setError("");

      // バックエンドのタスク追加APIにPOSTリクエストを送っている
      const response = await fetch(API_URL, {
        // POSTメソッドで送信する
        method: "POST",

        // JSON形式のデータを送ることを指定している
        headers: {
          "Content-Type": "application/json",
        },

        // 新しいタスク情報をJSON文字列に変換して送っている
        body: JSON.stringify(newTask),
      });

      // レスポンスが正常ではなかった場合
      if (!response.ok) {
        // エラーを発生させてcatchに処理を移す
        throw new Error("タスクの追加に失敗しました");
      }

      // バックエンドから返ってきた作成済みタスクを受け取っている
      const createdTask = await response.json();

      // 現在のタスク一覧の末尾に、新しく作成したタスクを追加している
      setTasks((prevTasks) => [...prevTasks, createdTask]);

      // タスク追加が成功したことを呼び出し元に返している
      return true;
    } catch (error) {
      // エラーが発生した場合、コンソールに表示している
      console.error(error);

      // 画面で使えるようにエラーメッセージを保存している
      setError("タスクを追加できませんでした");

      // タスク追加が失敗したことを呼び出し元に返している
      return false;
    }
  };

  // 既存のタスクを更新する関数
  // idは更新したいタスクのID
  // updatedTaskは更新後の内容
  const updateTask = async (id, updatedTask) => {
    try {
      // 前回のエラーを消している
      setError("");

      // バックエンドのタスク更新APIにPUTリクエストを送っている
      // 例　http://localhost:5228/api/tasks/1
      const response = await fetch(`${API_URL}/${id}`, {
        // PUTメソッドで送信する
        method: "PUT",

        // JSON形式のデータを送ることを指定している
        headers: {
          "Content-Type": "application/json",
        },

        // 更新後のタスク情報をJSON文字列に変換して送っている
        body: JSON.stringify(updatedTask),
      });

      // レスポンスが正常ではなかった場合
      if (!response.ok) {
        // エラーを発生させてcatchに処理を移す
        throw new Error("タスクの更新に失敗しました");
      }

      // バックエンドから返ってきた保存済みタスクを受け取っている
      const savedTask = await response.json();

      // tasksの中から、更新したタスクだけをsavedTaskに差し替えている
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          // task.idが更新対象のidと一致する場合
          task.id === id
            // 更新後のタスクに置き換える
            ? savedTask
            // それ以外のタスクはそのまま残す
            : task
        )
      );

      // 更新後のタスクを呼び出し元に返している
      return savedTask;
    } catch (error) {
      // エラーが発生した場合、コンソールに表示している
      console.error(error);

      // 画面で使えるようにエラーメッセージを保存している
      setError("タスクを更新できませんでした");

      // 更新失敗としてnullを返している
      return null;
    }
  };

  // タスクを削除する関数
  // idは削除したいタスクのID
  const deleteTask = async (id) => {
    try {
      // 前回のエラーを消している
      setError("");

      // バックエンドのタスク削除APIに削除リクエストを送っている
      // 例　http://localhost:5228/api/tasks/1
      const response = await fetch(`${API_URL}/${id}`, {
        // DELETEメソッドで送信する
        method: "DELETE",
      });

      // レスポンスが正常ではなかった場合
      //response は、fetchでバックエンドAPIにリクエストを送った結果として返ってくるもの
      if (!response.ok) {
        // エラーを発生させてcatchに処理を移す
        throw new Error("タスクの削除に失敗しました");
      }

      // 削除したタスクを、画面上のtasks一覧から取り除いている
      setTasks((prevTasks) =>
        // 削除対象のidと一致しないタスクだけを残す
        prevTasks.filter((task) => task.id !== id)
      );

      // 削除成功を呼び出し元に返している
      return true;
    } catch (error) {
      // エラーが発生した場合、コンソールに表示している
      console.error(error);

      // 画面で使えるようにエラーメッセージを保存している
      setError("タスクを削除できませんでした");

      // 削除失敗を呼び出し元に返している
      return false;
    }
  };

  // Contextで共有する値をProviderに渡している
  return (
    <TaskContext.Provider
      value={{
        // タスク一覧
        tasks,

        // 現在選択されているフィルター
        filter,

        // フィルターを変更する関数
        setFilter,

        // フィルター後のタスク一覧
        filteredTasks,

        // タスク追加関数
        addTask,

        // タスク更新関数
        updateTask,

        // タスク削除関数
        deleteTask,

        // 読み込み中かどうか
        loading,

        // エラーメッセージ
        error,
      }}
    >
      {/* Providerで囲まれた子コンポーネントを表示している */}
      {children}
    </TaskContext.Provider>
  );
}

// TaskContextを簡単に使うためのカスタムフックを定義している
export function useTask() {
  // TaskContextの値を取得している
  const context = useContext(TaskContext);

  // TaskProviderの外側でuseTaskが使われた場合
  if (!context) {
    // エラーを出して、正しく使うように知らせている
    throw new Error(
      "useTaskはTaskProviderの内側で使用してください"
    );
  }

  // TaskContextの値を返している
  return context;
}