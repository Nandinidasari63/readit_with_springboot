import { createApp } from "./app.ts";

const app = createApp();
Deno.serve({ port: 8080 }, app.fetch);
