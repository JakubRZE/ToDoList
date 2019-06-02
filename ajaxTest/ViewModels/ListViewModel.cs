using ajaxTest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ajaxTest.ViewModels
{
    public class ListViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        //public DateTime CreatedAt { get; set; }

        public List<TaskViewModel> Tasks { get; set; }
    }
}