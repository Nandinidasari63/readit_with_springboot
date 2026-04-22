import { type Action, Actions, type Post } from "./reducer.tsx";
import { addPostApi, deletePostApi } from "./api.tsx";

export const handleAddPost = async (
  dispatch: React.Dispatch<Action>,
  newPost: Post,
) => {
  const res = await addPostApi(newPost);
  const result = await res.json();

  dispatch({
    type: Actions.ADD,
    payload: {
      ...newPost,
      _id: result.id,
    },
  });
};

export const handleDeletePost = async (
  dispatch: React.Dispatch<Action>,
  post: Post,
) => {
  await deletePostApi(post._id);

  dispatch({
    type: Actions.DELETE,
    payload: post._id,
  });
};
