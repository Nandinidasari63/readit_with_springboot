import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { Context } from "node:vm";
import console from "node:console";

const app = new Hono();
const data = {
  "nextId": 3,
  "posts": [
    { "id": 1, "title": "first title", "body": "this is first body" },
    { "id": 2, "title": "second title", "body": "this is second body" },
  ],
};

app.use(logger());
app.use("*", async (c: Context, next) => {
  c.set("data", data);
  await next();
});
app.use("/*", cors());

app.get("/getdata", (c: Context) => {
  const data = c.get("data");
  return c.json({ data: data }, 200);
});

app.post("/add", async (c: Context) => {
  const newPost = await c.req.json();
  console.log(newPost);
  const data = c.get("data");
  data.posts.push(newPost);
  data.nextId += 1;
  console.log("in add", data);
  return c.json({ data: data }, 200);
});

app.get("*", serveStatic({ root: "data" }));
Deno.serve({ port: 8080 }, app.fetch);
