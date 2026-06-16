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
            status = task.Status != null ? task.Status.Name : ""
        })
        .ToListAsync();

    return Results.Ok(tasks);
});

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
        Status = status
    };

    context.Tasks.Add(task);
    await context.SaveChangesAsync();

    return Results.Created($"/api/tasks/{task.Id}", new
    {
        id = task.Id,
        title = task.Title,
        assignee = user.Name,
        priority = priority.Name,
        status = status.Name
    });
});

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
}