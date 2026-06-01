// contains PostItem + FeedList + PostForm
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type Action, type FeedState } from "../reducer.tsx";
import {
  handleAddPost,
  handleDeletePost,
  handleToggleLike,
} from "../actions.tsx";
import { format } from "date-fns";
import { useState } from "react";

const PostItem = ({
  data,
  ondelete,
  name,
  currentUserId,
  postOwnerId,
  onLike,
  isLike,
}: any) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isOwner = currentUserId === postOwnerId;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    await ondelete();
  };

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Avatar sx={{ marginRight: 2 }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {data.time}
              </Typography>
            </Box>
            {isOwner && <Chip label="Your Post" size="small" />}
          </Box>

          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {data.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginBottom: 2 }}
          >
            {data.body}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            variant={isLike ? "contained" : "outlined"}
            color={isLike ? "error" : "primary"}
            onClick={onLike}
          >
            👍 {isLike ? "Unlike" : "Like"} ({data.likes?.length || 0})
          </Button>

          {isOwner && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              sx={{ marginLeft: "auto" }}
            >
              🗑️ Delete
            </Button>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const FeedList = ({ data, dispatch }: any) => {
  if (!data || !Array.isArray(data.posts)) {
    return (
      <Paper sx={{ padding: 3, textAlign: "center" }}>
        <Typography color="textSecondary">Loading posts...</Typography>
      </Paper>
    );
  }

  if (data.posts.length === 0) {
    return (
      <Paper sx={{ padding: 3, textAlign: "center" }}>
        <Typography color="textSecondary">
          No posts yet. Start by creating one or subscribe to users!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        📰 Feed
      </Typography>
      {data.posts.map((post: any) => {
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
              await handleDeletePost(dispatch, post, data._id);
            }}
            onLike={() => handleToggleLike(dispatch, postId, isLike)}
          />
        );
      })}
    </Box>
  );
};

export const PostForm = ({
  dispatch,
  user,
}: {
  dispatch: React.Dispatch<Action>;
  user: FeedState;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title.trim() && !body.trim()) {
      alert("Please enter a title or body for your post");
      setIsSubmitting(false);
      return;
    }

    try {
      const newPost = {
        title: title || null,
        body: body || null,
        name: user.name,
        time: format(new Date(), "MMMM d, yyyy h:mm a"),
      };
      await handleAddPost(dispatch, newPost, user._id);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        ✍️ Create Post
      </Typography>
      <form onSubmit={submitPost}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            placeholder="Enter post title (optional)"
            multiline
            maxRows={2}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Body"
            name="body"
            placeholder="Write your post..."
            multiline
            rows={4}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ alignSelf: "flex-start" }}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};
