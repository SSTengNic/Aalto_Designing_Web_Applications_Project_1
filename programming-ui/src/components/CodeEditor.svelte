<script>
    import { userUuid, counter } from "../stores/stores.js";
    import { status, feedback, correct, message } from "../stores/stores.js";

    import { Confetti } from "svelte-confetti";
    import { onMount, tick } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { python } from "@codemirror/lang-python";
    import { EditorView, keymap } from "@codemirror/view";
    import { defaultKeymap } from "@codemirror/commands";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { basicSetup } from "codemirror";

    let editor;
    let codeContent = "";
    let editorView;
    let buttonVisible = false;
    let confettiActive = false;

    $: buttonVisible = $correct === "Yes" || $correct == true;
    $: {
        console.log("$counter from CodeEditor: ", $counter);
        console.log("$correct from CodeEditor: ", $correct);
    }
    const sendToQueue = async (codeContent) => {
        //Sends to producer to queue up for consumer to send for grading
        const assignment = await fetch(`/api/assignment/${$counter + 1}`);
        const assignmentData = await assignment.json();

        const gradingPayLoad = {
            assignmentId: assignmentData.id,
            code: codeContent,
            testCode: assignmentData.test_code,
            user_uuid: $userUuid,
        };
        console.log("Sending to producer.");
        await fetch("/queue/publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gradingPayLoad),
        });
        console.log("Producer/Grading finished.");
    };
    const submitCode = async () => {
        // codeContent = editorView.state.doc.toString();

        const response = await fetch("/api/prac", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                programming_assignment_id: $counter + 1,
                code: codeContent,
                user_uuid: $userUuid,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            message.set(responseData.message);
            if (responseData.message === "Submission already exists.") {
                status.set(responseData.status);
                feedback.set(responseData.grader_feedback);
                correct.set(responseData.correct);
            } else {
                sendToQueue(codeContent);
            }
        }
        codeContent = "";
    };
    onMount(() => {
        let startState = EditorState.create({
            doc: "\n".repeat(14), // Sets the document to be 14 empty lines initially
            extensions: [
                keymap.of(defaultKeymap),
                oneDark,
                basicSetup,
                python(),
            ],
        });

        editorView = new EditorView({
            state: startState,
            parent: editor,
        });
    });

    console.log("counter value: ", $counter);

    const increaseCounter = () => {
        if ($counter < 2) {
            counter.update((value) => value + 1);
        } else {
            counter.set(0);
        }
        correct.set("N/A");
        feedback.set("N/A");
        status.set("N/A");

        console.log("counter value: ", $counter);
    };

    const dropConfetti = async () => {
        confettiActive = false;
        await tick();
        confettiActive = true;
    };
</script>

<label for="editor-space">Code Editor</label>
<!-- <div
    id="editor-space"
    role="document"
    data-testid="editor-space"
    class="editor-container rounded-xl h-[280px] w-8/12 border-2 border-black overflow-y-auto"
    bind:this={editor}
></div> -->
<textarea
    data-testid="code-editor"
    class="editor-container rounded-xl h-[280px] w-8/12 border-2 border-black overflow-y-auto"
    bind:value={codeContent}
></textarea>
<!-- Using this because Playwright cannot locate CodeMirror editor space -->
<div class="flex flex-initial justify-center">
    <button
        data-testid="submit-button"
        on:click={submitCode}
        class="mt-4 px-4 py-2 bg-white text-green-500 font-bold rounded border-2 border-black"
        >Submit Work</button
    >
    {#if $counter < 2}
        <button
            data-testid="next-button"
            class={`mt-4 px-4 py-2 bg-white text-green-500 font-bold rounded border-2 border-black ${
                ($correct === "Yes" || $correct === true) && $counter < 2
                    ? ""
                    : "invisible"
            }`}
            on:click={increaseCounter}
        >
            Next Question
        </button>
    {:else}
        <button
            data-testid="confetti-button"
            class={`mt-4 px-4 py-2 bg-white text-green-500 font-bold rounded border-2 border-black ${
                ($correct === "Yes" || $correct === true) && $counter == 2
                    ? ""
                    : "invisible"
            }`}
            on:click={dropConfetti}
        >
            Good Job! (Click for surprise!)
        </button>
        {#if confettiActive}
            <div
                style="
        position: fixed;
        top: -90px;
        left: 0;
        height: 110vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;"
            >
                <Confetti
                    x={[-5, 5]}
                    y={[0, 0.1]}
                    delay={[500, 2000]}
                    infinite
                    duration="5000"
                    amount="200"
                    fallDistance="130vh"
                />
            </div>
        {/if}
    {/if}
</div>
