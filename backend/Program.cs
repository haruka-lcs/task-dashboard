// backend.Data 名前空間にある TaskContext を使えるようにしている
// TaskContext はデータベースとやり取りするためのクラス
using backend.Data;

// backend.Models 名前空間にある User / Priority / Status / TaskItem などを使えるようにしている
using backend.Models;

// Entity Framework Core を使えるようにしている
using Microsoft.EntityFrameworkCore;

// Webアプリケーションを作るための準備をしている
var builder = WebApplication.CreateBuilder(args);

// TaskContext をサービスとして登録している
// これにより、APIの中で TaskContext context と書くとDB操作ができるようになる
builder.Services.AddDbContext<TaskContext>(options =>
    // SQLiteを使う設定
    // tasks.db というデータベースファイルに接続している
    options.UseSqlite("Data Source=tasks.db"));

// CORSの設定を追加している
// React側とバックエンド側のURLが違っても通信できるようにするため
builder.Services.AddCors(options =>
{
    // AllowReactApp という名前のCORSルールを作成している
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            // ReactアプリのURLだけ通信を許可している
            .WithOrigins("http://localhost:5173")

            // どんなヘッダーでも許可している
            .AllowAnyHeader()

            // GET / POST / PUT / DELETE など、どのHTTPメソッドでも許可している
            .AllowAnyMethod();
    });
});

// ここまでの設定をもとにWebアプリを作成している
var app = builder.Build();

// AllowReactApp というCORS設定を実際に使うようにしている
app.UseCors("AllowReactApp");


// タスク一覧取得API
// React側から GET /api/tasks が送られてきたときに実行される
app.MapGet("/api/tasks", async (TaskContext context) =>
{
    // Tasksテーブルからタスク一覧を取得している
    var tasks = await context.Tasks

        // Taskに紐づくUser情報も一緒に取得している
        // これがないと task.User.Name が使えないことがある
        .Include(task => task.User)

        // Taskに紐づくPriority情報も一緒に取得している
        .Include(task => task.Priority)

        // Taskに紐づくStatus情報も一緒に取得している
        .Include(task => task.Status)

        // フロントに返しやすい形にデータを変換している
        .Select(task => new
        {
            // タスクIDを返している
            id = task.Id,

            // タスク名を返している
            title = task.Title,

            //空文字 "" を返す意味は、task.Statusが存在しないときに、エラーにならないようにするため
            // 担当者が存在する場合は担当者名を返し、存在しない場合は空文字を返している
            assignee = task.User != null ? task.User.Name : "",

            // 優先度が存在する場合は優先度名を返し、存在しない場合は空文字を返している
            priority = task.Priority != null ? task.Priority.Name : "",

            // ステータスが存在する場合はステータス名を返し、存在しない場合は空文字を返している
            status = task.Status != null ? task.Status.Name : "",

            // タスクの詳細説明を返している
            description = task.Description
        })

        // DBからデータをリストとして取得している
        .ToListAsync();

    // 取得したタスク一覧をフロントへ返している
    // HTTPステータスは200 OK
    return Results.Ok(tasks);
});


// 担当者一覧取得API
// React側から GET /api/users が送られてきたときに実行される
app.MapGet("/api/users", async (TaskContext context) =>
{
    // Usersテーブルから担当者一覧を取得している
    var users = await context.Users

        // フロントに返しやすい形に変換している
        .Select(user => new
        {
            // 担当者IDを返している
            id = user.Id,

            // 担当者名を返している
            name = user.Name
        })

        // DBから担当者一覧をリストとして取得している
        .ToListAsync();

    // 取得した担当者一覧をフロントへ返している
    return Results.Ok(users);
});


// 担当者追加API
// React側から POST /api/users が送られてきたときに実行される
app.MapPost("/api/users", async (CreateUserRequest request, TaskContext context) =>
{
    // 担当者名が空、または空白だけの場合
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        // 400 BadRequest を返して、担当者名の入力を求めている
        return Results.BadRequest("担当者名を入力してください");
    }

    // 入力された担当者名の前後の空白を削除している
    var userName = request.Name.Trim();

    // すでに同じ名前の担当者が存在するか確認している
    var existingUser = await context.Users
        .FirstOrDefaultAsync(user => user.Name == userName);

    // 同じ名前の担当者がすでに存在していた場合
    if (existingUser is not null)
    {
        // 新しく追加せず、既存の担当者情報を返している
        return Results.Ok(new
        {
            // 既存の担当者IDを返している
            id = existingUser.Id,

            // 既存の担当者名を返している
            name = existingUser.Name
        });
    }

    // 新しくUserオブジェクトを作成している
    var user = new User
    {
        // 担当者名を設定している
        Name = userName
    };

    // 作成した担当者をUsersテーブルに追加予約している
    context.Users.Add(user);

    // DBに保存している
    await context.SaveChangesAsync();

    // 新しく作成した担当者情報をフロントへ返している
    // HTTPステータスは201 Created
    return Results.Created($"/api/users/{user.Id}", new
    {
        // 新しく追加された担当者IDを返している
        id = user.Id,

        // 新しく追加された担当者名を返している
        name = user.Name
    });
});


