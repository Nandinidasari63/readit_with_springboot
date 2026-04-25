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
  const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID")!;
  const GITHUB_REDIRECT_URI = Deno.env.get("GITHUB_REDIRECT_URI")!;
  const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET")!;

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
    const userId = getCookie(c, "userId");
    await manager.addPost(body, userId);
    return c.json({ message: "Post added" });
  });

  app.post("/delete", async (c) => {
    const body = await c.req.json();
    await manager.removePost(body.id, body.userId);
    return c.json({ message: "Deleted" });
  });

  app.post("/adduser", async (c) => {
    const body: { name: string; password: string } = await c.req.json();
    const { user, isNew } = await manager.addUser(body);

    setCookie(c, "userId", user._id.toString());
    setCookie(c, "username", user.name);

    return c.json({
      message: isNew ? "User created" : "Logged in",
    });
  });

  app.post("/subscribe", async (c) => {
    const { targetUserId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await manager.subscribe(userId!, targetUserId);
    return c.json({ message: "subscribed" });
  });

  app.post("/unsubscribe", async (c) => {
    const { targetUserId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await manager.unsubscribe(userId!, targetUserId);
    return c.json({ message: "unsubscribed" });
  });

  app.post("/like", async (c) => {
    const { currentUserId, postOwnerId, postId } = await c.req.json();

    await manager.likePost(currentUserId, postOwnerId, postId);
    return c.json({ message: "subscribed" });
  });

  app.post("/unlike", async (c) => {
    const { currentUserId, postOwnerId, postId } = await c.req.json();

    await manager.unlikePost(currentUserId, postOwnerId, postId);
    return c.json({ message: "unsubscribed" });
  });
  return app;
};
