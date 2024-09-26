// import { createClient } from "npm:redis@4.6.4";
// import { serve } from "https://deno.land/std@0.222.1/http/server.ts";

// const client = createClient({
//     url: "redis://redis:6379",
//     pingInterval: 1000,
// });

// await client.connect();

// const handleRequest = async (request) => {
//     console.log("url is: ", request.url, request.method);
//     const url = new URL(request.url);

//     if (url.pathname == "/api/prac" && request.method === "POST") {
//         const body = await request.json();

//         await client.lpush("submissionQueue", JSON.stringify(body));
//         console.log("Producer is working.");
//         return new Response("Submission sent for grading.");
//     }
// };

// serve(handleRequest, { port: 7778 });
import { createClient } from "npm:redis@4.6.4";
import { serve } from "https://deno.land/std@0.222.1/http/server.ts";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

await client.connect();

const handleRequest = async (request) => {
    const url = new URL(request.url);

    if (url.pathname === "/queue/publish") {
        console.log("Producer reading this.");

        try {
            const body = await request.json();

            // Push the request body to the Redis queue
            await client.lPush("submissionQueue", JSON.stringify(body));
            console.log("Producer successfully pushed to Redis.");

            return new Response("Submission sent for grading.");
        } catch (error) {
            // Log the error with details
            console.error("Error processing request:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    // Default response for other routes
    return new Response("Hello!");
};
serve(handleRequest, { port: 7778 });
