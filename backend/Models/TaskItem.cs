namespace backend.Models;

public class TaskItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User? User { get; set; }

    public int PriorityId { get; set; }
    public Priority? Priority { get; set; }

    public int StatusId { get; set; }
    public Status? Status { get; set; }
    public string Description { get; set; } = string.Empty;
}