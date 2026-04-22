import { type Action, Actions, type Post } from "./reducer.tsx";
import { addPostApi, deletePostApi } from "./api.tsx";

export const handleAddPost = async (
  dispatch: React.Dispatch<Action>,
  newPost: Post,
) => {
  await addPostApi(newPost);

  dispatch({
    type: Actions.ADD,
    payload: newPost,
  });
};

export const handleDeletePost = async (
  dispatch: React.Dispatch<Action>,
  post: Post,
) => {
  await deletePostApi(post);

  dispatch({
    type: Actions.DELETE,
    payload: post.id,
  });
};
