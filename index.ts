import { invokeAgent } from "./ai/agent";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/": () => new Response("Welcome to keeper backend", { status: 200 }),
    "/api/agent": {
      POST: async (req) => {
        const chat_history = await req.json();
        console.log("Chat history:", JSON.stringify(chat_history));

        const payload = await invokeAgent(chat_history);
        return Response.json({ payload }, { status: 200 });
      },
    },
    "/api/*": () => Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
