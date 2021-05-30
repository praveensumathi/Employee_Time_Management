using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class EmployeeController:ControllerBase
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public EmployeeController(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
        {
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
        }

        [HttpGet]
        public IEnumerable<EmployeeEntry> Get()
        {
            List<EmployeeEntry> employeeEntries = new List<EmployeeEntry>();
            List<Break> breaks = new List<Break>();

            var result = User;
            ApplicationUser user = _userManager.FindByNameAsync(User.Identity.Name).Result;

            _applicationDbContext.Entry(user).Collection(x => x.EmployeeEntries).Load();

            foreach (EmployeeEntry employeeEntry in user.EmployeeEntries)
            {
                _applicationDbContext.Entry(employeeEntry).Collection(em => em.Breaks).Load();
                foreach (Break b in employeeEntry.Breaks)
                {
                    breaks.Add(b);
                }

                employeeEntry.Breaks = breaks;

                employeeEntries.Add(employeeEntry);
            }

            return employeeEntries;
        }

        // GET api/<EmployeeController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<EmployeeController>
        [HttpPost]
        public ActionResult<IList<EmployeeEntry>> Post([FromBody] EmployeeEntry employeeEntry)
        {
            EmployeeEntry employee = new EmployeeEntry()
            {
                Date = DateTime.Now,
                InTime = DateTime.Now,
                OutTime = employeeEntry.OutTime,
                Breaks = employeeEntry.Breaks,
            };

            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;

            _applicationDbContext.Users.FirstOrDefault((x) => x.Id == user.Id).EmployeeEntries.Add(employee);

            _applicationDbContext.SaveChanges();

            return Ok(user.EmployeeEntries.ToList());
        }

        [HttpPost("[action]")]
        public ActionResult<EmployeeEntry> AddBreak(int id, [FromBody] Break times)
        {
            EmployeeEntry employeeEntry = _applicationDbContext.EmployeeEntries.FirstOrDefault((x) => x.Id == id);
            Break time = new Break()
            {
                BreakStart = times.BreakStart,
            };
            employeeEntry.Breaks.Add(time);

            _applicationDbContext.SaveChanges();

            return Ok(employeeEntry);
        }

        [HttpPut("[action]")]
        public ActionResult<Break> UpdateBreak(int breakId, [FromBody] Break times)
        {
            var updatedTime = _applicationDbContext.Breaks.FirstOrDefault((x) => x.Id == breakId);

            updatedTime.BreakFinished = times.BreakFinished;

            _applicationDbContext.SaveChanges();

            return Ok(updatedTime);

        }
        // DELETE api/<EmployeeController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
