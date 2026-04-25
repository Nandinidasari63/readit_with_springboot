export const fetchPosts = async () => {
  const res = await fetch("http://localhost:8000/posts", {
    credentials: "include",
  });
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch("http://localhost:8000/users", {
    credentials: "include",
  });
  return res.json();
};

export const addPostApi = async (post: {
  title: string | null;
  body: string | null;
  time: string;
}) => {
  const res = await fetch("http://localhost:8000/add", {
    method: "POST",
    body: JSON.stringify(post),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const deletePostApi = async (id: number, userId: string) => {
  await fetch("http://localhost:8000/delete", {
    method: "POST",
    body: JSON.stringify({ id: id, userId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addUserApi = async (name: string, password: string) => {
  await fetch("http://localhost:8000/adduser", {
    method: "POST",
    body: JSON.stringify({ name, password }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const subscribeApi = async (targetUserId: string) => {
  await fetch("http://localhost:8000/subscribe", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const unsubscribeApi = async (targetUserId: string) => {
  await fetch("http://localhost:8000/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const likeApi = async (
  currentUserId: string,
  postOwnerId: string,
  postId: number,
) => {
  await fetch("http://localhost:8000/like", {
    method: "POST",
    body: JSON.stringify({ currentUserId, postOwnerId, postId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const unlikeApi = async (
  currentUserId: string,
  postOwnerId: string,
  postId: number,
) => {
  await fetch("http://localhost:8000/unlike", {
    method: "POST",
    body: JSON.stringify({
      currentUserId,
      postOwnerId,
      postId,
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
