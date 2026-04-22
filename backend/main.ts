import { createApp } from "./app.ts";

const data = {
  "nextId": 3,
  "posts": [
    {
      "id": 1,
      "title": "first title",
      "body": "this is first body",
      "time": "wed",
    },
    {
      "id": 2,
      "title": "second title",
      "body": "this is second body",
      "time": "",
    },
  ],
};
const app = createApp(data);
Deno.serve({ port: 8080 }, app.fetch);
