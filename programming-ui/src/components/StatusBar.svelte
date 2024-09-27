<script>
    import { onMount } from "svelte";
    import StatusButton from "./StatusButton.svelte";
    import { message, status, feedback, correct } from "../stores/stores.js";

    let gradingResult = "";

    // Create a WebSocket connection to the server
    let ws;
    let passFailIndicator = null;

    onMount(() => {
        ws = new WebSocket("ws://localhost:7800/ws");

        ws.onopen = () => {
            console.log("WebSocket connection established.");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            gradingResult = data.result;
            if (gradingResult.includes("FAIL: ")) {
                passFailIndicator = false;
            } else {
                passFailIndicator = true;
            }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        return () => {
            ws.close();
        };
    });
</script>

<div>
    {#if passFailIndicator === null}
        <p>Please submit your code.</p>
    {:else if passFailIndicator === true}
        <p>Grading Passed! Please move onto the next question.</p>
        <button>Next question</button>
    {:else if passFailIndicator === false}
        <pre>{gradingResult}</pre>
    {/if}
</div>

<p>message: {$message}</p>

<div class="flex flex-initial justify-center gap-5 w-full h-[80px] mt-5 mb-5">
    <StatusButton title="Status" value={$status} />
    <StatusButton title="Grader's Feedback" value={$feedback} />
    <StatusButton title="Correct" value={$correct} />
</div>