// 優先度一覧取得API
// React側から GET /api/priorities が送られてきたときに実行される
app.MapGet("/api/priorities", async (TaskContext context) =>
{
    // Prioritiesテーブルから優先度一覧を取得している
    var priorities = await context.Priorities

        // フロントに返しやすい形に変換している
        .Select(priority => new
        {
            // 優先度IDを返している
            id = priority.Id,

            // 優先度名を返している
            name = priority.Name
        })

        // DBから優先度一覧をリストとして取得している
        .ToListAsync();

    // 取得した優先度一覧をフロントへ返している
    return Results.Ok(priorities);
});


// ステータス一覧取得API
// React側から GET /api/statuses が送られてきたときに実行される
app.MapGet("/api/statuses", async (TaskContext context) =>
{
    // Statusesテーブルからステータス一覧を取得している
    var statuses = await context.Statuses

        // フロントに返しやすい形に変換している
        .Select(status => new
        {
            // ステータスIDを返している
            id = status.Id,

            // ステータス名を返している
            name = status.Name
        })

        // DBからステータス一覧をリストとして取得している
        .ToListAsync();

    // 取得したステータス一覧をフロントへ返している
    return Results.Ok(statuses);
});


// タスク追加API
// React側から POST /api/tasks が送られてきたときに実行される
app.MapPost("/api/tasks", async (CreateTaskRequest request, TaskContext context) =>
{
    // Usersテーブルから、送られてきた担当者名と同じUserを探している
    var user = await context.Users
        .FirstOrDefaultAsync(user => user.Name == request.Assignee);

    // 同じ名前の担当者が存在しなかった場合
    if (user is null)
    {
        // 新しくUserオブジェクトを作成している
        user = new User
        {
            // リクエストで送られてきた担当者名を設定している
            Name = request.Assignee
        };

        // 新しい担当者をUsersテーブルに追加予約している
        context.Users.Add(user);
    }

    // Prioritiesテーブルから、送られてきた優先度名と同じPriorityを探している
    var priority = await context.Priorities
        .FirstOrDefaultAsync(priority => priority.Name == request.Priority);

    // 同じ優先度が存在しなかった場合
    if (priority is null)
    {
        // 新しくPriorityオブジェクトを作成している
        priority = new Priority
        {
            // リクエストで送られてきた優先度名を設定している
            Name = request.Priority
        };

        // 新しい優先度をPrioritiesテーブルに追加予約している
        context.Priorities.Add(priority);
    }

    // Statusesテーブルから、送られてきたステータス名と同じStatusを探している
    var status = await context.Statuses
        .FirstOrDefaultAsync(status => status.Name == request.Status);

    // 同じステータスが存在しなかった場合
    if (status is null)
    {
        // 新しくStatusオブジェクトを作成している
        status = new Status
        {
            // リクエストで送られてきたステータス名を設定している
            Name = request.Status
        };

        // 新しいステータスをStatusesテーブルに追加予約している
        context.Statuses.Add(status);
    }

    // 新しくTaskItemオブジェクトを作成している
    var task = new TaskItem
    {
        // タスク名を設定している
        Title = request.Title,

        // 担当者情報を紐づけている
        User = user,

        // 優先度情報を紐づけている
        Priority = priority,

        // ステータス情報を紐づけている
        Status = status,

        // タスク詳細を設定している
        Description = request.Description
    };

    // 新しいタスクをTasksテーブルに追加予約している
    context.Tasks.Add(task);

    // DBに保存している
    await context.SaveChangesAsync();

    // 作成したタスク情報をフロントへ返している
    // HTTPステータスは201 Created
    return Results.Created($"/api/tasks/{task.Id}", new
    {
        // 作成されたタスクIDを返している
        id = task.Id,

        // 作成されたタスク名を返している
        title = task.Title,

        // 担当者名を返している
        assignee = user.Name,

        // 優先度名を返している
        priority = priority.Name,

        // ステータス名を返している
        status = status.Name,

        // タスク詳細を返している
        description = task.Description
    });
});


