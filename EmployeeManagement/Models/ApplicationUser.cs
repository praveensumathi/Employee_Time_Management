using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeManagement.Models
{
    public class ApplicationUser : IdentityUser
    {
#nullable enable
        public IList<EmployeeEntry>? EmployeeEntries { get; set; }
#nullable disable

        public ApplicationUser()
        {
            EmployeeEntries = new List<EmployeeEntry>();
        }
    }
}
