export type Post = {
  id: number;
  title: string | null;
  body: string | null;
  time: string;
};

export type FeedState = {
  nextId: number;
  posts: Post[];
};
export enum Actions {
  ADD,
  DELETE,
  SET_INITIAL,
}

export type Action =
  | { type: Actions.ADD; payload: post }
  | { type: Actions.DELETE; payload: number }
  | { type: Actions.SET_INITIAL; payload: Feed };

export const reducer = (state: Feed, action: Action): Feed => {
  switch (action.type) {
    case Actions.SET_INITIAL:
      return action.payload;

    case Actions.ADD:
      return {
        nextId: state.nextId + 1,
        posts: [...state.posts, action.payload],
      };

    case Actions.DELETE:
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.payload),
      };

    default:
      return state;
  }
};
