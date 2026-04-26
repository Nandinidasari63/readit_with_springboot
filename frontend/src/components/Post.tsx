// contains PostItem + FeedList + PostForm
import React from "react";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { type Action, type FeedState } from "../reducer.tsx";
import {
  handleAddPost,
  handleDeletePost,
  handleToggleLike,
} from "../actions.tsx";
import { format } from "date-fns";

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
    const postId = post._id;
    const likes = post.likes ?? [];

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
        onLike={() => handleToggleLike(dispatch, postId, isLike, data._id)}
      />
    );
  });
};

export const PostForm = ({
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
