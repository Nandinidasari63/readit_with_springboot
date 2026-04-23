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
import { addUserApi, fetchPosts, fetchUsers } from "./api.tsx";
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
  { data, ondelete, name }: { data: Post; ondelete: () => void; name: string },
) => {
  console.log(name, data);
  return (
    <>
      <h3>{name}</h3>
      <p>{data.time}</p>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
      <button type="button" onClick={ondelete}>Delete</button>
    </>
  );
};

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
      name={data.name}
      ondelete={async () => {
        const confirmed = globalThis.confirm(
          "Are you sure you want to delete this post?",
        );

        if (!confirmed) return;
        await handleDeletePost(dispatch, post, data._id);
      }}
    />
  ));
};

const PostForm = ({
  dispatch,
}: {
  dispatch: React.Dispatch<Action>;
}) => {
  const [id, setId] = useState(0);
  const submitPost = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const newPost = {
      id,
      title,
      body,
      time: format(new Date(), "MMMM d, yyyy h:mm a"),
    };

    handleAddPost(dispatch, newPost);
    setId((id) => id + 1);
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

const SearchBar = ({ users }: { users: FeedState }) => (
  <>
    <h3>Search users</h3>
    {
      <Box sx={{ width: 500, maxWidth: "100%" }}>
        <TextField fullWidth label="fullWidth" id="fullWidth" name="title" />
      </Box>
    }
    <button type="button">Search</button>
    <p>3 users found</p>
  </>
);

const Users = ({ users }: { users: FeedState }) => (
  <>
    <div className="user">
      <p>Name</p>
      <button type="button">Subscribe</button>
    </div>
  </>
);

const UsersList = () => {
  const [users, setUsers] = useState<FeedState>(null);
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchUsers();
      setUsers(result);
    };
    loadData();
  }, []);

  return (
    <>
      <SearchBar users={users} />
      <Users users={users} />
    </>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    name: null,
    password: null,
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
      <CssBaseline />
      <Container fixed>
        <Box sx={{ bgcolor: "rgba(212, 209, 209, 0.1)", padding: "20px" }}>
          <UsersList />
          <PostForm dispatch={dispatch} />
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
