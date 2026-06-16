namespace backend.Models;

public class Priority
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<TaskItem> Tasks { get; set; } = new();
}