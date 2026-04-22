import { ObjectId } from "mongodb";
export type Post = {
  id: ObjectId; 

  title: string | null;
  body: string | null;
  time: string;
};

export type FeedState = {
  posts: Post[];
};

export enum Actions {
  ADD,
  DELETE,
  SET_INITIAL,
}

export type Action =
  | { type: Actions.ADD; payload: Post }
  | { type: Actions.DELETE; payload: string }
  | { type: Actions.SET_INITIAL; payload: Post[] };

export const reducer = (state: FeedState, action: Action): FeedState => {
  switch (action.type) {
    case Actions.SET_INITIAL:
      return { posts: action.payload };

    case Actions.ADD:
      return {
        posts: [...state.posts, action.payload],
      };

    case Actions.DELETE:
      return {
        ...state,
        posts: state.posts.filter((p) => p._id !== action.payload),
      };

    default:
      return state;
  }
};
