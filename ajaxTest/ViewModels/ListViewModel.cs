using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ajaxTest.ViewModels
{
    public class ListViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public List<Task> Tasks { get; set; }
    }
}