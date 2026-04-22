import { type Post } from "./reducer.tsx";

export const fetchPosts = async () => {
  const res = await fetch("http://localhost:8080/posts");
  return res.json();
};

export const addPostApi = async (post: Post) => {
  return await fetch("http://localhost:8080/add", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deletePostApi = async (id: string) => {
  await fetch("http://localhost:8080/delete", {
    method: "POST",
    body: JSON.stringify({ _id: id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
