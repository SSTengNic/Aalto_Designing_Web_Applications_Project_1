import { postgres } from "./deps.js";
import * as pracService from "./services/pracService.js";
import * as programmingAssignmentService from "./services/programmingAssignmentService.js";
import { cacheMethodCalls } from "./util/cachUtil.js";
import { serve } from "./deps.js";

// Cache method calls
const cachedPracService = cacheMethodCalls(pracService, ["getPracs"]);

// Change this into proper grading service when you get more information.
//const cachedGradingService = cacheMethodCalls(pracService, ["getPracs"]);

const getAssignments = async (request) => {
    return Response.json(await cachedPracService.getAssignments());
};

const getAssignment = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    try {
        const assignment = await cachedPracService.getAssignment(id);
        console.log("assignment is: ", assignment);
        if (!assignment || assignment.length === 0) {
            return new Response("Assignment not found", { status: 404 });
        } else {
            return new Response(JSON.stringify(assignment), {
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

const GetPracs = async (request) => {
    return Response.json(await cachedPracService.getPracs());
};

const GetPrac = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    try {
        const prac = await cachedPracService.getPrac(id);
        if (prac.length === 0) {
            return new Response("Practice not found", { status: 404 });
        } else {
            return new Response(JSON.stringify(prac), {
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

const PostPrac = async (request) => {
    let prac; // Declare prac outside the try block to access it in the catch block.
    try {
        prac = await request.json();

        if (
            (!prac.code && !prac.user_uuid) ||
            prac.code.trim() === "" ||
            prac.user_uuid.trim() === ""
        ) {
            return new Response(
                "Invalid input. Something is wrong with either the code or the user id.",
                { status: 400 }
            );
        }

        const submissionCheck = await cachedPracService.submissionCheck(
            prac.programming_assignment_id,
            prac.code,
            prac.user_uuid
        );
        if (submissionCheck) {
            const { status, grader_feedback, correct } = submissionCheck;
            return new Response(
                JSON.stringify({
                    message: "Submission already exists.",
                    status,
                    grader_feedback,
                    correct,
                }),
                { status: 200 }
            );
        } else {
            await cachedPracService.addPracs(
                prac.programming_assignment_id,
                prac.code,
                prac.user_uuid
            );

            return new Response(
                JSON.stringify({ message: "Submission added successfully." }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Invalid JSON or error occurred",
                error: error.message,
                prac: prac, // Include prac data for debugging purposes
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
};

// Handle grading logic (integrating the grading service)
const handleGradingRequest = async (request) => {
    //const programmingAssignments = await programmingAssignmentService.findAll();

    const requestData = await request.json();
    console.log("requestData: ", requestData.testCode);
    //const testCode = programmingAssignments[0]["test_code"];
    const data = {
        code: requestData.code,
        testCode: requestData.testCode,
    };

    const response = await fetch("http://grader-api:7000/grade", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response;
};

// URL mapping
const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/prac" }),
        fn: GetPracs,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/prac/:id" }),
        fn: GetPrac,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/assignment/:id" }),
        fn: getAssignment,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/assignments" }),
        fn: getAssignments,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/prac" }),
        fn: PostPrac,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/grade" }),
        fn: handleGradingRequest,
    },
];

// Handle incoming requests
const handleRequest = async (request) => {
    const mapping = urlMapping.find(
        (um) => um.method === request.method && um.pattern.test(request.url)
    );

    if (!mapping) {
        return new Response("Request not found", { status: 404 });
    }

    const mappingResult = mapping.pattern.exec(request.url);
    return await mapping.fn(request, mappingResult);
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };

// Start the server
serve(handleRequest, portConfig);
