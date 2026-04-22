import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { Context } from "node:vm";

type post = {
  id: number;
  title: string | null;
  body: string | null;
  time: string;
};

type Feed = {
  nextId: number;
  posts: post[];
};

export const createApp = (data: Feed) => {
  const app = new Hono();

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
    const data = c.get("data");
    data.posts.push(newPost);
    data.nextId += 1;
    return c.json({ data: data }, 200);
  });

  app.post("/delete", async (c: Context) => {
    const deletePost = await c.req.json();
    const data = c.get("data");
    data.posts = data.posts.filter((p: post) => p.id !== deletePost.id);
    console.log(data);
    return c.json({ data: data }, 200);
  });

  return app;
};
