import { act } from "react";

export type Post = {
  title: string | null;
  body: string | null;
  time: string;
  name: string;
};

export type FeedState = {
  _id: string;
  name: string;
  password: string;
  posts: Post[];
  subscriptions: string[];
};

export enum Actions {
  ADD,
  DELETE,
  SET_INITIAL,
  LIKE,
}

export type Action =
  | { type: Actions.ADD; payload: Post }
  | { type: Actions.DELETE; payload: number }
  | { type: Actions.SET_INITIAL; payload: FeedState }
  | { type: Actions.LIKE; payload: number };

export const reducer = (state: FeedState, action: Action): FeedState => {
  switch (action.type) {
    case Actions.SET_INITIAL: {
      console.log(action.payload);
      return action.payload;
    }
    case Actions.ADD:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };

    case Actions.DELETE:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.payload),
      };

    case Actions.LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload
            ? {
              ...post,
              likes: post.likes.includes(state._id)
                ? post.likes.filter((id) => id !== state._id)
                : [...post.likes, state._id],
            }
            : post
        ),
      };

    default:
      return state;
  }
};
