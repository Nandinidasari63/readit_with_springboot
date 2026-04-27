import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Actions, type FeedState, reducer } from "./reducer.tsx";
import Box from "@mui/material/Box";

import { useEffect, useReducer, useState } from "react";
import { fetchPosts, fetchUsers } from "./api.tsx";
import { FeedList, PostForm } from "./components/Post.tsx";
import { UsersList } from "./components/Users.tsx";

export const App = () => {
  const [users, setUsers] = useState<FeedState[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    _id: "",
    name: "",
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
