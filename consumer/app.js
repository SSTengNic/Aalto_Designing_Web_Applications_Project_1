import { createClient } from "npm:redis@4.6.4";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

const sendToGradingAPI = async (submission) => {
    try {
        console.log("submission is: ", submission);
        const response = await fetch("http://grader-api:7000/grade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
        });

        if (!response.ok) {
            throw new Error(`Grading API error: ${response.statusText}`);
        }

        return formattedResult;
    } catch (error) {
        console.error("Error sending to grading API:", error);
        return null;
    }
};

const clientStart = async () => {
    await client.connect();

    while (true) {
        const submissionRecieved = await client.brPop("submissionQueue", 0);
        console.log("submissionRecievd: ", submissionRecieved);

        if (submissionRecieved) {
            console.log("Consumer received submission.");

            const submissionForGrading = JSON.parse(submissionRecieved.element);

            const finalForm = {
                code: submissionForGrading.code,
                testCode: submissionForGrading.testCode,
            };

            console.log("Final Form Check: ", finalForm);

            const gradingResponse = await sendToGradingAPI(finalForm);

            if (gradingResponse) {
                console.log("Submission processed successfully.");
            } else {
                console.error("Failed to process submission.");
            }
        } else {
            console.error("No submission received or data format error.");
        }
    }
};

clientStart();
