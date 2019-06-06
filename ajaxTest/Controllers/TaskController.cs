using ajaxTest.DAL;
using ajaxTest.Models;
using ajaxTest.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ajaxTest.Controllers
{
    public class TaskController : Controller
    {
        ApplicationDbContext db = new ApplicationDbContext();

        public JsonResult getTask(int id)
        {
            try
            {
                var Tasks = db.Tasks.Where(c => c.ListID == id).OrderBy(o => o.ID).Select(y => new TaskViewModel
                {
                    ID = y.ID,
                    Description = y.Description,
                    IsDone = y.IsDone

                }).ToList();

                var data = new { tasks = Tasks, listId = id };
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (DataException dex)
            {
                string message = dex.ToString();
                return Json(new { success = false, responseText = message, JsonRequestBehavior.AllowGet });
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult createTask(Task task)
        {
            try
            {
                db.Tasks.Add(task);
                db.SaveChanges();
            }
            catch (DataException dex)
            {
                string message = dex.ToString();
                return Json(new { success = false, responseText = message, JsonRequestBehavior.AllowGet });
            }

            return Json(new { success = true, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult updateTask(int id, bool isDone)
        {
            try
            {
                Task task = db.Tasks.Find(id);
                task.IsDone = isDone;
                db.Entry(task).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
            }
            catch (DataException dex)
            {
                string message = dex.ToString();
                return Json(new { success = false, responseText = message, JsonRequestBehavior.AllowGet });
            }

            return Json(new { success = true, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteTask(int id)
        {
            try
            {
                Task task = db.Tasks.Find(id);
                db.Tasks.Remove(task);
                db.SaveChanges();
            }
            catch (DataException dex)
            {
                string message = dex.ToString();
                return Json(new
                {
                    success = false,
                    responseText = message,
                    JsonRequestBehavior.AllowGet
                });
            }

            return Json(new { success = true, JsonRequestBehavior.AllowGet });
        }
    }
}