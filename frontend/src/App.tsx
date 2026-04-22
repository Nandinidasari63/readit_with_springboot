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
    data: Post[];
    dispatch: React.Dispatch<Action>;
  },
) => {
  console.log("feed list", data, "check this");
  return data.map((post) => (
    <PostItem
      key={post._id}
      data={post}
      ondelete={async () => {
        const confirmed = globalThis.confirm(
          "Are you sure you want to delete this post?",
        );

        if (!confirmed) return;

        await handleDeletePost(dispatch, post);
      }}
    />
  ));
};

const PostForm = ({
  dispatch,
}: {
  dispatch: React.Dispatch<Action>;
}) => {
  const submitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const newPost = {
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
    posts: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPosts();
      console.log("initial data", result, "initial posts", result.data);
      dispatch({
        type: Actions.SET_INITIAL,
        payload: result.data,
      });
    };

    loadData();
  }, []);

  return (
    <>
      <PostForm dispatch={dispatch} />
      <FeedList dispatch={dispatch} data={state.posts} />
    </>
  );
};
export default App;
