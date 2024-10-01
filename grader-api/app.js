// import { serve } from "./deps.js";
// import { grade } from "./services/gradingService.js";

// let state = -1;

// const getCode = () => {
//     state = (state + 1) % 5;

//     if (state == 0) {
//         return `
// def hello():
//   return "Hello world!"
// `;
//     } else if (state == 1) {
//         return `
// def hello():
//   return "hello world!"
//     `;
//     } else if (state == 2) {
//         return `
// def ohnoes():
//   return "Hello world!"
//     `;
//     } else if (state == 3) {
//         return `
// :D
//       `;
//     } else {
//         return `
// while True:
//   print("Hmmhmm...")
//     `;
//     }
// };

// const gradingDemo = async () => {
//     let code = getCode();

//     const testCode = `
// import socket
// def guard(*args, **kwargs):
//   raise Exception("Internet is bad for you :|")
// socket.socket = guard

// import unittest
// from code import *

// class TestHello(unittest.TestCase):

//   def test_hello(self):
//     self.assertEqual(hello(), "Hello world!", "Function should return 'Hello world!'")

// if __name__ == '__main__':
//   unittest.main()
// `;

//     return await grade(code, testCode);
// };

// const handleGradingRequest = async (request) => {
//     let result;
//     try {
//         const requestData = await request.json();
//         console.log("Request data:", requestData);

//         const code = requestData.code;
//         const testCode = requestData.testCode;

//         // Call the grading function
//         result = await grade(code, testCode);
//     } catch (error) {
//         console.error("Error grading:", error);
//         result = "Grading failed, demo result used.";
//     }

//     // Notify all connected WebSocket clients with the grading result
//     webSocketClients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({ result })); // Send the result through WebSocket
//         }
//     });

//     return new Response(JSON.stringify({ result }), {
//         headers: { "Content-Type": "application/json" },
//     });
// };

// // Handle WebSocket connection for real-time updates
// const handleWebSocketRequest = async (request) => {
//     const { socket, response } = Deno.upgradeWebSocket(request);

//     socket.onopen = () => {
//         console.log("WebSocket connection opened.");
//     };

//     socket.onmessage = (event) => {
//         console.log("Message from client:", event.data);
//     };

//     socket.onclose = () => {
//         console.log("WebSocket connection closed.");
//         const index = webSocketClients.indexOf(socket);
//         if (index > -1) {
//             webSocketClients.splice(index, 1); // Remove client when connection closes
//         }
//     };

//     // Add the client to the list of WebSocket clients
//     webSocketClients.push(socket);
//     return response;
// };

// // Handle both HTTP and WebSocket requests
// const handleRequest = async (request) => {
//     const url = new URL(request.url);

//     if (url.pathname === "/grade") {
//         return handleGradingRequest(request); // Handle grading submission
//     } else if (url.pathname === "/ws") {
//         if (request.headers.get("upgrade") === "websocket") {
//             return handleWebSocketRequest(request); // Handle WebSocket connection
//         }
//     }

//     return new Response("Not Found", { status: 404 });
// };

// // Start the server
// serve(handleRequest, { port: 7777 });
import { serve } from "./deps.js";
import { grade } from "./services/gradingService.js";

let state = -1;

const getCode = () => {
    state = (state + 1) % 5;

    if (state == 0) {
        return `
def hello():
  return "Hello world!"
`;
    } else if (state == 1) {
        return `
def hello():
  return "hello world!"
    `;
    } else if (state == 2) {
        return `
def ohnoes():
  return "Hello world!"
    `;
    } else if (state == 3) {
        return `
:D
      `;
    } else {
        return `
while True:
  print("Hmmhmm...")
    `;
    }
};

const gradingDemo = async () => {
    let code = getCode();

    const testCode = `
import socket
def guard(*args, **kwargs):
  raise Exception("Internet is bad for you :|")
socket.socket = guard

import unittest
from code import *

class TestHello(unittest.TestCase):

  def test_hello(self):
    self.assertEqual(hello(), "Hello world!", "Function should return 'Hello world!'")

if __name__ == '__main__':
  unittest.main()  
`;

    return await grade(code, testCode);
};

const handleRequest = async (request) => {
    // the starting point for the grading api grades code following the
    // gradingDemo function, but does not e.g. use code from the user
    let result;
    try {
        const requestData = await request.json();

        // console.log("Request data:");
        // console.log(requestData);

        const code = requestData.code;
        const testCode = requestData.testCode;

        result = await grade(code, testCode);
    } catch (e) {
        result = await gradingDemo();
    }

    // in practice, you would either send the code to grade to the grader-api
    // or use e.g. a message queue that the grader api would read and process

    return new Response(JSON.stringify({ result: result }));
};

const portConfig = { port: 7000, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
