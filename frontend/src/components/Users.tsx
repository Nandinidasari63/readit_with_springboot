import { handleToggleSubscribe } from "../actions.tsx";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Actions } from "../reducer.tsx";

const SearchBar = (
  { onSearch, text, isLoading }: {
    onSearch: (text: string) => void;
    text: string;
    isLoading: boolean;
  },
) => {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        🔍 Search Users
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label="Search for users..."
          value={text}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Enter username"
          disabled={isLoading}
          size="small"
        />
      </Box>
    </Box>
  );
};

const Users = (
  { users, searchedTerm, currentUser, dispatch, isLoading }: any,
) => {
  if (searchedTerm.trim() === "") return null;

  const filtered = users.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchedTerm.toLowerCase()) &&
      user._id !== currentUser._id,
  );

  if (filtered.length === 0) {
    return (
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography color="textSecondary">
          No users found matching "{searchedTerm}"
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ marginBottom: 2 }}>
      <List>
        {filtered.map((user: any, index: number) => {
          const isSubscribed = currentUser.subscriptions?.includes(user._id) ??
            false;

          return (
            <Box key={user._id}>
              <ListItem
                secondaryAction={
                  <Button
                    variant={isSubscribed ? "contained" : "outlined"}
                    color={isSubscribed ? "error" : "primary"}
                    onClick={() =>
                      handleToggleSubscribe(
                        dispatch,
                        user._id,
                        isSubscribed,
                      )}
                    disabled={isLoading}
                    size="small"
                  >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                  </Button>
                }
              >
                <ListItemText
                  primary={user.name}
                  secondary={`${user.posts?.length || 0} posts`}
                />
              </ListItem>
              {index < filtered.length - 1 && <Divider />}
            </Box>
          );
        })}
      </List>
    </Paper>
  );
};

export const UsersList = ({ users, currentUser, dispatch }: any) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box sx={{ marginBottom: 3 }}>
      <SearchBar onSearch={setText} text={text} isLoading={isLoading} />
      <Users
        users={users}
        searchedTerm={text}
        currentUser={currentUser}
        dispatch={dispatch}
        isLoading={isLoading}
      />
    </Box>
  );
};
