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
    return await context.Tasks.ToListAsync();
});

app.MapPost("/api/tasks", async (TaskItem task, TaskContext context) =>
{
    context.Tasks.Add(task);
    await context.SaveChangesAsync();

    return Results.Created($"/api/tasks/{task.Id}", task);
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