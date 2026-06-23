// ReactからuseEffectとuseStateを読み込んでいる
// useEffectは画面表示時などに処理を実行するために使う
// useStateは入力値やエラー状態などを管理するために使う
import { useEffect, useState } from "react";

// TaskContextからuseTaskを読み込んでいる
// addTask関数を使って、タスクを追加するため
import { useTask } from "../contexts/TaskContext";

// TaskFormコンポーネントを定義している
// propsとしてonCloseを受け取っている
// onCloseはフォームを閉じるための関数
function TaskForm({ onClose }) {
  // TaskContextからaddTask関数を取得している
  // タスク追加時に使う
  const { addTask } = useTask();

  // タスク名の入力値を管理している
  const [title, setTitle] = useState("");

  // 担当者名の選択値を管理している
  const [assignee, setAssignee] = useState("");

  // 優先度の選択値を管理している
  // 初期値は「中」
  const [priority, setPriority] = useState("中");

  // ステータスの選択値を管理している
  // 初期値は「未着手」
  const [status, setStatus] = useState("未着手");

  // 詳細説明の入力値を管理している
  const [description, setDescription] = useState("");

  // 担当者一覧を管理している
  // APIから取得した担当者データが入る
  const [users, setUsers] = useState([]);

  // 新しい担当者を追加する入力欄を表示するかどうかを管理している
  // trueなら追加欄を表示、falseなら非表示
  const [isAddingUser, setIsAddingUser] = useState(false);

  // 新しく追加する担当者名の入力値を管理している
  const [newUserName, setNewUserName] = useState("");

  // タスク名のエラーメッセージを管理している
  const [titleError, setTitleError] = useState("");

  // 担当者選択のエラーメッセージを管理している
  const [assigneeError, setAssigneeError] = useState("");

  // 新しい担当者名のエラーメッセージを管理している
  const [newUserNameError, setNewUserNameError] = useState("");

  // コンポーネントが最初に表示されたときに実行される処理
  useEffect(() => {
    // 担当者一覧を取得する関数を定義している
    const fetchUsers = async () => {
      try {
        // バックエンドの担当者一覧取得APIにリクエストを送っている
        const response = await fetch("http://localhost:5228/api/users");

        // レスポンスが正常ではなかった場合
        if (!response.ok) {
          // エラーを発生させてcatchに処理を移す
          throw new Error("担当者一覧の取得に失敗しました");
        }

        // レスポンスのJSONデータをJavaScriptのデータに変換している
        const data = await response.json();

        // 取得した担当者一覧をusersに保存している
        setUsers(data);
      } catch (error) {
        // エラーが発生した場合、コンソールに表示している
        console.error(error);
      }
    };

    // 担当者一覧を取得する関数を実行している
    fetchUsers();

    // 空配列なので、最初に画面が表示されたときだけ実行される
  }, []);

  // 新しい担当者を追加するときに実行される関数
  const handleAddUser = async () => {
    // 前回表示されていた新規担当者名のエラーを消している
    setNewUserNameError("");

    // 新しい担当者名が空、または空白だけの場合
    if (!newUserName.trim()) {
      // エラーメッセージを表示する
      setNewUserNameError("担当者名を入力してください");

      // ここで処理を止める
      return;
    }

    try {
      // バックエンドの担当者追加APIにPOSTリクエストを送っている
      const response = await fetch("http://localhost:5228/api/users", {
        // POSTメソッドで送信する
        method: "POST",

        // JSON形式のデータを送ることを指定している
        headers: {
          "Content-Type": "application/json",
        },

        // 送信するデータをJSON文字列に変換している
        body: JSON.stringify({
          // 前後の空白を削除した担当者名を送っている
          name: newUserName.trim(),
        }),
      });

      // レスポンスが正常ではなかった場合
      if (!response.ok) {
        // エラーを発生させてcatchに処理を移す
        throw new Error("担当者の追加に失敗しました");
      }

      // 追加された担当者データをJSONとして受け取っている
      const addedUser = await response.json();

      // usersの一覧を更新している
      setUsers((prevUsers) => {
        // すでに同じIDの担当者が一覧に存在するか確認している
        const exists = prevUsers.some((user) => user.id === addedUser.id);

        // すでに存在する場合
        if (exists) {
          // 何も追加せず、今の一覧をそのまま返す
          return prevUsers;
        }

        // 存在しない場合は、今の担当者一覧に追加した担当者を加える
        return [...prevUsers, addedUser];
      });

      // 追加した担当者を、現在選択中の担当者として設定している
      setAssignee(addedUser.name);

      // 担当者選択のエラーを消している
      setAssigneeError("");

      // 新規担当者名の入力欄を空にしている
      setNewUserName("");

      // 新規担当者名のエラーを消している
      setNewUserNameError("");

      // 担当者追加欄を閉じている
      setIsAddingUser(false);
    } catch (error) {
      // エラーが発生した場合、コンソールに表示している
      console.error(error);

      // 画面に担当者追加失敗のエラーを表示している
      setNewUserNameError("担当者の追加に失敗しました");
    }
  };

  // フォームが送信されたときに実行される関数
  const handleSubmit = async (event) => {
    // form送信時のページ再読み込みを防いでいる
    event.preventDefault();

    // 前回表示されていたタスク名エラーを消している
    setTitleError("");

    // 前回表示されていた担当者エラーを消している
    setAssigneeError("");

    // 入力エラーがあるかどうかを管理する変数
    let hasError = false;

    // タスク名が空、または空白だけの場合
    if (!title.trim()) {
      // タスク名のエラーメッセージを設定している
      setTitleError("タスク名を入力してください");

      // エラーがある状態にしている
      hasError = true;
    }

    // 担当者が選択されていない場合
    if (!assignee.trim()) {
      // 担当者のエラーメッセージを設定している
      setAssigneeError("担当者を選択してください");

      // エラーがある状態にしている
      hasError = true;
    }

    // 入力エラーがある場合
    if (hasError) {
      // タスク追加処理を止める
      return;
    }

    // 追加するタスク情報をオブジェクトとしてまとめている
    const newTask = {
      // 前後の空白を削除したタスク名
      title: title.trim(),

      // 前後の空白を削除した担当者名
      assignee: assignee.trim(),

      // 選択中の優先度
      priority: priority,

      // 選択中のステータス
      status: status,

      // 前後の空白を削除した詳細説明
      description: description.trim(),
    };

    // addTask関数を実行して、タスクを追加している
    // 成功したかどうかがisSuccessに入る
    const isSuccess = await addTask(newTask);

    // タスク追加に成功した場合
    if (isSuccess) {
      // タスク名を空に戻している
      setTitle("");

      // 担当者選択を空に戻している
      setAssignee("");

      // 優先度を初期値の「中」に戻している
      setPriority("中");

      // ステータスを初期値の「未着手」に戻している
      setStatus("未着手");

      // 詳細説明を空に戻している
      setDescription("");

      // 新規担当者名の入力欄を空にしている
      setNewUserName("");

      // 担当者追加欄を閉じている
      setIsAddingUser(false);

      // タスク名エラーを消している
      setTitleError("");

      // 担当者エラーを消している
      setAssigneeError("");

      // 新規担当者名エラーを消している
      setNewUserNameError("");

      // フォームを閉じている
      onClose();
    }
  };

  // 画面に表示する内容を返している
  return (
    // モーダル全体の背景部分
    <div className="task-form-overlay">

      {/* フォーム本体を囲むモーダル */}
      <div className="task-form-modal">

        {/* タスク追加フォーム */}
        {/* submitされたらhandleSubmitが実行される */}
        <form className="task-form" onSubmit={handleSubmit}>

          {/* タスク名入力エリア */}
          <div className="task-form-row">

            {/* タスク名入力欄のラベル */}
            <label htmlFor="title">タスク名</label>

            {/* タスク名を入力するinput */}
            <input
              // labelとinputを紐づけるためのid
              id="title"

              // テキスト入力欄にしている
              type="text"

              // inputの値をtitleのstateと連動させている
              value={title}

              // 入力内容が変わったときに実行される処理
              onChange={(event) => {
                // 入力された値をtitleに保存している
                setTitle(event.target.value);

                // 入力値が空白だけでなければ
                if (event.target.value.trim()) {
                  // タスク名エラーを消している
                  setTitleError("");
                }
              }}

              // 入力欄に薄く表示される案内文
              placeholder="タスク名を入力"
            />

            {/* titleErrorがある場合だけエラーメッセージを表示する */}
            {titleError && <p className="form-error">{titleError}</p>}
          </div>

          {/* 担当者選択エリア */}
          <div className="task-form-row">

            {/* 担当者選択欄のラベル */}
            <label htmlFor="assignee">担当者名</label>

            {/* 担当者選択と追加ボタンを横並びにするためのエリア */}
            <div className="assignee-select-row">

              {/* 担当者を選択するselect */}
              <select
                // labelとselectを紐づけるためのid
                id="assignee"

                // selectの値をassigneeのstateと連動させている
                value={assignee}

                // 選択内容が変わったときに実行される処理
                onChange={(event) => {
                  // 選択された担当者名をassigneeに保存している
                  setAssignee(event.target.value);

                  // 値が空でなければ
                  if (event.target.value.trim()) {
                    // 担当者エラーを消している
                    setAssigneeError("");
                  }
                }}
              >
                {/* 初期表示用の選択肢 */}
                <option value="">担当者を選択</option>

                {/* users配列をもとに担当者の選択肢を作っている */}
                {users.map((user) => (
                  // 担当者1人分のoption
                  <option key={user.id} value={user.name}>
                    {/* 選択肢に表示する担当者名 */}
                    {user.name}
                  </option>
                ))}
              </select>

              {/* 新しい担当者を追加する入力欄を表示するボタン */}
              <button
                // form送信ではなく、普通のボタンとして扱う
                type="button"

                // 担当者追加ボタン用のCSSクラス
                className="assignee-add-button"

                // クリックされたら担当者追加欄を表示する
                onClick={() => setIsAddingUser(true)}
              >
                ＋追加
              </button>
            </div>

            {/* assigneeErrorがある場合だけエラーメッセージを表示する */}
            {assigneeError && <p className="form-error">{assigneeError}</p>}

            {/* isAddingUserがtrueのときだけ、新規担当者追加欄を表示する */}
            {isAddingUser && (

              // 新規担当者追加エリア
              <div className="assignee-add-row">

                {/* 新しい担当者名を入力するinput */}
                <input
                  // テキスト入力欄
                  type="text"

                  // inputの値をnewUserNameのstateと連動させている
                  value={newUserName}

                  // 入力内容が変わったときに実行される処理
                  onChange={(event) => {
                    // 入力された値をnewUserNameに保存している
                    setNewUserName(event.target.value);

                    // 入力値が空白だけでなければ
                    if (event.target.value.trim()) {
                      // 新規担当者名エラーを消している
                      setNewUserNameError("");
                    }
                  }}

                  // 入力欄に薄く表示される案内文
                  placeholder="新しい担当者名"
                />

                {/* 新しい担当者を保存するボタン */}
                <button
                  // form送信ではなく、普通のボタンとして扱う
                  type="button"

                  // 保存ボタン用のCSSクラス
                  className="assignee-save-button"

                  // クリックされたら担当者追加処理を実行する
                  onClick={handleAddUser}
                >
                  保存
                </button>

                {/* 担当者追加をキャンセルするボタン */}
                <button
                  // form送信ではなく、普通のボタンとして扱う
                  type="button"

                  // キャンセルボタン用のCSSクラス
                  className="assignee-cancel-button"

                  // クリックされたときに実行される処理
                  onClick={() => {
                    // 新規担当者名を空にする
                    setNewUserName("");

                    // 新規担当者名エラーを消す
                    setNewUserNameError("");

                    // 担当者追加欄を閉じる
                    setIsAddingUser(false);
                  }}
                >
                  キャンセル
                </button>
              </div>
            )}

            {/* newUserNameErrorがある場合だけエラーメッセージを表示する */}
            {newUserNameError && (
              <p className="form-error">{newUserNameError}</p>
            )}
          </div>

          {/* 優先度選択エリア */}
          <div className="task-form-row">

            {/* 優先度選択欄のラベル */}
            <label htmlFor="priority">優先度</label>

            {/* 優先度を選択するselect */}
            <select
              // labelとselectを紐づけるためのid
              id="priority"

              // selectの値をpriorityのstateと連動させている
              value={priority}

              // 選択内容が変わったらpriorityに保存している
              onChange={(event) => setPriority(event.target.value)}
            >
              {/* 優先度「高」の選択肢 */}
              <option value="高">高</option>

              {/* 優先度「中」の選択肢 */}
              <option value="中">中</option>

              {/* 優先度「低」の選択肢 */}
              <option value="低">低</option>
            </select>
          </div>

          {/* ステータス選択エリア */}
          <div className="task-form-row">

            {/* ステータス選択欄のラベル */}
            <label htmlFor="status">ステータス</label>

            {/* ステータスを選択するselect */}
            <select
              // labelとselectを紐づけるためのid
              id="status"

              // selectの値をstatusのstateと連動させている
              value={status}

              // 選択内容が変わったらstatusに保存している
              onChange={(event) => setStatus(event.target.value)}
            >
              {/* ステータス「未着手」の選択肢 */}
              <option value="未着手">未着手</option>

              {/* ステータス「進行中」の選択肢 */}
              <option value="進行中">進行中</option>

              {/* ステータス「完了」の選択肢 */}
              <option value="完了">完了</option>
            </select>
          </div>

          {/* 詳細説明入力エリア */}
          <div className="task-form-row">

            {/* 詳細入力欄のラベル */}
            <label htmlFor="description">詳細</label>

            {/* 詳細説明を入力するtextarea */}
            <textarea
              // labelとtextareaを紐づけるためのid
              id="description"

              // textareaの値をdescriptionのstateと連動させている
              value={description}

              // 入力内容が変わったらdescriptionに保存している
              onChange={(event) => setDescription(event.target.value)}

              // 入力欄に薄く表示される案内文
              placeholder="タスクの内容・目的・注意点などを入力"

              // textareaの行数を5行にしている
              rows="5"
            />
          </div>

          {/* フォーム下部のボタンエリア */}
          <div className="task-form-actions">

            {/* フォームを閉じる戻るボタン */}
            <button
              // submitではなく、普通のボタンとして扱う
              type="button"

              // 戻るボタン用のCSSクラス
              className="task-form-back"

              // クリックされたらフォームを閉じる
              onClick={onClose}
            >
              戻る
            </button>

            {/* タスクを追加する送信ボタン */}
            <button
              // submitボタンなので、クリックするとformのonSubmitが動く
              type="submit"

              // 追加ボタン用のCSSクラス
              className="task-form-submit"
            >
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// TaskFormコンポーネントを他のファイルで使えるようにしている
export default TaskForm;