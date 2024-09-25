import { readable, writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
    user = crypto.randomUUID().toString();
    localStorage.setItem("userUuid", user);
}

const counter = writable(0);

export const userUuid = readable(user);
export { counter };
