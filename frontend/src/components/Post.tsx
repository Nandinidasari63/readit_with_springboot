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
import { uploadImageApi } from "../api.tsx";
import { format } from "date-fns";
import { useState, useRef } from "react";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024;

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
          {data.imageUrl && (
            <Box
              component="img"
              src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${data.imageUrl}`}
              alt="post image"
              sx={{
                maxWidth: "100%",
                maxHeight: 400,
                borderRadius: 1,
                objectFit: "contain",
                display: "block",
                marginBottom: 1,
              }}
            />
          )}
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      setFileError("Unsupported format. Use JPG, PNG, GIF, or WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setFileError("File exceeds 5 MB limit.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title.trim() && !body.trim() && !selectedFile) {
      alert("Please enter a title, body, or attach an image.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl: string | undefined;
      if (selectedFile) {
        const res = await uploadImageApi(selectedFile);
        imageUrl = res.url;
      }

      const newPost = {
        title: title || null,
        body: body || null,
        name: user.name,
        time: format(new Date(), "MMMM d, yyyy h:mm a"),
        imageUrl,
      };
      await handleAddPost(dispatch, newPost, user._id);
      e.currentTarget.reset();
      clearFile();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error instanceof Error ? error.message : "Failed to create post");
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

          <Box>
            <Button
              variant="outlined"
              component="label"
              disabled={isSubmitting}
              size="small"
            >
              Attach Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {fileError && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                {fileError}
              </Typography>
            )}
          </Box>

          {previewUrl && (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: 1,
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <Button
                size="small"
                color="error"
                onClick={clearFile}
                sx={{ mt: 0.5 }}
              >
                Remove
              </Button>
            </Box>
          )}

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
