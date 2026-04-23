import { createApp } from "./app.ts";

const data = {
  "nextId": 0,
  "posts": [],
};

const app = createApp(data);
Deno.serve({ port: 8080 }, app.fetch);
