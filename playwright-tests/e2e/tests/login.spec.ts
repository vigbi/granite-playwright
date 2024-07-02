import { test } from "@playwright/test";
import LoginPage from "../poms/login";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto("http://localhost:3000");
    await login.loginAndVerifyUser({
      email: "oliver@example.com",
      password: "welcome",
      username: "Oliver Smith",
    });
  });
});
