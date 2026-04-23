import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { PostManager } from "./postManager.ts";
import { getCookie, setCookie } from "hono/cookie";

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

  app.use(
    "/*",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  app.get("/posts", async (c) => {
    const userId = getCookie(c, "userId");
    const user = await manager.getPosts(userId);
    return c.json({ data: user });
  });

  app.get("/users", async (c) => {
    const users = await manager.getUsers();
    return c.json({ data: users });
  });

  app.post("/add", async (c) => {
    const body = await c.req.json();
    const name = getCookie(c, "username");
    await manager.addPost(body, name);
    return c.json({ message: "Post added" });
  });

  app.post("/delete", async (c) => {
    const body = await c.req.json();
    await manager.removePost(body.id, body.userId);
    return c.json({ message: "Deleted" });
  });

  app.post("/adduser", async (c) => {
    const body: { name: string; password: string } = await c.req.json();
    try {
      const res = await manager.addUser(body);
      console.log(res.insertedId);
      setCookie(c, "userId", res.insertedId.toString());
      return c.json({ message: "created user" }, 200);
    } catch {
      return c.json({ message: "already exist just logged in" }, 400);
    }
  });

  return app;
};
