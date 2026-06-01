import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Actions, type FeedState, reducer } from "./reducer.tsx";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useEffect, useReducer, useState } from "react";
import { fetchPosts, fetchUsers } from "./api.tsx";
import { FeedList, PostForm } from "./components/Post.tsx";
import { UsersList } from "./components/Users.tsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const App = () => {
  const [users, setUsers] = useState<FeedState[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    _id: "",
    name: "",
    posts: [],
    subscriptions: [],
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      globalThis.window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📖 Readit
          </Typography>
          {state.name && (
            <>
              <Typography sx={{ marginRight: 2 }}>
                Hello, {state.name}!
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
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
