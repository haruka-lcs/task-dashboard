using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TaskContext>(options =>
    options.UseSqlite("Data Source=tasks.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp");

// タスク一覧取得
app.MapGet("/api/tasks", async (TaskContext context) =>
{
    var tasks = await context.Tasks
        .Include(task => task.User)
        .Include(task => task.Priority)
        .Include(task => task.Status)
        .Select(task => new
        {
            id = task.Id,
            title = task.Title,
            assignee = task.User != null ? task.User.Name : "",
            priority = task.Priority != null ? task.Priority.Name : "",
            status = task.Status != null ? task.Status.Name : "",
            description = task.Description
        })
        .ToListAsync();

    return Results.Ok(tasks);
});

// 担当者一覧取得
app.MapGet("/api/users", async (TaskContext context) =>
{
    var users = await context.Users
        .Select(user => new
        {
            id = user.Id,
            name = user.Name
        })
        .ToListAsync();

    return Results.Ok(users);
});

// 担当者追加
app.MapPost("/api/users", async (CreateUserRequest request, TaskContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest("担当者名を入力してください");
    }

    var userName = request.Name.Trim();

    var existingUser = await context.Users
        .FirstOrDefaultAsync(user => user.Name == userName);

    if (existingUser is not null)
    {
        return Results.Ok(new
        {
            id = existingUser.Id,
            name = existingUser.Name
        });
    }

    var user = new User
    {
        Name = userName
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return Results.Created($"/api/users/{user.Id}", new
    {
        id = user.Id,
        name = user.Name
    });
});

// 優先度一覧取得
app.MapGet("/api/priorities", async (TaskContext context) =>
{
    var priorities = await context.Priorities
        .Select(priority => new
        {
            id = priority.Id,
            name = priority.Name
        })
        .ToListAsync();

    return Results.Ok(priorities);
});

// ステータス一覧取得
app.MapGet("/api/statuses", async (TaskContext context) =>
{
    var statuses = await context.Statuses
        .Select(status => new
        {
            id = status.Id,
            name = status.Name
        })
        .ToListAsync();

    return Results.Ok(statuses);
});

// タスク追加
app.MapPost("/api/tasks", async (CreateTaskRequest request, TaskContext context) =>
{
    var user = await context.Users
        .FirstOrDefaultAsync(user => user.Name == request.Assignee);

    if (user is null)
    {
        user = new User
        {
            Name = request.Assignee
        };

        context.Users.Add(user);
    }

    var priority = await context.Priorities
        .FirstOrDefaultAsync(priority => priority.Name == request.Priority);

    if (priority is null)
    {
        priority = new Priority
        {
            Name = request.Priority
        };

        context.Priorities.Add(priority);
    }

    var status = await context.Statuses
        .FirstOrDefaultAsync(status => status.Name == request.Status);

    if (status is null)
    {
        status = new Status
        {
            Name = request.Status
        };

        context.Statuses.Add(status);
    }

    var task = new TaskItem
    {
        Title = request.Title,
        User = user,
        Priority = priority,
        Status = status,
        Description = request.Description
    };

    context.Tasks.Add(task);
    await context.SaveChangesAsync();

    return Results.Created($"/api/tasks/{task.Id}", new
    {
        id = task.Id,
        title = task.Title,
        assignee = user.Name,
        priority = priority.Name,
        status = status.Name,
        description = task.Description
    });
});

// タスク更新
app.MapPut("/api/tasks/{id}", async (int id, CreateTaskRequest request, TaskContext context) =>
{
    var task = await context.Tasks
        .Include(task => task.User)
        .Include(task => task.Priority)
        .Include(task => task.Status)
        .FirstOrDefaultAsync(task => task.Id == id);

    if (task is null)
    {
        return Results.NotFound();
    }

    var user = await context.Users
        .FirstOrDefaultAsync(user => user.Name == request.Assignee);

    if (user is null)
    {
        user = new User
        {
            Name = request.Assignee
        };

        context.Users.Add(user);
    }

    var priority = await context.Priorities
        .FirstOrDefaultAsync(priority => priority.Name == request.Priority);

    if (priority is null)
    {
        priority = new Priority
        {
            Name = request.Priority
        };

        context.Priorities.Add(priority);
    }

    var status = await context.Statuses
        .FirstOrDefaultAsync(status => status.Name == request.Status);

    if (status is null)
    {
        status = new Status
        {
            Name = request.Status
        };

        context.Statuses.Add(status);
    }

    task.Title = request.Title;
    task.User = user;
    task.Priority = priority;
    task.Status = status;
    task.Description = request.Description;

    await context.SaveChangesAsync();

    return Results.Ok(new
    {
        id = task.Id,
        title = task.Title,
        assignee = user.Name,
        priority = priority.Name,
        status = status.Name,
        description = task.Description
    });
});

// タスク削除
app.MapDelete("/api/tasks/{id}", async (int id, TaskContext context) =>
{
    var task = await context.Tasks.FindAsync(id);

    if (task is null)
    {
        return Results.NotFound();
    }

    context.Tasks.Remove(task);
    await context.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;

    public string Assignee { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}

public class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
}