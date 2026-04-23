export type Post = {
  id: number;
  title: string | null;
  body: string | null;
  time: string;
};

export type FeedState = {
  name: string;
  password: string;
  posts: Post[];
};

export enum Actions {
  ADD,
  DELETE,
  SET_INITIAL,
}

export type Action =
  | { type: Actions.ADD; payload: Post }
  | { type: Actions.DELETE; payload: number }
  | { type: Actions.SET_INITIAL; payload: FeedState };

export const reducer = (state: FeedState, action: Action): FeedState => {
  switch (action.type) {
    case Actions.SET_INITIAL:
      return action.payload;

    case Actions.ADD:
      return {
        _id: state._id,
        name: state.name,
        password: state.password,
        posts: [...state.posts, action.payload],
      };

    case Actions.DELETE:
      return {
        _id: state._id,
        name: state.name,
        password: state.password,
        posts: state.posts.filter((p) => p.id !== action.payload),
      };

    default:
      return state;
  }
};
