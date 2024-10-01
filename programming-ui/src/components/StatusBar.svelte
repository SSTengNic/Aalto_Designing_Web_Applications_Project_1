<script>
    import { onMount } from "svelte";
    import StatusButton from "./StatusButton.svelte";
    import AlertButton from "./AlertButton.svelte";
    import {
        message,
        status,
        feedback,
        correct,
        counter,
    } from "../stores/stores.js";

    $: if ($message) {
        setTimeout(() => {
            message.set("");
        }, 3000);
    }

    let ws;
    const booleanConvert = (value) => {
        const stringedValue = value ? "Yes" : "No";
        return stringedValue;
    };

    const initWebSocket = () => {
        ws = new WebSocket("ws://localhost:7800/ws");

        ws.onopen = () => {
            console.log("WebSocket connection established.");
        };

        ws.onmessage = (event) => {
            if (event.data === "ping") {
                console.log(" Recieved ping!");
                return;
            }
            const data = JSON.parse(event.data);
            console.log("data; ", data);
            status.set(data.prac.status);
            feedback.set(data.prac.grader_feedback);
            correct.set(booleanConvert(data.prac.correct));
        };

        ws.onclose = (event) => {
            console.log("WebSocket connection closed.");
            if (event.code !== 1000) {
                // Code 1000 means normal closure
                console.log("Attempting to reconnect...");
                setTimeout(initWebSocket, 3000);
            }
            ws = null; // Clears the reference to prevent getting "stuck" during reloading
        };

        return () => {
            ws.close();
        };
    };

    onMount(() => {
        console.log("on mounting...");
        initWebSocket(); // Initialize WebSocket
    });

    $: {
        console.log("correct: from statusbar", $correct);
        console.log("counter: from statusbar", $counter);
    }
</script>

<p class="mt-2">{$message}</p>

<div class="flex flex-initial justify-center gap-5 w-full h-[80px] mt-5 mb-5">
    <StatusButton title="Status" value={$status} />
    <AlertButton title="Click to see feedback" value={$feedback} />
    <StatusButton title="Correct" value={$correct} />
</div>