// タスク更新API
// React側から PUT /api/tasks/{id} が送られてきたときに実行される
// {id} には更新したいタスクのIDが入る
app.MapPut("/api/tasks/{id}", async (int id, CreateTaskRequest request, TaskContext context) =>
{
    // Tasksテーブルから、指定されたIDのタスクを探している
    var task = await context.Tasks

        // タスクに紐づく担当者情報も一緒に取得している
        .Include(task => task.User)

        // タスクに紐づく優先度情報も一緒に取得している
        .Include(task => task.Priority)

        // タスクに紐づくステータス情報も一緒に取得している
        .Include(task => task.Status)

        // idが一致するタスクを1件だけ取得している
        .FirstOrDefaultAsync(task => task.Id == id);

    // 指定されたIDのタスクが存在しなかった場合
    if (task is null)
    {
        // 404 NotFoundを返している
        return Results.NotFound();
    }

    // Usersテーブルから、送られてきた担当者名と同じUserを探している
    var user = await context.Users
        .FirstOrDefaultAsync(user => user.Name == request.Assignee);

    // 同じ名前の担当者が存在しなかった場合
    if (user is null)
    {
        // 新しくUserオブジェクトを作成している
        user = new User
        {
            // リクエストで送られてきた担当者名を設定している
            Name = request.Assignee
        };

        // 新しい担当者をUsersテーブルに追加予約している
        context.Users.Add(user);
    }

    // Prioritiesテーブルから、送られてきた優先度名と同じPriorityを探している
    var priority = await context.Priorities
        .FirstOrDefaultAsync(priority => priority.Name == request.Priority);

    // 同じ優先度が存在しなかった場合
    if (priority is null)
    {
        // 新しくPriorityオブジェクトを作成している
        priority = new Priority
        {
            // リクエストで送られてきた優先度名を設定している
            Name = request.Priority
        };

        // 新しい優先度をPrioritiesテーブルに追加予約している
        context.Priorities.Add(priority);
    }

    // Statusesテーブルから、送られてきたステータス名と同じStatusを探している
    var status = await context.Statuses
        .FirstOrDefaultAsync(status => status.Name == request.Status);

    // 同じステータスが存在しなかった場合
    if (status is null)
    {
        // 新しくStatusオブジェクトを作成している
        status = new Status
        {
            // リクエストで送られてきたステータス名を設定している
            Name = request.Status
        };

        // 新しいステータスをStatusesテーブルに追加予約している
        context.Statuses.Add(status);
    }

    // 既存タスクのタスク名を、新しく送られてきた内容に更新している
    task.Title = request.Title;

    // 既存タスクの担当者を、新しく取得または作成したUserに更新している
    task.User = user;

    // 既存タスクの優先度を、新しく取得または作成したPriorityに更新している
    task.Priority = priority;

    // 既存タスクのステータスを、新しく取得または作成したStatusに更新している
    task.Status = status;

    // 既存タスクの詳細説明を、新しく送られてきた内容に更新している
    task.Description = request.Description;

    // 更新内容をDBに保存している
    await context.SaveChangesAsync();

    // 更新後のタスク情報をフロントへ返している
    // HTTPステータスは200 OK
    return Results.Ok(new
    {
        // 更新したタスクIDを返している
        id = task.Id,

        // 更新後のタスク名を返している
        title = task.Title,

        // 更新後の担当者名を返している
        assignee = user.Name,

        // 更新後の優先度名を返している
        priority = priority.Name,

        // 更新後のステータス名を返している
        status = status.Name,

        // 更新後の詳細説明を返している
        description = task.Description
    });
});


// タスク削除API
// React側から DELETE /api/tasks/{id} が送られてきたときに実行される
// {id} には削除したいタスクのIDが入る
app.MapDelete("/api/tasks/{id}", async (int id, TaskContext context) =>
{
    // Tasksテーブルから指定されたIDのタスクをDBから探している
    var task = await context.Tasks.FindAsync(id);

    // 指定されたIDのタスクが存在しなかった場合
    if (task is null)
    {
        // 404 NotFoundを返す
        return Results.NotFound();
    }

    // 見つかったタスクをTasksテーブルから削除予約している（削除対象みたいなもの）
    //実際にDBから削除されるのはSaveChangesAsync()が実行されたタイミング
    context.Tasks.Remove(task);

    // 削除内容をDBに保存している
    await context.SaveChangesAsync();

    // 削除成功を返している
    // NoContentは「返すデータはないけど成功した」toiu意味
    // HTTPステータスは204
    return Results.NoContent();
});


// アプリケーションを起動して、リクエストを受け付ける状態にしている
app.Run();


// タスク追加・更新のときに、React側から送られてくるデータの形を定義している
public class CreateTaskRequest
{
    // 以下受け取るプロパティ
    public string Title { get; set; } = string.Empty;

    public string Assignee { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}


// 担当者追加のときに、React側から送られてくるデータの形を定義している
public class CreateUserRequest
{
    // 担当者名を受け取るプロパティ
    public string Name { get; set; } = string.Empty;
}