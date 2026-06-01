const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const request = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
};

export const fetchUsers = async () => {
  return await request("/users");
};

export const addUserApi = async (name: string, password: string) => {
  return await request("/adduser", {
    method: "POST",
    body: JSON.stringify({ name, password }),
  });
};

export const fetchPosts = async () => {
  return await request("/posts");
};

export const uploadImageApi = async (file: File): Promise<{ url: string }> => {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? `Upload failed: ${res.status}`);
  }

  return res.json();
};

export const addPostApi = async (post: {
  title: string | null;
  body: string | null;
  time: string;
  name: string;
  imageUrl?: string;
}) => {
  return await request("/add", {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const deletePostApi = async (id: string, userId: string) => {
  return await request("/delete", {
    method: "POST",
    body: JSON.stringify({ id, userId }),
  });
};

export const subscribeApi = async (targetUserId: string) => {
  return await request("/subscribe", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });
};

export const unsubscribeApi = async (targetUserId: string) => {
  return await request("/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });
};

export const likeApi = async (postId: string) => {
  return await request("/like", {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
};

export const unlikeApi = async (postId: string) => {
  return await request("/unlike", {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
};

export const logoutApi = async () => {
  return await request("/logout", {
    method: "POST",
  });
};
