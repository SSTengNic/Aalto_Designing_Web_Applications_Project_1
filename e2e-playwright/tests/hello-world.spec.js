const { test, expect } = require("@playwright/test");

test("Server responds with a page with the title 'Programming assignments'", async ({
    page,
}) => {
    await page.goto("/");
    expect(await page.title()).toBe("Programming assignments");
});

test("Submission fails and checks the feedback on incorrect squbmission", async ({
    page,
}) => {
    await page.goto("/");
    expect(await page.title()).toBe("Programming assignments");
    await page.getByRole("button", { name: "Flip to Back" }).click();
    const handoutText = await page.textContent(".text-xl.font-bold");
    expect(handoutText).toBe(
        'Write a function "hello" that returns the string "Hello"'
    );

    await page.fill(
        '[data-testid="code-editor"]',
        'def hello(): \n    return "Hellos"'
    );

    await page.getByTestId("submit-button").click();
    await page.waitForTimeout(5000);
    await page.getByTestId("alert-button").click();

    page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("alert"); // Ensure it's an alert
        expect(dialog.message()).toContain(
            "FAIL: test_hello (test-code.TestHello)"
        ); // Check if the message contains the expected text
        await dialog.accept(); // Accept the alert
    });
});

test("Submission passes and checks the notification on the correctness of submission.", async ({
    page,
}) => {
    await page.goto("/");
    expect(await page.title()).toBe("Programming assignments");
    await page.getByRole("button", { name: "Flip to Back" }).click();
    const handoutText = await page.textContent(".text-xl.font-bold");
    expect(handoutText).toBe(
        'Write a function "hello" that returns the string "Hello"'
    );

    await page.fill(
        '[data-testid="code-editor"]',
        'def hello(): \n    return "Hello"'
    );

    await page.getByTestId("submit-button").click();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("correct-button")).toHaveText("Yes");
});

test("Submission passes, checks the notification on the correctness of submission, moves to next assignment, checks the assignment is new.", async ({
    page,
}) => {
    await page.goto("/");
    expect(await page.title()).toBe("Programming assignments");
    await page.getByRole("button", { name: "Flip to Back" }).click();
    const handoutText = await page.textContent(".text-xl.font-bold");
    expect(handoutText).toBe(
        'Write a function "hello" that returns the string "Hello"'
    );

    await page.fill(
        '[data-testid="code-editor"]',
        'def hello(): \n    return "Hello"'
    );

    await page.getByTestId("submit-button").click();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("correct-button")).toHaveText("Yes");

    //Moves to next page and checks the next question
    await page.getByRole("button", { name: "Next Question" }).click();
    const handoutTextTwo = await page.textContent(".text-xl.font-bold");
    expect(handoutTextTwo).toBe(
        'Write a function "hello" that returns the string "Hello world!"'
    );
});
