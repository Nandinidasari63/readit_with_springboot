import { type Action, Actions, type Post } from "./reducer.tsx";
import { addPostApi, deletePostApi } from "./api.tsx";

export const handleAddPost = async (
  dispatch: React.Dispatch<Action>,
  newPost: {
    id: number;
    title: string | null;
    body: string | null;
    time: string;
    likes: string[];
    userId: string;
    name: string;
  },
) => {
  await addPostApi(newPost);

  dispatch({
    type: Actions.ADD,
    payload: {
      ...newPost,
    },
  });
};

export const handleDeletePost = async (
  dispatch: React.Dispatch<Action>,
  post: Post,
  userId: string,
) => {
  await deletePostApi(post.id, userId);

  dispatch({
    type: Actions.DELETE,
    payload: post.id,
  });
};

export const handleToggleLike = async (
  dispatch: React.Dispatch<Action>,
  post: Post,
) => {
  await deletePostApi(post.id, post.userId);

  dispatch({
    type: Actions.LIKE,
    payload: post.id,
  });
};
