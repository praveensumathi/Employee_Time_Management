using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EmployeeManagement.Models
{
    public class Break
    {
        [Key]
        public int Id { get; set; }
        public DateTime? BreakStart { get; set; }
        public DateTime? BreakFinished { get; set; }

        [JsonIgnore]
        public EmployeeEntry EmployeeEntry { get; set; }
    }
}
