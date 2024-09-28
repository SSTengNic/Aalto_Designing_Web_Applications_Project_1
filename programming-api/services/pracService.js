import { postgres } from "../deps.js";
const sql = postgres({});

const getAssignments = async () => {
    return await sql`SELECT * FROM programming_assignments `;
};

const getAssignment = async (id) => {
    const assignment =
        await sql`SELECT * FROM programming_assignments WHERE assignment_order = ${id}`;
    return assignment[0];
};

const getPrac = async (id) => {
    const prac =
        await sql` SELECT * FROM programming_assignment_submissions WHERE id = ${id}`;
    return prac[0];
};

const getPracs = async () => {
    return await sql`SELECT * FROM programming_assignment_submissions`;
};

const updatePrac = async (
    programming_assignment_id,
    code,
    user_uuid,
    SUBMISSION_STATUS,
    grader_feedback,
    correct
) => {
    try {
        const updatedSubmission = await sql`
            UPDATE programming_assignment_submissions
            SET 
                status = ${SUBMISSION_STATUS}, -- Corrected field name and value
                grader_feedback = ${grader_feedback}, 
                correct = ${correct}
            WHERE 
                code = ${code} 
                AND user_uuid = ${user_uuid} 
                AND programming_assignment_id = ${programming_assignment_id}
            RETURNING *;
        `;
        return updatedSubmission[0];
    } catch (error) {
        console.error("Error updating submission: ", error);
    }
};

const addPracs = async (
    programming_assignment_id,
    code,
    user_uuid,
    status = "pending"
) => {
    await sql`
        INSERT INTO programming_assignment_submissions 
        (programming_assignment_id, code, user_uuid, status) 
        VALUES 
        (${programming_assignment_id}, ${code}, ${user_uuid}, ${status});
    `;
};

const submissionCheck = async (programming_assignment_id, code, user_uuid) => {
    const existingSubmission =
        await sql`SELECT * FROM programming_assignment_submissions
            WHERE code = ${code}
            AND user_uuid =${user_uuid}
            AND programming_assignment_id = ${programming_assignment_id}`;
    if (existingSubmission) {
        return existingSubmission[0];
    }
    return False;
};

export {
    getPrac,
    getPracs,
    addPracs,
    getAssignments,
    submissionCheck,
    getAssignment,
    updatePrac,
};
