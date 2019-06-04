using ajaxTest.DAL;
using ajaxTest.Models;
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult createTask(Task task)
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

        //[HttpPost, ActionName("Delete")]
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