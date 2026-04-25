import { type Action, Actions, type Post } from "./reducer.tsx";
import { addPostApi, deletePostApi } from "./api.tsx";

export const handleAddPost = async (dispatch, newPost, currentUserId) => {
  const res = await addPostApi(newPost);

  dispatch({
    type: Actions.ADD,
    payload: {
      ...newPost,
      _id: res.insertedId,
      likes: [],
      userId: currentUserId,
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
