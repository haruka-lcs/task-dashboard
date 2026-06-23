// このファイルが backend.Models という名前空間に属していることを表している
namespace backend.Models;

// User クラスを定義している
// DB上では Users テーブルの1件分のデータを表す
public class User
{
    // 担当者のIDを表している
    // DBでは主キーとして使われる
    public int Id { get; set; }

    // 担当者の名前を表している
    // 例：「ハル」「山田さん」などが入る
    public string Name { get; set; } = string.Empty;

    // この担当者に紐づくタスク一覧を表している
    // 例：「ハル」が担当しているタスクが複数入る
    public List<TaskItem> Tasks { get; set; } = new();
}