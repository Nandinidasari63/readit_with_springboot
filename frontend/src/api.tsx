import { type Post } from "./reducer.tsx";

export const fetchPosts = async () => {
  const res = await fetch("http://localhost:8080/getdata");
  return res.json();
};

export const addPostApi = async (post: Post) => {
  await fetch("http://localhost:8080/add", {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const deletePostApi = async (post: Post) => {
  await fetch("http://localhost:8080/delete", {
    method: "POST",
    body: JSON.stringify(post),
  });
};
