import { createClient } from "npm:redis@4.6.4";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

const sendToGradingAPI = async (submission) => {
    try {
        const response = await fetch("/api/grade", {
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
        console.log("Grading API Response:", responseData);

        // Process the response (e.g., update the database)
        return responseData;
    } catch (error) {
        console.error("Error sending to grading API:", error);
        return null;
    }
};

const clientStart = async () => {
    await client.connect();

    while (true) {
        const submissionRecieved = await client.brPop("submissionQueue", 0);

        if (submissionRecieved) {
            const [queue, submissionString] = submissionRecieved;
            console.log(
                `Processing submission from ${queue}: ${submissionString}`
            );

            const submissionForGrading = JSON.parse(submissionString);

            const gradingResponse = await sendToGradingAPI(
                submissionForGrading
            );

            if (gradingResponse) {
                console.log("Submssion processed successfuly");
            } else {
                consol.log("Failed to process submission.");
            }
        }
    }
};

clientStart();
