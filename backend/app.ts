import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { FeedService } from "./services/feed_service.ts";
import { UserService } from "./services/user_service.ts";
import { PostService } from "./services/post_service.ts";
import { LikeService } from "./services/like_service.ts";
import { SubscriptionService } from "./services/subscription_service.ts";
import { AuthService } from "./services/auth_service.ts";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
const MAX_VIDEO_DURATION = 300; // 5 minutes in seconds
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
]);

const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY")!;
const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET")!;

async function cloudinaryUpload(
  file: File,
  resourceType: "image" | "video",
): Promise<{ secure_url: string; duration?: number }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Cloudinary signature: SHA-1("timestamp=<ts><api_secret>")
  const stringToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    encoder.encode(stringToSign),
  );
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", CLOUDINARY_API_KEY);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  return res.json() as Promise<{ secure_url: string; duration?: number }>;
}

export const createApp = () => {
  const userService = new UserService();
  const postService = new PostService();
  const likeService = new LikeService();
  const subscriptionService = new SubscriptionService();
  const authService = new AuthService();
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
  const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

  app.use(logger());

  app.use(
    "/*",
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    }),
  );
  app.post("/upload", async (c) => {
    const userId = getCookie(c, "userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const formData = await c.req.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No image file provided" }, 400);
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return c.json({ error: "Unsupported file type. Use JPG, PNG, GIF, or WEBP." }, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return c.json({ error: "File exceeds 5 MB limit." }, 400);
    }

    try {
      const result = await cloudinaryUpload(file, "image");
      return c.json({ url: result.secure_url });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return c.json({ error: message }, 500);
    }
  });

  app.post("/upload-video", async (c) => {
    const userId = getCookie(c, "userId");
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const formData = await c.req.formData();
    const file = formData.get("video");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No video file provided" }, 400);
    }

    if (!ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
      return c.json({ error: "Unsupported format. Use MP4, MOV, AVI, or WEBM." }, 400);
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return c.json({ error: "File exceeds 500 MB limit." }, 400);
    }

    try {
      const result = await cloudinaryUpload(file, "video");

      if (result.duration !== undefined && result.duration > MAX_VIDEO_DURATION) {
        return c.json({ error: "Video exceeds 5-minute limit." }, 400);
      }

      return c.json({ url: result.secure_url });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return c.json({ error: message }, 500);
    }
  });

  app.get("/auth/github/login", (c) => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: "read:user",
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

    const user = await userService.findOrCreateGithubUser(
      userJson.login,
      userJson.id,
    );
    setCookie(c, "userId", user._id.toString());
    setCookie(c, "username", user.name);

    return c.redirect(`${FRONTEND_URL}/`);
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
    const body = await c.req.json() as {
      title?: string | null;
      body?: string | null;
      imageUrl?: string;
      videoUrl?: string;
    };

    const userId = getCookie(c, "userId") as string;

    const user = await userService.getUser(userId);
    if (!user) {
      return c.json({ error: "User not found" }, 400);
    }

    const insertedId = await postService.addPost(
      {
        title: body.title ?? null,
        body: body.body ?? null,
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl,
      },
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
    const { postId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await likeService.like(userId!, postId);
    return c.json({ message: "liked" });
  });

  app.post("/unlike", async (c) => {
    const { postId } = await c.req.json();
    const userId = getCookie(c, "userId");

    await likeService.unlike(userId!, postId);
    return c.json({ message: "unliked" });
  });

  app.post("/signup", async (c) => {
    try {
      const body = await c.req.json() as {
        username?: string;
        password?: string;
      };

      if (!body.username || !body.password) {
        return c.json(
          { error: "Username and password are required" },
          400,
        );
      }

      const user = await authService.createUser(body.username, body.password);
      setCookie(c, "userId", user._id);
      setCookie(c, "username", user.name);

      return c.json({ user, message: "User created and logged in" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 400);
    }
  });

  app.post("/login", async (c) => {
    try {
      const body = await c.req.json() as {
        username?: string;
        password?: string;
      };

      if (!body.username || !body.password) {
        return c.json(
          { error: "Username and password are required" },
          400,
        );
      }

      const user = await authService.authenticateUser(
        body.username,
        body.password,
      );
      setCookie(c, "userId", user._id);
      setCookie(c, "username", user.name);

      return c.json({ user, message: "Logged in successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: message }, 401);
    }
  });

  app.post("/logout", (c) => {
    deleteCookie(c, "userId");
    deleteCookie(c, "username");
    return c.json({ message: "Logged out successfully" });
  });

  app.get("/me", async (c) => {
    const userId = getCookie(c, "userId");

    if (!userId) {
      return c.json({ data: null });
    }

    const user = await userService.getUser(userId);
    if (!user) {
      return c.json({ data: null });
    }

    return c.json({
      data: {
        _id: user._id.toString(),
        name: user.name,
      },
    });
  });

  return app;
};
