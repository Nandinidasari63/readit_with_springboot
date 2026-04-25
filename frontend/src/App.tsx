import "./App.css";
import { format } from "date-fns";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { TextField } from "@mui/material";
import {
  type Action,
  Actions,
  type FeedState,
  type Post,
  reducer,
} from "./reducer.tsx";
import { useEffect, useReducer, useState } from "react";
import { handleAddPost, handleDeletePost } from "./actions.tsx";
import {
  addUserApi,
  fetchPosts,
  fetchUsers,
  likeApi,
  subscribeApi,
  unlikeApi,
  unsubscribeApi,
} from "./api.tsx";
import React from "react";
const Title = () => (
  <div className="title-container">
    <p>Title</p>
    {
      <Box sx={{ width: 500, maxWidth: "100%" }}>
        <TextField fullWidth label="fullWidth" id="fullWidth" name="title" />
      </Box>
    }
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
  { data, ondelete, name, currentUserId, postOwnerId, onLike, isLike },
) => {
  const isOwner = currentUserId === postOwnerId;
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        margin: "10px",
      }}
    >
      <h3>{name}</h3>
      <p>{data.time}</p>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
      <button
        type="button"
        style={{ margin: "10px", padding: "3px" }}
        onClick={onLike}
      >
        👍 {isLike ? "unlike" : "like"}
      </button>
      <p>{data.likes.length}</p>
      {isOwner && (
        <button
          type="button"
          onClick={ondelete}
          style={{ margin: "10px", padding: "4px" }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export const FeedList = ({
  data,
  dispatch,
}) => {
  if (!data || !Array.isArray(data.posts)) {
    return <p>Loading posts...</p>;
  }

  return data.posts.map((post) => {
    const postId = post._id; // ✅ new ID
    const likes = post.likes ?? []; // ✅ safe fallback

    const isLike = likes.includes(data._id);

    return (
      <PostItem
        key={postId}
        data={post}
        name={post.name}
        currentUserId={data._id}
        postOwnerId={post.userId}
        isLike={isLike}
        ondelete={async () => {
          const confirmed = globalThis.confirm(
            "Are you sure you want to delete this post?",
          );

          if (!confirmed) return;

          await handleDeletePost(dispatch, post, data._id);
        }}
        onLike={async () => {
          if (isLike) {
            await unlikeApi(data._id, post.userId, postId);
          } else {
            await likeApi(data._id, post.userId, postId);
          }

          dispatch({
            type: Actions.LIKE,
            payload: postId, // ✅ use _id
          });
        }}
      />
    );
  });
};

const PostForm = ({
  dispatch,
  user,
}: {
  dispatch: React.Dispatch<Action>;
  user: FeedState;
}) => {
  const submitPost = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const newPost = {
      title,
      body,
      name: user.name,
      time: format(new Date(), "MMMM d, yyyy h:mm a"),
    };
    handleAddPost(dispatch, newPost, user._id);
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

const SearchBar = ({ onSearch, text }) => {
  return (
    <>
      <h3>Search users</h3>
      {
        <Box sx={{ width: 500, maxWidth: "100%" }}>
          <TextField
            fullWidth
            label="fullWidth"
            id="fullWidth"
            name="title"
            value={text}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Box>
      }
      <button type="button">Search</button>
    </>
  );
};

const Users = (
  { users, searchedTerm, currentUser, dispatch },
) => {
  if (searchedTerm === "") return null;

  const filtered = users.filter(
    (user) =>
      user.name.includes(searchedTerm) &&
      user._id !== currentUser._id, // remove logged in data
  );

  return (
    <>
      {filtered.map((user) => {
        const isSubscribed = currentUser.subscriptions?.includes(user._id) ??
          false;

        return (
          <div
            key={user._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p>{user.name}</p>

            {
              <button
                type="button"
                onClick={async () => {
                  if (isSubscribed) {
                    await unsubscribeApi(user._id);
                  } else {
                    await subscribeApi(user._id);
                  }

                  const result = await fetchPosts();
                  dispatch({
                    type: Actions.SET_INITIAL,
                    payload: result.data,
                  });
                }}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            }
          </div>
        );
      })}
    </>
  );
};

const UsersList = ({ users, currentUser, dispatch }) => {
  const [text, setText] = useState("");

  return (
    <>
      <SearchBar onSearch={setText} text={text} />
      <Users
        users={users}
        searchedTerm={text}
        currentUser={currentUser}
        dispatch={dispatch}
      />
    </>
  );
};

const App = () => {
  const [users, setUsers] = useState<FeedState[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    _id: "",
    name: "",
    password: "",
    posts: [],
    subscriptions: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchUsers();
      setUsers(result.data);
    };
    loadData();
  }, []);

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
      <CssBaseline />
      <Container fixed>
        <Box sx={{ bgcolor: "rgba(212, 209, 209, 0.1)", padding: "20px" }}>
          <UsersList users={users} currentUser={state} dispatch={dispatch} />
          <PostForm dispatch={dispatch} user={state} />
          <FeedList dispatch={dispatch} data={state} />
        </Box>
      </Container>
    </>
  );
};

const Login = ({ setLogStatus }) => {
  const onsubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("username") as string;
    const password = formData.get("password") as string;
    await addUserApi(name, password);
    setLogStatus(true);
  };

  return (
    <>
      <form
        className="login"
        onSubmit={onsubmit}
      >
        <h2>Login</h2>
        <input type="text" placeholder="enter name" name="username" />
        <input type="password" placeholder="enter password" name="password" />
        <button type="submit">
          Login
        </button>
      </form>
    </>
  );
};

const Auth = () => {
  const [islogged, setLogStatus] = useState(false);
  const component = islogged ? <App /> : <Login setLogStatus={setLogStatus} />;
  return component;
};

export default Auth;
