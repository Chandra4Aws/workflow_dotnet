using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkflowBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddPendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_template_reviewers_groups_ReviewerGroupsId",
                table: "template_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_template_reviewers_templates_TemplateId",
                table: "template_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_templates_groups_ApproverGroupId",
                table: "templates");

            migrationBuilder.DropForeignKey(
                name: "FK_templates_users_CreatorId",
                table: "templates");

            migrationBuilder.DropForeignKey(
                name: "FK_user_groups_groups_GroupsId",
                table: "user_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_user_groups_users_MembersId",
                table: "user_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_RolesId",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_users_UserId",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_workflow_reviewers_groups_ReviewerGroupsId",
                table: "workflow_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_workflow_reviewers_workflows_WorkflowId",
                table: "workflow_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_workflows_groups_ApproverGroupId",
                table: "workflows");

            migrationBuilder.DropForeignKey(
                name: "FK_workflows_users_CreatorId",
                table: "workflows");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "workflows",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "Timeline",
                table: "workflows",
                newName: "timeline");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "workflows",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Files",
                table: "workflows",
                newName: "files");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "workflows",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "workflows",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TemplateId",
                table: "workflows",
                newName: "template_id");

            migrationBuilder.RenameColumn(
                name: "ReviewerStatuses",
                table: "workflows",
                newName: "reviewer_statuses");

            migrationBuilder.RenameColumn(
                name: "FormData",
                table: "workflows",
                newName: "form_data");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "workflows",
                newName: "creator_id");

            migrationBuilder.RenameColumn(
                name: "ApproverGroupId",
                table: "workflows",
                newName: "approver_group_id");

            migrationBuilder.RenameIndex(
                name: "IX_workflows_CreatorId",
                table: "workflows",
                newName: "IX_workflows_creator_id");

            migrationBuilder.RenameIndex(
                name: "IX_workflows_ApproverGroupId",
                table: "workflows",
                newName: "IX_workflows_approver_group_id");

            migrationBuilder.RenameColumn(
                name: "WorkflowId",
                table: "workflow_reviewers",
                newName: "workflow_id");

            migrationBuilder.RenameColumn(
                name: "ReviewerGroupsId",
                table: "workflow_reviewers",
                newName: "group_id");

            migrationBuilder.RenameIndex(
                name: "IX_workflow_reviewers_WorkflowId",
                table: "workflow_reviewers",
                newName: "IX_workflow_reviewers_workflow_id");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "users",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "user_roles",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "RolesId",
                table: "user_roles",
                newName: "role_id");

            migrationBuilder.RenameIndex(
                name: "IX_user_roles_UserId",
                table: "user_roles",
                newName: "IX_user_roles_user_id");

            migrationBuilder.RenameColumn(
                name: "MembersId",
                table: "user_groups",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "GroupsId",
                table: "user_groups",
                newName: "group_id");

            migrationBuilder.RenameIndex(
                name: "IX_user_groups_MembersId",
                table: "user_groups",
                newName: "IX_user_groups_user_id");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "templates",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "Files",
                table: "templates",
                newName: "files");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "templates",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "templates",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "FormSchema",
                table: "templates",
                newName: "form_schema");

            migrationBuilder.RenameColumn(
                name: "CreatorId",
                table: "templates",
                newName: "creator_id");

            migrationBuilder.RenameColumn(
                name: "ApproverGroupId",
                table: "templates",
                newName: "approver_group_id");

            migrationBuilder.RenameIndex(
                name: "IX_templates_CreatorId",
                table: "templates",
                newName: "IX_templates_creator_id");

            migrationBuilder.RenameIndex(
                name: "IX_templates_ApproverGroupId",
                table: "templates",
                newName: "IX_templates_approver_group_id");

            migrationBuilder.RenameColumn(
                name: "TemplateId",
                table: "template_reviewers",
                newName: "template_id");

            migrationBuilder.RenameColumn(
                name: "ReviewerGroupsId",
                table: "template_reviewers",
                newName: "group_id");

            migrationBuilder.RenameIndex(
                name: "IX_template_reviewers_TemplateId",
                table: "template_reviewers",
                newName: "IX_template_reviewers_template_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "roles",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "roles",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "groups",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "groups",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "groups",
                newName: "id");

            migrationBuilder.AlterColumn<long>(
                name: "creator_id",
                table: "workflows",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "creator_id",
                table: "templates",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_template_reviewers_groups_group_id",
                table: "template_reviewers",
                column: "group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_template_reviewers_templates_template_id",
                table: "template_reviewers",
                column: "template_id",
                principalTable: "templates",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_templates_groups_approver_group_id",
                table: "templates",
                column: "approver_group_id",
                principalTable: "groups",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_templates_users_creator_id",
                table: "templates",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_groups_groups_group_id",
                table: "user_groups",
                column: "group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_groups_users_user_id",
                table: "user_groups",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles",
                column: "role_id",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflow_reviewers_groups_group_id",
                table: "workflow_reviewers",
                column: "group_id",
                principalTable: "groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflow_reviewers_workflows_workflow_id",
                table: "workflow_reviewers",
                column: "workflow_id",
                principalTable: "workflows",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflows_groups_approver_group_id",
                table: "workflows",
                column: "approver_group_id",
                principalTable: "groups",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_workflows_users_creator_id",
                table: "workflows",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_template_reviewers_groups_group_id",
                table: "template_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_template_reviewers_templates_template_id",
                table: "template_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_templates_groups_approver_group_id",
                table: "templates");

            migrationBuilder.DropForeignKey(
                name: "FK_templates_users_creator_id",
                table: "templates");

            migrationBuilder.DropForeignKey(
                name: "FK_user_groups_groups_group_id",
                table: "user_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_user_groups_users_user_id",
                table: "user_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_workflow_reviewers_groups_group_id",
                table: "workflow_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_workflow_reviewers_workflows_workflow_id",
                table: "workflow_reviewers");

            migrationBuilder.DropForeignKey(
                name: "FK_workflows_groups_approver_group_id",
                table: "workflows");

            migrationBuilder.DropForeignKey(
                name: "FK_workflows_users_creator_id",
                table: "workflows");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "workflows",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "timeline",
                table: "workflows",
                newName: "Timeline");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "workflows",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "files",
                table: "workflows",
                newName: "Files");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "workflows",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "workflows",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "template_id",
                table: "workflows",
                newName: "TemplateId");

            migrationBuilder.RenameColumn(
                name: "reviewer_statuses",
                table: "workflows",
                newName: "ReviewerStatuses");

            migrationBuilder.RenameColumn(
                name: "form_data",
                table: "workflows",
                newName: "FormData");

            migrationBuilder.RenameColumn(
                name: "creator_id",
                table: "workflows",
                newName: "CreatorId");

            migrationBuilder.RenameColumn(
                name: "approver_group_id",
                table: "workflows",
                newName: "ApproverGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_workflows_creator_id",
                table: "workflows",
                newName: "IX_workflows_CreatorId");

            migrationBuilder.RenameIndex(
                name: "IX_workflows_approver_group_id",
                table: "workflows",
                newName: "IX_workflows_ApproverGroupId");

            migrationBuilder.RenameColumn(
                name: "workflow_id",
                table: "workflow_reviewers",
                newName: "WorkflowId");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "workflow_reviewers",
                newName: "ReviewerGroupsId");

            migrationBuilder.RenameIndex(
                name: "IX_workflow_reviewers_workflow_id",
                table: "workflow_reviewers",
                newName: "IX_workflow_reviewers_WorkflowId");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "user_roles",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "role_id",
                table: "user_roles",
                newName: "RolesId");

            migrationBuilder.RenameIndex(
                name: "IX_user_roles_user_id",
                table: "user_roles",
                newName: "IX_user_roles_UserId");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "user_groups",
                newName: "MembersId");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "user_groups",
                newName: "GroupsId");

            migrationBuilder.RenameIndex(
                name: "IX_user_groups_user_id",
                table: "user_groups",
                newName: "IX_user_groups_MembersId");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "templates",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "files",
                table: "templates",
                newName: "Files");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "templates",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "templates",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "form_schema",
                table: "templates",
                newName: "FormSchema");

            migrationBuilder.RenameColumn(
                name: "creator_id",
                table: "templates",
                newName: "CreatorId");

            migrationBuilder.RenameColumn(
                name: "approver_group_id",
                table: "templates",
                newName: "ApproverGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_templates_creator_id",
                table: "templates",
                newName: "IX_templates_CreatorId");

            migrationBuilder.RenameIndex(
                name: "IX_templates_approver_group_id",
                table: "templates",
                newName: "IX_templates_ApproverGroupId");

            migrationBuilder.RenameColumn(
                name: "template_id",
                table: "template_reviewers",
                newName: "TemplateId");

            migrationBuilder.RenameColumn(
                name: "group_id",
                table: "template_reviewers",
                newName: "ReviewerGroupsId");

            migrationBuilder.RenameIndex(
                name: "IX_template_reviewers_template_id",
                table: "template_reviewers",
                newName: "IX_template_reviewers_TemplateId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "roles",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "roles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "groups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "groups",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "groups",
                newName: "Id");

            migrationBuilder.AlterColumn<long>(
                name: "CreatorId",
                table: "workflows",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "CreatorId",
                table: "templates",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_template_reviewers_groups_ReviewerGroupsId",
                table: "template_reviewers",
                column: "ReviewerGroupsId",
                principalTable: "groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_template_reviewers_templates_TemplateId",
                table: "template_reviewers",
                column: "TemplateId",
                principalTable: "templates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_templates_groups_ApproverGroupId",
                table: "templates",
                column: "ApproverGroupId",
                principalTable: "groups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_templates_users_CreatorId",
                table: "templates",
                column: "CreatorId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_groups_groups_GroupsId",
                table: "user_groups",
                column: "GroupsId",
                principalTable: "groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_groups_users_MembersId",
                table: "user_groups",
                column: "MembersId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_RolesId",
                table: "user_roles",
                column: "RolesId",
                principalTable: "roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_users_UserId",
                table: "user_roles",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflow_reviewers_groups_ReviewerGroupsId",
                table: "workflow_reviewers",
                column: "ReviewerGroupsId",
                principalTable: "groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflow_reviewers_workflows_WorkflowId",
                table: "workflow_reviewers",
                column: "WorkflowId",
                principalTable: "workflows",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_workflows_groups_ApproverGroupId",
                table: "workflows",
                column: "ApproverGroupId",
                principalTable: "groups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_workflows_users_CreatorId",
                table: "workflows",
                column: "CreatorId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
