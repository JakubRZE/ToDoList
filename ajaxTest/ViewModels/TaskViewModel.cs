using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ajaxTest.ViewModels
{
    public class TaskViewModel
    {
        public int ID { get; set; }

        public string Description { get; set; }

        public bool IsDone { get; set; }
    }
}