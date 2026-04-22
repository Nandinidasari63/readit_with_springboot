import "./App.css";
import { format } from "date-fns";
import {
  type Action,
  Actions,
  type Feed,
  type post,
  reducer,
} from "./reducer.tsx";
import { useEffect, useReducer } from "react";

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

const SinglePost = (
  { data, ondelete }: { data: post; ondelete: () => void },
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
    data: Feed;
    dispatch: React.Dispatch<Action>;
  },
) => {
  return data.posts.map((post) => (
    <SinglePost
      key={post.id}
      data={post}
      ondelete={async () => {
        await fetch("http://localhost:8080/delete", {
          method: "POST",
          body: JSON.stringify(post),
        });

        dispatch({ type: Actions.DELETE, payload: post.id });
      }}
    />
  ));
};

const Post = ({ dispatch, data }: {
  dispatch: React.Dispatch<Action>;
  data: Feed;
}) => {
  const submitPost = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const time = format(new Date(Date.now()), "MMMM d, yyyy h:m a");
    const newPost = { id: data.nextId + 1, title, body, time };

    (async () =>
      await fetch("http://localhost:8080/add", {
        method: "POST",
        body: JSON.stringify(newPost),
      }))();

    dispatch({ type: Actions.ADD, payload: newPost });
  };

  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={submitPost}>
        <Title />
        <Body />
        <button type="submit" id="submit-btn">Post</button>
      </form>
      <FeedList data={data} dispatch={dispatch} />
    </>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    nextId: 0,
    posts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/getdata");
      const result = await response.json();

      dispatch({
        type: Actions.SET_INITIAL,
        payload: result.data,
      });
    };

    fetchData();
  }, []);

  return <Post dispatch={dispatch} data={state} />;
};
export default App;
