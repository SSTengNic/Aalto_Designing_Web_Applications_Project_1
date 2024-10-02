<script>
    import CodeEditor from "./CodeEditor.svelte";
    import StatusBar from "./StatusBar.svelte";
    import { counter, correct } from "../stores/stores.js";
    let flipped = false;

    const flipCard = () => {
        flipped = !flipped;
    };

    const getAllQuestions = async () => {
        const response = await fetch("/api/assignments");
        return await response.json();
    };
    let AssignmentPromise = getAllQuestions();
</script>

<div class="flex justify-center items-center mb-5">
    <div class="h-[550px] w-10/12" style="perspective: 1000px;">
        <!-- Card Inner (handles the 3D rotation) -->
        <div
            class="relative h-full w-full rounded-xl shadow-xl transition-transform duration-500"
            style="transform-style: preserve-3d; transform: {flipped
                ? 'rotateY(180deg)'
                : 'rotateY(0deg)'};"
        >
            <!-- Front Side -->
            <div
                class="absolute inset-0 bg-blue-500 text-black flex flex-col self-end items-center justify-center rounded-xl border-2 border-black"
                style="backface-visibility:hidden; background-image: url('https://media1.tenor.com/m/y2JXkY1pXkwAAAAC/cat-computer.gif');background-position: center;background-size: contain;"
            >
                <h1 class="text-3xl font-bold mb-10 mt-20">
                    Flip the card to start!
                </h1>

                <button
                    data-testid="flip-button"
                    class="mt-2 px-10 py-6 bg-white text-black font-bold rounded border-2 border-black"
                    on:click={flipCard}
                >
                    Flip to Back
                </button>
            </div>

            <!-- Back Side -->

            <div
                class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-black flex flex-col items-center justify-center rounded-xl border-2 border-black"
                style="backface-visibility: hidden; transform: rotateY(180deg);"
            >
                <!-- <h1 class="text-xl font-bold">Back Side</h1> -->

                {#await AssignmentPromise}
                    <p>Loading items...</p>
                {:then AssignmentPromise}
                    <p class="text-xl font-bold">
                        {AssignmentPromise[$counter].handout}
                    </p>
                    <CodeEditor client:load />
                    <StatusBar client:load />
                {:catch error}
                    <p>Error loading items: {error.message}</p>
                {/await}
            </div>
        </div>
    </div>
</div>
