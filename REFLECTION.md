TODO: There is a brief description of the application in REFLECTION.md that highlights the key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.

# Key Design Decisions

## Opening Statement & Design Direction

Building this project for children, I aimed to keep the design fun and engaging. To achieve this, I incorporated playful elements like cat GIFs and a confetti animation. I upgraded Svelte to version 4.0.0 and, despite some challenges, successfully forced the installation of `svelte-confetti` using `npm`. Fortunately, this did not break the program and integrated smoothly, adding a fun and interactive experience without compromising functionality.

## Programming API

I developed a `programming-api` responsible for handling HTTP requests and managing communication with two coupled databases: `programming_assignments` and `programming_assignment_submissions`. While coupling these two databases might present future challenges, it simplified the HTTP request logic, making the design more straightforward to implement in the current context.

## Producer and Consumer Design

### Functionality Overview

-   **Producer:** Responsible for queueing submissions and passing them to the consumer.
-   **Consumer:** Handles these submissions by sending them to a grading API, receiving feedback, and updating the database with both the feedback and submission details. The updated submission is then sent to the UI through WebSockets.

### Workflow

1. The **producer** adds submissions to a queue.
2. The **consumer** pops submissions from the queue, grades them via the grading API, and receives feedback.
3. Upon receiving feedback, the **consumer** updates the database, including submission status and correctness via the **programming-api**.
4. The **programming-api** then sends real-time updates back to the UI via WebSockets.

## Usage of Stores

I leveraged Svelte stores for state management and used it to store the state of important variables like `correct`, `status`, and `feedback`. I used "localStorage" to cache the `counter`, which controlled the specific questions shown. This ensured that when a user reloads the page, the counter persists without issues. By using stores, these variables are easily accessible throughout the UI, enhancing the overall user experience by maintaining state across reloads.

## WebSockets & Maintaining Connections

### Upgrading to WebSockets

Initially, I upgraded the grader API to handle WebSockets to send real-time grading feedback to the UI. However, I later realized that it made more sense to first update the database and then use WebSockets to push the updated submission data—including grading feedback, status, and correctness—back to the UI.

To achieve this, I updated the NGINX configuration to allow `/ws` requests and modified the `programming-api` to handle both WebSocket and traditional HTTP requests. For WebSocket requests, if the URL contains `/ws` and it’s a `GET` request, the `WebSocketRequest` function is called instead of the normal API handler.

### Keeping the Connection Alive

During testing, I encountered an issue where the WebSocket connection would close after roughly 30 seconds. To resolve this, I implemented a server-side "ping" that sends keep-alive messages to the client every 5 seconds, ensuring the connection remains open indefinitely.

### WebSocket Integration with API

I learned a lot about WebSockets during this project. Integrating them into the existing API while allowing both WebSocket and normal API requests was challenging but rewarding. Now, the programming-api server handles both WebSocket connections and standard HTTP requests seamlessly.

## Playwright Testing

### Code Editor Challenges

I initially used CodeMirror to create an interactive code editor for script input. While it worked well functionally, I faced several challenges when trying to interact with it via Playwright tests. Locating the CodeMirror component was particularly difficult, leading to numerous test failures.

### Switching to `<textarea>`

To overcome the testing difficulties, I replaced the CodeMirror editor with a simple `<textarea>` for testing purposes. This solution made it significantly easier to locate and interact with the text input during tests. While the trade-off is a less visually appealing UI, this approach improved the overall testing reliability.

## NGINX Structure

I had to configure NGINX to manage routing between WebSocket connections, the `programming-api`, and the `UI`. This setup allowed for more flexible handling of API requests and real-time WebSocket updates, creating a robust back-end system that supports both synchronous and asynchronous communication.

## Closing Statements

Overall, I’m very satisfied with the results of this project. Moving forward, I plan to implement additional features as outlined in the "Merits" section, but for now, my focus will be on completing the course.

### Potential Improvements

Some areas for future improvement include:

-   **Navigation:** Implementing a way for users to navigate back to previous programming problems. Currently, the user cannot go back unless the cached counter is reset.
-   **Scalability:** Increasing the number of grader APIs would allow for faster processing of submissions, improving overall system efficiency.
