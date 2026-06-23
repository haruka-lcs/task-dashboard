// このファイルが backend.Models という名前空間に属していることを表している
namespace backend.Models;

// TaskItem クラスを定義している
// DB上では Tasks テーブルの1件分のデータを表す
public class TaskItem
{
    // タスクのIDを表している
    // DBでは主キーとして使われる
    public int Id { get; set; }

    // タスクのタイトルを表している
    // 例：「Reactのフォーム修正」「面接準備」などが入る
    public string Title { get; set; } = string.Empty;

    // 担当者のIDを表している
    // UsersテーブルのIdと紐づく外部キー
    public int UserId { get; set; }

    // このタスクに紐づく担当者情報を表している
    // UserIdを使ってUsersテーブルのデータと関連付ける
    public User? User { get; set; }

    // 優先度のIDを表している
    // PrioritiesテーブルのIdと紐づく外部キー
    public int PriorityId { get; set; }

    // このタスクに紐づく優先度情報を表している
    // PriorityIdを使ってPrioritiesテーブルのデータと関連付ける
    public Priority? Priority { get; set; }

    // ステータスのIDを表している
    // StatusesテーブルのIdと紐づく外部キー
    public int StatusId { get; set; }

    // このタスクに紐づくステータス情報を表している
    // StatusIdを使ってStatusesテーブルのデータと関連付ける
    public Status? Status { get; set; }

    // タスクの詳細説明を表している
    // 例：「どんな作業をするか」「補足メモ」などが入る
    public string Description { get; set; } = string.Empty;
}