import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { PostManager } from "./postRepo.ts";

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

export const createApp = () => {
  const manager = new PostManager();
  const app = new Hono();

  app.use(logger());

  app.use("/*", cors());

  app.get("/posts", async (c) => {
    const posts = await manager.getPosts();
    return c.json({ data: posts });
  });

  app.post("/add", async (c) => {
    const body = await c.req.json();
    await manager.addPost(body);
    return c.json({ message: "Post added" });
  });

  app.post("/delete", async (c) => {
    const body = await c.req.json();
    await manager.removePost(body._id);
    return c.json({ message: "Deleted" });
  });

  return app;
};
