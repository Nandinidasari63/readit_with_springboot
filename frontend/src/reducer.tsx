export type Post = {
  _id: string;
  title: string | null;
  body: string | null;
  time: string;
  name: string;
  userId: string;
  likes: string[];
};

export type FeedState = {
  _id: string;
  name: string;
  posts: Post[];
  subscriptions: string[];
};

export enum Actions {
  ADD,
  DELETE,
  SET_INITIAL,
  LIKE,
  TOGGLE_SUBSCRIPTION,
}

export type Action =
  | { type: Actions.ADD; payload: Post }
  | { type: Actions.DELETE; payload: string }
  | { type: Actions.SET_INITIAL; payload: FeedState }
  | { type: Actions.LIKE; payload: string }
  | { type: Actions.TOGGLE_SUBSCRIPTION; payload: string };

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
        posts: state.posts.filter((p) => p._id !== action.payload),
      };

    case Actions.LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload
            ? {
              ...post,
              likes: (post.likes ?? []).includes(state._id)
                ? post.likes.filter((id) => id !== state._id)
                : [...(post.likes ?? []), state._id],
            }
            : post
        ),
      };

    case Actions.TOGGLE_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: state.subscriptions.includes(action.payload)
          ? state.subscriptions.filter((id) => id !== action.payload)
          : [...state.subscriptions, action.payload],
      };

    default:
      return state;
  }
};
