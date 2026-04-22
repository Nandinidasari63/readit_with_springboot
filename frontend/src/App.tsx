import "./App.css";
import { format } from "date-fns";
import {
  type Action,
  Actions,
  type FeedState,
  type Post,
  reducer,
} from "./reducer.tsx";
import { useEffect, useReducer } from "react";
import { handleAddPost, handleDeletePost } from "./actions.tsx";
import { fetchPosts } from "./api.tsx";

const Title = () => (
  <div className="title-container">
    <p>Title</p>
    <input type="text" name="title" placeholder="Enter a title" id="title" />
  </div>
);

const Body = () => (
  <div className="body">
    <p>Title</p>
    <textarea name="body" id="text-area" placeholder="Write your post....">
    </textarea>
  </div>
);

const PostItem = (
  { data, ondelete }: { data: Post; ondelete: () => void },
) => (
  <>
    <h3>Alex Johnson</h3>
    <p>{data.time}</p>
    <h2>{data.title}</h2>
    <p>{data.body}</p>
    <button type="button" onClick={ondelete}>Delete</button>
  </>
);

export const FeedList = (
  { data, dispatch }: {
    data: FeedState;
    dispatch: React.Dispatch<Action>;
  },
) => {
  return data.posts.map((post) => (
    <PostItem
      key={post.id}
      data={post}
      ondelete={() => handleDeletePost(dispatch, post)}
    />
  ));
};

const PostForm = ({
  dispatch,
  data,
}: {
  dispatch: React.Dispatch<Action>;
  data: FeedState;
}) => {
  const submitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const newPost = {
      id: data.nextId + 1,
      title,
      body,
      time: format(new Date(), "MMMM d, yyyy h:mm a"),
    };

    handleAddPost(dispatch, newPost);

    e.currentTarget.reset();
  };

  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={submitPost}>
        <Title />
        <Body />
        <button type="submit">Post</button>
      </form>
    </>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    nextId: 0,
    posts: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPosts();

      dispatch({
        type: Actions.SET_INITIAL,
        payload: result.data,
      });
    };

    loadData();
  }, []);

  return (
    <>
      <PostForm dispatch={dispatch} data={state} />
      <FeedList dispatch={dispatch} data={state} />
    </>
  );
};
export default App;
