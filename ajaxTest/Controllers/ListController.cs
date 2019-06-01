﻿using ajaxTest.DAL;
using ajaxTest.Models;
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
            List<List> lists = new List<List>();
            lists = db.Lists.OrderByDescending(q => q.ID).ToList();
            return Json(lists, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getTask(int id)
        {
            List<Task> tasks = new List<Task>();

            tasks = db.Tasks.Where(
            s => s.List.ID == id).OrderByDescending(q => q.ID).ToList();

            return Json(tasks, JsonRequestBehavior.AllowGet);
        }
    }
}