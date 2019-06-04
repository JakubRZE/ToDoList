namespace ajaxTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class isdaone_added_to_task : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Tasks", "IsDone", c => c.Boolean(nullable: false, defaultValue: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Tasks", "IsDone");
        }
    }
}
