import { createClient } from "npm:redis@4.6.4";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

const sendToUpdateSubmission = async (gradingResponse, finalForm) => {
    let passFail = true;

    try {
        const responseBody = gradingResponse.result;
        console.log("responseBody: ", responseBody);

        // Check for the "FAILED: " string in the response body
        if (responseBody.includes("Traceback")) {
            passFail = false;
        }

        const updatePayload = {
            programming_assignment_id: finalForm.assignmentId,
            code: finalForm.code,
            user_uuid: finalForm.user_uuid,
            SUBMISSION_STATUS: "processed",
            grader_feedback: responseBody,
            correct: passFail,
        };
        console.log("PAYLOAD CHECK.", updatePayload);

        const updatedAssignment = await fetch("http://nginx:7800/api/prac", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePayload),
        });

        return await updatedAssignment.json();
    } catch (error) {
        console.error("Error sending to update submission: ", error);
    }
};
const sendToGradingAPI = async (submission) => {
    try {
        // console.log("submission is: ", submission);
        const response = await fetch("http://nginx:7800/api/grade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
        });

        return await response.json();

        if (!response.ok) {
            throw new Error(`Grading API error: ${response.statusText}`);
        }

        // Read the response as text first
    } catch (error) {
        console.error("Error sending to grading API:", error);
        return null;
    }
};

const clientStart = async () => {
    await client.connect();

    while (true) {
        const submissionReceived = await client.brPop("submissionQueue", 0);
        // console.log("submissionReceived: ", submissionReceived);

        if (submissionReceived) {
            console.log("Consumer received submission.");

            const submissionForGrading = JSON.parse(submissionReceived.element);

            const finalForm = {
                assignmentId: submissionForGrading.assignmentId,
                user_uuid: submissionForGrading.user_uuid,
                code: submissionForGrading.code,
                testCode: submissionForGrading.testCode,
            };

            const gradingResponse = await sendToGradingAPI(finalForm);

            if (gradingResponse) {
                const updatedAssignment = await sendToUpdateSubmission(
                    gradingResponse,
                    finalForm
                );
                console.log(
                    "Update successful. updatedAssignment: ",
                    updatedAssignment
                );
            } else {
                console.error("Failed to process submission.");
            }
        } else {
            console.error("No submission received or data format error.");
        }
    }
};

clientStart();
