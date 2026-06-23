// backend.Models 名前空間にあるモデルクラスを使えるようにしている
// TaskItem / User / Priority / Status など使うため
using backend.Models;

// Entity Framework Core を使えるようにしている
// DbContext や DbSet を使うために必要
using Microsoft.EntityFrameworkCore;

// このファイルが backend.Data という名前空間に属していることを表している
namespace backend.Data;

// TaskContext クラスを定義している
// DbContext を継承することで、データベース操作用のクラスになる
public class TaskContext : DbContext
{
    // TaskContext のコンストラクタ
    // Program.cs で設定したDB接続情報を受け取っている
    public TaskContext(DbContextOptions<TaskContext> options)

        // 受け取ったDB接続情報を親クラスである DbContext に渡している
        : base(options)
    {
        // コンストラクタの中身、今回は書いてないので処理はしていない
    }

    // Tasks テーブルを表している
    // TaskItem クラスのデータをDBのTasksテーブルとして扱えるようにしている
    public DbSet<TaskItem> Tasks { get; set; }

    // User クラスのデータをDBのUsersテーブルとして扱えるようにしている
    public DbSet<User> Users { get; set; }

    // Priority クラスのデータをDBのPrioritiesテーブルとして扱えるようにしている
    public DbSet<Priority> Priorities { get; set; }

    // Status クラスのデータをDBのStatusesテーブルとして扱えるようにしている
    public DbSet<Status> Statuses { get; set; }
}