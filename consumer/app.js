import { createClient } from "npm:redis@4.6.4";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

const sendToGradingAPI = async (submission) => {
    try {
        console.log("submission is: ", submission);
        const response = await fetch("http://grader-api:7000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
        });

        if (!response.ok) {
            throw new Error(`Grading API error: ${response.statusText}`);
        }

        const responseData = await response.json();
        const result = responseData.result;

        // Format the result by replacing \n with actual line breaks
        const formattedResult = result.replace(/\\n/g, "\n").trim();
        console.log("Grading API Response:", formattedResult);

        // Process the response (e.g., update the database)
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
