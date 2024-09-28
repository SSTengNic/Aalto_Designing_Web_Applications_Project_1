<script>
    import { userUuid } from "../stores/stores.js";
    import { status, feedback, correct, message } from "../stores/stores.js";

    import { onMount } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { python } from "@codemirror/lang-python";
    import { EditorView, keymap } from "@codemirror/view";
    import { defaultKeymap } from "@codemirror/commands";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { basicSetup } from "codemirror";

    let editor;
    let codeContent = "";
    let editorView;

    const sendToQueue = async (codeContent) => {
        //Sends to producer to queue up for consumer to send for grading
        //Using default 1 for now
        const assignment = await fetch("/api/assignment/1");
        const assignmentData = await assignment.json();

        const gradingPayLoad = {
            assignmentId: assignmentData.id,
            code: codeContent,
            testCode: assignmentData.test_code,
            user_uuid: $userUuid,
        };
        //For now, theree is no "return" function to respond. Just look out for the consumer's reply.
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
        codeContent = editorView.state.doc.toString();
        const response = await fetch("/api/prac", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                programming_assignment_id: 1,
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
                oneDark, // Dark theme
                basicSetup, // Default editor setup
                python(), // Python syntax highlighting
            ],
        });

        editorView = new EditorView({
            state: startState,
            parent: editor, // Bind editor to the div with bind:this
        });
    });
</script>

<!-- Editor Container with fixed height and scrolling -->

<div
    class="editor-container rounded-xl h-[280px] w-8/12 border-2 border-black overflow-y-auto"
    bind:this={editor}
></div>
<button
    on:click={submitCode}
    class="mt-4 px-4 py-2 bg-white text-green-500 font-bold rounded border-2 border-black"
    >Submit Work</button
>
