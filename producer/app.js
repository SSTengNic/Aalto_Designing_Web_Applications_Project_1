import { createClient } from "npm:redis@4.6.4";
import { serve } from "https://deno.land/std@0.222.1/http/server.ts";

const client = createClient({
    url: "redis://redis:6379",
    pingInterval: 1000,
});

await client.connect();

const handleRequest = async (request) => {
    const url = new URL(request.url);
    if (url.pathname == "/api/prac" && request.method === "POST") {
        const body = await request.json();

        await client.lpush("submissionQueue", JSON.stringify(body));
        return new Response("Submission sent for grading.");
    }
};

serve(handleRequest, { port: 7778 });
