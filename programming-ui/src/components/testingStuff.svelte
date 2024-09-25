<script>
    let content = "world";

    const updateMessage = () => {
        content = content === "world" ? "Svelte" : "world";
    };
</script>

<h1>Hello {content}!</h1>
<button on:click={updateMessage}>Update!</button>
