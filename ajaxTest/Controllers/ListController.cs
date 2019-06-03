using ajaxTest.DAL;
using ajaxTest.Models;
using ajaxTest.ViewModels;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ajaxTest.Controllers
{
    public class ListController : Controller
    {
        ApplicationDbContext db = new ApplicationDbContext();
        // GET: Student
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult createList(List list)
        {
            try
            {
                db.Lists.Add(list);
                db.SaveChanges();
            }
            catch (DataException dex)
            {
                string message = dex.ToString();
                return Json(new { success = false, responseText = message, JsonRequestBehavior.AllowGet });
            }

            return Json(new { success = true, JsonRequestBehavior.AllowGet });

            //return Json(new { success = false, responseText = "Invalid data" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getList()
        {
            try
            {
                var lists = db.Lists.OrderByDescending(o => o.ID).Select(x => new ListViewModel
                {

                    ID = x.ID,
                    Name = x.Name,
                    //CreatedAt = x.CreatedAt,
                    Tasks = db.Tasks.Where(c => c.ListID == x.ID).OrderBy(o => o.ID).Select(y => new TaskViewModel
                    {
                        ID = y.ID,
                        Description = y.Description
                        //IsDone = y.IsDone

                    }).ToList()

                }).ToList();

                return Json(lists, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                throw;
            }
        }


        // POST: Documents/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            //Document document = db.Documents.Find(id);
            //db.Documents.Remove(document);
            //db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}