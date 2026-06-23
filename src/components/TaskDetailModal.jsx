// ReactのuseStateを読み込んでいる
// 入力内容や編集モード、エラーメッセージを管理するために使う
import { useState } from "react";

// TaskContextからuseTaskを読み込んでいる
// タスク更新処理を使うため
import { useTask } from "../contexts/TaskContext";

// TaskDetailModalコンポーネントを定義している
// propsとして task と onClose を受け取っている
function TaskDetailModal({ task, onClose }) {
  // TaskContextからupdateTask関数を取得している
  // 編集したタスクを保存するときに使う
  const { updateTask } = useTask();

  // 編集モードかどうかを管理している
  // falseなら詳細表示、trueなら編集フォームを表示する
  const [isEditing, setIsEditing] = useState(false);

  // タスク名の入力値を管理している
  // 初期値には現在のタスク名を入れている
  const [title, setTitle] = useState(task.title);

  // 担当者名の入力値を管理している
  // 初期値には現在の担当者名を入れている
  const [assignee, setAssignee] = useState(task.assignee);

  // 優先度の選択値を管理している
  // 初期値には現在の優先度を入れている
  const [priority, setPriority] = useState(task.priority);

  // ステータスの選択値を管理している
  // 初期値には現在のステータスを入れている
  const [status, setStatus] = useState(task.status);

  // 詳細説明の入力値を管理している
  // task.descriptionがない場合は空文字にしている
  const [description, setDescription] = useState(task.description || "");

  // タスク名のエラーメッセージを管理している
  const [titleError, setTitleError] = useState("");

  // 担当者名のエラーメッセージを管理している
  const [assigneeError, setAssigneeError] = useState("");

  // taskが存在しない場合は、何も表示しない
  if (!task) {
    return null;
  }

  // 保存ボタンが押されたときに実行される関数
  const handleSave = async () => {
    // 前回表示されていたタスク名エラーを消している
    setTitleError("");

    // 前回表示されていた担当者名エラーを消している
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

    // 担当者名が空、または空白だけの場合
    if (!assignee.trim()) {
      // 担当者名のエラーメッセージを設定している
      setAssigneeError("担当者名を入力してください");

      // エラーがある状態にしている
      hasError = true;
    }

    // 入力エラーがある場合
    if (hasError) {
      // 保存処理を止める
      return;
    }

    // 更新するタスク情報をオブジェクトとしてまとめている
    const updatedTask = {
      // 前後の空白を削除したタスク名を設定している
      title: title.trim(),

      // 前後の空白を削除した担当者名を設定している
      assignee: assignee.trim(),

      // 選択中の優先度を設定している
      priority: priority,

      // 選択中のステータスを設定している
      status: status,

      // 前後の空白を削除した詳細説明を設定している
      description: description.trim(),
    };

    // updateTask関数を実行して、バックエンドに更新内容を送っている
    // task.idは更新したいタスクのID
    // updatedTaskは更新後の内容
    const savedTask = await updateTask(task.id, updatedTask);

    // 更新に成功した場合
    if (savedTask) {
      // 編集モードを終了している
      setIsEditing(false);

      // タスク名のエラーを消している
      setTitleError("");

      // 担当者名のエラーを消している
      setAssigneeError("");

      // モーダルを閉じている
      onClose();
    }
  };

  // 画面に表示する内容を返している
  return (
    // モーダル全体の背景部分
    // 背景をクリックしたらモーダルを閉じる
    <div className="task-form-overlay" onClick={onClose}>

      {/* モーダル本体 */}
      <div
        // モーダル本体にCSS用のクラス名を付けている
        className="task-form-modal"

        // モーダル本体をクリックしたときに、背景クリック扱いにならないようにしている
        onClick={(event) => event.stopPropagation()}
      >
        {/* タスク詳細・編集画面全体 */}
        <div className="task-detail-view">

          {/* タイトル部分 */}
          <div className="task-detail-header">

            {/* 編集モードなら「タスク編集」、そうでなければ「タスク詳細」と表示する */}
            <h2>{isEditing ? "タスク編集" : "タスク詳細"}</h2>
          </div>

          {/* タスク名の表示・入力エリア */}
          <div className="task-form-row">

            {/* 項目名を表示している */}
            <label>タスク名</label>

            {/* 編集モードの場合はinput、詳細表示の場合は文字だけを表示する */}
            {isEditing ? (
              <>
                {/* タスク名を入力するinput */}
                <input
                  // テキスト入力欄にしている
                  type="text"

                  // inputに表示する値をtitleのstateと連動させている
                  value={title}

                  // 入力内容が変わったときに実行される処理
                  onChange={(event) => {
                    // 入力された値をtitleに保存している
                    setTitle(event.target.value);

                    // 入力値が空白だけでなければ
                    if (event.target.value.trim()) {
                      // タスク名のエラーを消している
                      setTitleError("");
                    }
                  }}
                />

                {/* titleErrorがある場合だけ、エラーメッセージを表示する */}
                {titleError && <p className="form-error">{titleError}</p>}
              </>
            ) : (
              // 詳細表示モードでは、タスク名を文字として表示する
              <div className="task-detail-value">{task.title}</div>
            )}
          </div>

          {/* 担当者名の表示・入力エリア */}
          <div className="task-form-row">

            {/* 項目名を表示している */}
            <label>担当者名</label>

            {/* 編集モードの場合はinput、詳細表示の場合は文字だけを表示する */}
            {isEditing ? (
              <>
                {/* 担当者名を入力するinput */}
                <input
                  // テキスト入力欄にしている
                  type="text"

                  // inputに表示する値をassigneeのstateと連動させている
                  value={assignee}

                  // 入力内容が変わったときに実行される処理
                  onChange={(event) => {
                    // 入力された値をassigneeに保存している
                    setAssignee(event.target.value);

                    // 入力値が空白だけでなければ
                    if (event.target.value.trim()) {
                      // 担当者名のエラーを消している
                      setAssigneeError("");
                    }
                  }}
                />

                {/* assigneeErrorがある場合だけ、エラーメッセージを表示する */}
                {assigneeError && (
                  <p className="form-error">{assigneeError}</p>
                )}
              </>
            ) : (
              // 詳細表示モードでは、担当者名を文字として表示する
              <div className="task-detail-value">{task.assignee}</div>
            )}
          </div>

          {/* 優先度の表示・選択エリア */}
          <div className="task-form-row">

            {/* 項目名を表示している */}
            <label>優先度</label>

            {/* 編集モードの場合はselect、詳細表示の場合は文字だけを表示する */}
            {isEditing ? (
              // 優先度を選択するselect
              <select
                // selectに表示する値をpriorityのstateと連動させている
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
            ) : (
              // 詳細表示モードでは、優先度を文字として表示する
              <div className="task-detail-value">{task.priority}</div>
            )}
          </div>

          {/* ステータスの表示・選択エリア */}
          <div className="task-form-row">

            {/* 項目名を表示している */}
            <label>ステータス</label>

            {/* 編集モードの場合はselect、詳細表示の場合は文字だけを表示する */}
            {isEditing ? (
              // ステータスを選択するselect
              <select
                // selectに表示する値をstatusのstateと連動させている
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
            ) : (
              // 詳細表示モードでは、ステータスを文字として表示する
              <div className="task-detail-value">{task.status}</div>
            )}
          </div>

          {/* 詳細説明の表示・入力エリア */}
          <div className="task-form-row">

            {/* 項目名を表示している */}
            <label>詳細</label>

            {/* 編集モードの場合はtextarea、詳細表示の場合は文字だけを表示する */}
            {isEditing ? (
              // 詳細説明を入力するtextarea
              <textarea
                // textareaに表示する値をdescriptionのstateと連動させている
                value={description}

                // 入力内容が変わったらdescriptionに保存している
                onChange={(event) => setDescription(event.target.value)}

                // 入力欄に薄く表示される案内文
                placeholder="タスクの内容・目的・注意点などを入力"

                // textareaの行数を5行にしている
                rows="5"
              />
            ) : (
              // 詳細表示モードでは、詳細説明を表示する
              <div className="task-detail-description">
                {/* 詳細説明がある場合は表示し、ない場合は未入力メッセージを表示する */}
                {task.description || "詳細は未入力です。"}
              </div>
            )}
          </div>

          {/* ボタンエリア */}
          <div className="task-form-actions">

            {/* 戻るボタン */}
            <button
              // 通常のボタンとして扱う
              type="button"

              // 戻るボタン用のCSSクラス
              className="task-form-back"

              // クリックされたらモーダルを閉じる
              onClick={onClose}
            >
              戻る
            </button>

            {/* 編集モードかどうかで、保存ボタンか編集ボタンを切り替える */}
            {isEditing ? (
              // 編集モードのときは保存ボタンを表示する
              <button
                // 通常のボタンとして扱う
                type="button"

                // 保存ボタン用のCSSクラス
                className="task-form-submit"

                // クリックされたら保存処理を実行する
                onClick={handleSave}
              >
                保存する
              </button>
            ) : (
              // 詳細表示モードのときは編集ボタンを表示する
              <button
                // 通常のボタンとして扱う
                type="button"

                // 編集ボタン用のCSSクラス
                className="task-form-submit"

                // クリックされたら編集モードに切り替える
                onClick={() => {
                  // タスク名のエラーを消している
                  setTitleError("");

                  // 担当者名のエラーを消している
                  setAssigneeError("");

                  // 編集モードをtrueにして、入力フォームを表示する
                  setIsEditing(true);
                }}
              >
                編集
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// TaskDetailModalコンポーネントを他のファイルで使えるようにしている
export default TaskDetailModal;