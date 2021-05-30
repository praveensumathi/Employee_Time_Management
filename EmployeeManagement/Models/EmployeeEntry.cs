using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeManagement.Models
{
    public class EmployeeEntry
    {
        public EmployeeEntry()
        {
            Breaks = new List<Break>();
        }

        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime InTime { get; set; }
        public DateTime? OutTime { get; set; }

        public ICollection<Break> Breaks { get; set; }
    }
}
