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
        public ActionResult<EmployeeEntry> Post()
        {
            EmployeeEntry newEntry = new EmployeeEntry()
            {
                Date = DateTime.Now,
                InTime = DateTime.Now,
                OutTime = null,
            };

            var user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;
            var result = _applicationDbContext.EmployeeEntries.Where((entry) => entry.Date.Day == newEntry.Date.Day).FirstOrDefault();

            if(result == null)
            {
                _applicationDbContext.Users.FirstOrDefault((x) => x.Id == user.Id).EmployeeEntries.Add(newEntry);

                _applicationDbContext.SaveChanges();

                return Ok(newEntry);
            }
            else
            {
                return Ok(result);
            }
        }

        [HttpPut("[action]")]
        public ActionResult<EmployeeEntry> AddOutTime()
        {
            ApplicationUser user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;
            _applicationDbContext.Entry(user).Collection(x => x.EmployeeEntries).Load();

            var entry = user.EmployeeEntries.Where((x) => x.Date.Day == DateTime.Now.Day).FirstOrDefault();

            entry.OutTime = DateTime.Now;
            _applicationDbContext.SaveChanges();

            return Ok(entry);
        }

        [HttpPost("[action]")]
        public ActionResult<EmployeeEntry> AddBreak()
        {
            ApplicationUser user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;
            _applicationDbContext.Entry(user).Collection(x => x.EmployeeEntries).Load();

            EmployeeEntry employeeEntry = user.EmployeeEntries.Where((entry) => entry.Date.Day == DateTime.Now.Day).FirstOrDefault();
            Break breakTime = new Break()
            {
                BreakStart = DateTime.Now,
            };
            employeeEntry.Breaks.Add(breakTime);

            _applicationDbContext.SaveChanges();

            return Ok(employeeEntry);
        }

        [HttpPut("[action]")]
        public ActionResult<Break> UpdateBreak()
        {
            ApplicationUser user = _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value).Result;
            _applicationDbContext.Entry(user).Collection(x => x.EmployeeEntries).Load();

            EmployeeEntry employeeEntry = user.EmployeeEntries.Where((entry) => entry.Date.Day == DateTime.Now.Day).FirstOrDefault();

            var updatedTime = _applicationDbContext.Breaks.FirstOrDefault((x) => x.EmployeeEntry.Id== employeeEntry.Id && x.BreakFinished == null);

            updatedTime.BreakFinished = DateTime.Now;

            _applicationDbContext.SaveChanges();

           
            return Ok(updatedTime);

        }
       
    }
}
