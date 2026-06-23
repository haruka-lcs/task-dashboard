// このファイルが backend.Models という名前空間に属していることを表している
namespace backend.Models;

// Status クラスを定義している
// DB上では Statuses テーブルの1件分のデータを表す
public class Status
{
    // ステータスのIDを表している
    // DBでは主キーとして使われる
    public int Id { get; set; }

    // ステータスの名前を表している
    // 例：「未着手」「進行中」「完了」などが入る
    public string Name { get; set; } = string.Empty;

    // このステータスに紐づくタスク一覧を表している
    // 例：「進行中」のステータスを持つタスクが複数入る
    public List<TaskItem> Tasks { get; set; } = new();
}