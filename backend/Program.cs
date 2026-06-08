using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// OpenAPI / Swagger 用
builder.Services.AddOpenApi();

// Entity Framework Core + SQLite の設定
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("ReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// タスク一覧取得
app.MapGet("/tasks", async (AppDbContext context) =>
{
    var tasks = await context.Tasks.ToListAsync();

    return Results.Ok(tasks);
});

// タスク登録 Create
app.MapPost("/tasks", async (TaskItem task, AppDbContext context) =>
{
    task.CreatedAt = DateTime.Now;

    context.Tasks.Add(task);
    await context.SaveChangesAsync();

    return Results.Created($"/tasks/{task.Id}", task);
});

app.Run();