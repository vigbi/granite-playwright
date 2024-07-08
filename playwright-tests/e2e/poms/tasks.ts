// poms/tasks.ts

import { Page, expect } from "@playwright/test";

interface TaskName {
  taskName: string;
}

interface CreateNewTaskProps extends TaskName {
  userName?: string;
}

interface CommentProps extends TaskName {
  commentText: string;
}

export class TaskPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  createTaskAndVerify = async ({
    taskName,
    userName = "Oliver Smith",
  }: CreateNewTaskProps) => {
    await this.page.getByTestId("navbar-add-todo-link").click();
    await this.page.getByTestId("form-title-field").fill(taskName);

    await this.page.locator(".css-2b097c-container").click();
    await this.page.locator(".css-26l3qy-menu").getByText(userName).click();
    await this.page.getByTestId("form-submit-button").click();
    const taskInDashboard = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", {
        name: new RegExp(taskName, "i"),
      });
    await taskInDashboard.scrollIntoViewIfNeeded();
    await expect(taskInDashboard).toBeVisible();
  };

  markTaskAsCompletedAndVerify = async ({ taskName }: TaskName) => {
    await expect(
      this.page.getByRole("heading", { name: "Loading..." })).toBeHidden();

    const completedTaskInDashboard = this.page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: taskName });

    const isTaskCompleted = await completedTaskInDashboard.count();

    if (isTaskCompleted) return;

    await this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName })
      .getByRole("checkbox")
      .click();
    await completedTaskInDashboard.scrollIntoViewIfNeeded();
    await expect(completedTaskInDashboard).toBeVisible();
  };

  starTaskAndVerify = async ({ taskName }: TaskName) => {
    const starIcon = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName })
      .getByTestId("pending-task-star-or-unstar-link");
    await starIcon.click();
    await expect(starIcon).toHaveClass(/ri-star-fill/i);
    await expect(
      this.page.getByTestId("tasks-pending-table").getByRole("row").nth(1)
    ).toContainText(taskName);
  };

  addCommentAndVerify = async ({
    taskName,
    commentText,
  }: CommentProps) => {
    await this.page.getByTestId("tasks-pending-table").getByRole("row", {
      name: taskName,
    }).getByText(taskName).click();

    await this.page.getByTestId("comments-text-field").fill(commentText);
    await this.page.getByTestId("comments-submit-button").click();

    await expect(this.page.getByText(commentText)).toBeVisible();
  };

  createTask = async ({
    taskName,
    userName = "Oliver Smith",
  }: CreateNewTaskProps) => {
    await this.page.getByTestId("navbar-add-todo-link").click();
    await this.page.getByTestId("form-title-field").fill(taskName);

    await this.page.locator(".css-2b097c-container").click();
    await this.page.locator(".css-26l3qy-menu").getByText(userName).click();
    await this.page.getByTestId("form-submit-button").click();

  };

  verifyComment = async ({
    taskName,
    commentText,
  }: CommentProps) => {
    await this.page.getByTestId("tasks-pending-table").getByRole("row", {
      name: taskName,
    }).getByText(new RegExp(`^${taskName}$`, 'i')).click();

    await expect(this.page.getByText(commentText)).toBeVisible();
  };

  addCommentAndVerifyAsignee = async ({
    taskName,
    commentText,
  }: CommentProps) => {
    await this.page.getByTestId("comments-text-field").fill(commentText);
    await this.page.getByTestId("comments-submit-button").click();

    await expect(this.page.getByText(commentText)).toBeVisible();
  };

}
