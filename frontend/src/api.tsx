// import { type Post } from "./reducer.tsx";

export const fetchPosts = async () => {
  const res = await fetch("http://localhost:8080/posts", {
    credentials: "include",
  });
  return res.json();
};

export const addPostApi = async (post: {
  id: number;
  title: string | null;
  body: string | null;
  time: string;
}) => {
  return await fetch("http://localhost:8080/add", {
    method: "POST",
    body: JSON.stringify(post),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deletePostApi = async (id: number, userId: string) => {
  await fetch("http://localhost:8080/delete", {
    method: "POST",
    body: JSON.stringify({ id: id, userId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addUserApi = async (name: string, password: string) => {
  await fetch("http://localhost:8080/adduser", {
    method: "POST",
    body: JSON.stringify({ name, password }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
