import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { getCookie, setCookie } from "hono/cookie";
import { FeedService } from "./services/feed_service.ts";
import { UserService } from "./services/user_service.ts";
import { PostService } from "./services/post_service.ts";
import { LikeService } from "./services/like_service.ts";
import { SubscriptionService } from "./services/subscription_service.ts";

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
  const userService = new UserService();
  const postService = new PostService();
  const likeService = new LikeService();
  const subscriptionService = new SubscriptionService();
  const app = new Hono();

  const feedService = new FeedService(
    userService,
    postService,
    likeService,
    subscriptionService,
  );
  const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID")!;
  const GITHUB_REDIRECT_URI = Deno.env.get("GITHUB_REDIRECT_URI")!;
  const GITHUB_CLIENT_SECRET = Deno.env.get("GITHUB_CLIENT_SECRET")!;

  app.use(logger());

  app.use(
    "/*",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
  app.get("/auth/github/login", (c) => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
    });

    const githubAuthorizeUrl =
      `https://github.com/login/oauth/authorize?${params.toString()}`;

    return c.redirect(githubAuthorizeUrl);
  });

  app.get("/auth/github/callback", async (c) => {
    const url = new URL(c.req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return c.text("Missing code in query", 400);
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      return c.text(`Failed to get access token: ${text}`, 500);
    }

    const tokenJson = await tokenResponse.json() as {
      access_token?: string;
      token_type?: string;
      scope?: string;
    };

    const accessToken = tokenJson.access_token;

    if (!accessToken) {
      return c.text("No access token returned from GitHub", 500);
    }

    //  Use access token to get user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "github-oauth-demo",
      },
    });

    if (!userResponse.ok) {
      const text = await userResponse.text();
      return c.text(`Failed to fetch user profile: ${text}`, 500);
    }

    const userJson = await userResponse.json() as {
      id: number;
      login: string;
    };

    const githubLogin = userJson.login;

    const { user } = await userService.addUser(
      githubLogin,
      "github_oauth",
    );

    setCookie(c, "userId", user._id.toString(), {
      path: "/",
      httpOnly: false,
    });
    setCookie(c, "username", user.name, {
      path: "/",
      httpOnly: false,
    });

    return c.redirect("http://localhost:5173/");
  });

  app.get("/posts", async (c) => {
    const userId = getCookie(c, "userId");

    const data = await feedService.getFeed(userId);

    return c.json({ data });
  });

  app.get("/users", async (c) => {
    const users = await userService.getAllUsers();
    return c.json({ data: users });
  });

  app.post("/add", async (c) => {
    const body = await c.req.json();

    const userId = getCookie(c, "userId") as string;

    const user = await userService.getUser(userId);
    if (!user) {
      return c.json({ error: "User not found" }, 400);
    }

    const insertedId = await postService.addPost(
      body,
      userId,
      user.name,
    );

    return c.json({ insertedId });
  });

  app.post("/delete", async (c) => {
    const body = await c.req.json();
    await postService.deletePost(body.id, body.userId);
    return c.json({ message: "Deleted" });
  });

  app.post("/adduser", async (c) => {
    const body: { name: string; password: string } = await c.req.json();
    const { user, isNew } = await userService.addUser(
      body.name,
      body.password,
    );

    setCookie(c, "userId", user._id.toString());
    setCookie(c, "username", user.name);

    return c.json({
      message: isNew ? "User created" : "Logged in",
    });
  });

  app.post("/subscribe", async (c) => {
    const { targetUserId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await subscriptionService.subscribe(userId!, targetUserId);
    return c.json({ message: "subscribed" });
  });

  app.post("/unsubscribe", async (c) => {
    const { targetUserId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await subscriptionService.unsubscribe(userId!, targetUserId);
    return c.json({ message: "unsubscribed" });
  });

  app.post("/like", async (c) => {
    const { currentUserId, postId } = await c.req.json();

    await likeService.like(currentUserId, postId);
    return c.json({ message: "liked" });
  });

  app.post("/unlike", async (c) => {
    const { currentUserId, postId } = await c.req.json();

    await likeService.unlike(currentUserId, postId);
    return c.json({ message: "unliked" });
  });
  return app;
};
