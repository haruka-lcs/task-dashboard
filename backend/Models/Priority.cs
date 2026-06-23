// このファイルが backend.Models という名前空間に属していることを表している
namespace backend.Models;

// Priority クラスを定義している
// DB上では Priorities テーブルの1件分のデータを表す
public class Priority
{
    // 優先度のIDを表している
    // DBでは主キーとして使われる
    public int Id { get; set; }

    // 優先度の名前を表している
    // 例：「低」「中」「高」などが入る
    public string Name { get; set; } = string.Empty;

    // この優先度に紐づくタスク一覧を表している
    // 例：「高」の優先度を持つタスクが複数入る
    public List<TaskItem> Tasks { get; set; } = new();
}