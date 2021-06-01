using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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

            var allEntries = _applicationDbContext.EmployeeEntries.ToList();

            foreach(EmployeeEntry employeeEntry in allEntries)
            {
                List<Break> breaks = new List<Break>();
                _applicationDbContext.Entry(employeeEntry).Collection(em => em.Breaks).Load();

                foreach(Break b in employeeEntry.Breaks)
                {
                    breaks.Add(b);
                }

                employeeEntry.Breaks = breaks;
                employeeEntries.Add(employeeEntry);
            }

            return employeeEntries;
        }

        // GET api/<EmployeeController>/5
        [HttpGet("[action]")]
        public IEnumerable<EmployeeEntry> GetAuthUserEntryDetails()
        {
            List<EmployeeEntry> employeeEntries = new List<EmployeeEntry>();

            ApplicationUser user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;

            _applicationDbContext.Entry(user).Collection(x => x.EmployeeEntries).Load();

            foreach (EmployeeEntry employeeEntry in user.EmployeeEntries)
            {
                List<Break> breaks = new List<Break>();
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

        // POST api/<EmployeeController>
        [HttpPost]
        public ActionResult<EmployeeEntry> Post([FromBody] EmployeeEntry employeeEntry)
        {
            EmployeeEntry newEntry = new EmployeeEntry()
            {
                Date = DateTime.Now,
                InTime = DateTime.Now,
                OutTime = employeeEntry.OutTime,
                Breaks = employeeEntry.Breaks,
            };


            var user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;

            _applicationDbContext.Users.FirstOrDefault((x) => x.Id == user.Id).EmployeeEntries.Add(newEntry);

            _applicationDbContext.SaveChanges();

            return Ok(newEntry);
        }

        [HttpPost("[action]")]
        public ActionResult<Break> AddBreak(int id)
        {
            EmployeeEntry employeeEntry = _applicationDbContext.EmployeeEntries.FirstOrDefault((x) => x.Id == id);
            Break breakTime = new Break()
            {
                BreakStart = DateTime.Now,
            };
            employeeEntry.Breaks.Add(breakTime);

            _applicationDbContext.SaveChanges();

            return Ok(breakTime);
        }

        [HttpPut("[action]")]
        public ActionResult<Break> UpdateBreak(int breakId)
        {
            var updatedTime = _applicationDbContext.Breaks.FirstOrDefault((x) => x.Id == breakId);

            updatedTime.BreakFinished = DateTime.Now;

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
