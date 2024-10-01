import { readable, writable } from "svelte/store";

let localCounter = localStorage.getItem("counter");
localCounter = localCounter ? parseInt(localCounter, 10) : 0;
const counter = writable(localCounter);

let user = localStorage.getItem("userUuid");
if (!user) {
    user = crypto.randomUUID().toString();
    localStorage.setItem("userUuid", user);
}

counter.subscribe((value) => {
    localStorage.setItem("counter", value);
});

export const userUuid = readable(user);

export { counter };
export const status = writable("");
export const feedback = writable("");
export const correct = writable("N/A");
export const message = writable("Nothing yet...");
