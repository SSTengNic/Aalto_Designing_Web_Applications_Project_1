<script>
    export let title;
    export let value;
    const sendAlert = () => {
        alert(value);
    };
    export let valueid;
</script>

<button
    data-testid={valueid}
    class=" bg-white flex-initial overflow-hidden shadow sm:rounded-lg dark:bg-gray-900 w-50 flex flex-col justify-center rounded-xl focus:outline-none hover:shadow-lg transition-shadow duration-200"
    on:click={sendAlert}
>
    <div class="px-4 py-5 sm:p-6 flex flex-col justify-center">
        <dl>
            <dt
                class="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400"
            >
                {title}
            </dt>
            <dd
                class="mt-1 text-2xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400"
            >
                {#if value === "N/A" || !value}
                    {value}
                {:else}
                    {"Feedback Available"}
                {/if}
            </dd>
        </dl>
    </div>
</button>
