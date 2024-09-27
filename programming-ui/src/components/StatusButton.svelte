<script>
    export let title;
    export let value;
</script>

<div
    class="bg-white flex-initial overflow-hidden shadow sm:rounded-lg dark:bg-gray-900 w-auto flex flex-col justify-center rounded-xl"
>
    <div class="px-4 py-5 sm:p-6 flex flex-col justify-center">
        <!-- Added flex and justify-center -->
        <dl>
            <dt
                class="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400"
            >
                {title}
            </dt>
            <dd
                class="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400"
            >
                {value || "N/A"}
            </dd>
        </dl>
    </div>
</div>
