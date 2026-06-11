using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class TaskContext : DbContext
{
    public TaskContext(DbContextOptions<TaskContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }
}