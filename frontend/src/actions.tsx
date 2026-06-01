import { type Action, Actions, type Post } from "./reducer.tsx";
import { fetchPosts } from "./api.tsx";

import {
  addPostApi,
  deletePostApi,
  likeApi,
  subscribeApi,
  unlikeApi,
  unsubscribeApi,
} from "./api.tsx";

export const handleAddPost = async (
  dispatch: React.Dispatch<Action>,
  newPost: {
    title: string | null;
    body: string | null;
    time: string;
    name: string;
    imageUrl?: string;
  },
  currentUserId: string,
) => {
  const res = await addPostApi(newPost);
  const id = res?.insertedId;
  if (!id) throw new Error("Invalid response from server");

  dispatch({
    type: Actions.ADD,
    payload: {
      ...newPost,
      _id: id.toString(),
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
  await deletePostApi(post._id, userId);

  dispatch({
    type: Actions.DELETE,
    payload: post._id,
  });
};

export const handleToggleLike = async (
  dispatch: React.Dispatch<Action>,
  postId: string,
  isLiked: boolean,
) => {
  if (isLiked) {
    await unlikeApi(postId);
  } else {
    await likeApi(postId);
  }

  dispatch({
    type: Actions.LIKE,
    payload: postId,
  });
};

export const handleToggleSubscribe = async (
  dispatch: React.Dispatch<Action>,
  targetUserId: string,
  isSubscribed: boolean,
) => {
  if (isSubscribed) {
    await unsubscribeApi(targetUserId);
  } else {
    await subscribeApi(targetUserId);
  }

  const result = await fetchPosts();

  dispatch({
    type: Actions.SET_INITIAL,
    payload: result.data,
  });
};
