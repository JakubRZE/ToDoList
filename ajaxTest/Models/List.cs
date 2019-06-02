using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ajaxTest.Models
{
    public class List
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Name { get; set; }

        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public DateTime CreatedAt { get; set; }

        public virtual ICollection<Task> Task { get; set; }
    }
}
