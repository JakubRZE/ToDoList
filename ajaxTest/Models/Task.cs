using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ajaxTest.Models
{
    public class Task
    {
        [Key]
        public int ID { get; set; }

        public int ListID { get; set; }

        [Required]
        public string Description { get; set; }

        public virtual List List { get; set; }
    }
}