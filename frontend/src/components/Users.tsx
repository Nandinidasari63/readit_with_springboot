import { handleToggleSubscribe } from "../actions.tsx";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Actions } from "../reducer.tsx";

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
                onClick={() =>
                  handleToggleSubscribe(
                    dispatch,
                    user._id,
                    isSubscribed,
                  )}
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

export const UsersList = ({ users, currentUser, dispatch }) => {
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
