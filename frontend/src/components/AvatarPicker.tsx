import React, { useState, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { type Action, Actions } from "../reducer.tsx";
import { setPresetAvatarApi, uploadAvatarApi } from "../api.tsx";

const PRESET_SEEDS = [
  "Felix", "Aneka", "Jasper", "Lily", "Max",
  "Zoe", "Leo", "Mia", "Sam", "Iris", "Rex", "Nova",
];

const dicebearUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;

const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export const AvatarPicker = ({
  open,
  onClose,
  dispatch,
}: {
  open: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
}) => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyAvatar = (avatarUrl: string) => {
    dispatch({ type: Actions.SET_AVATAR, payload: avatarUrl });
    onClose();
  };

  const handlePresetSelect = async (seed: string) => {
    setLoading(true);
    setError(null);
    try {
      const { avatarUrl } = await setPresetAvatarApi(dicebearUrl(seed));
      applyAvatar(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setError("Unsupported format. Use JPG, PNG, or WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("File exceeds 2 MB limit.");
      e.target.value = "";
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { avatarUrl } = await uploadAvatarApi(file);
      applyAvatar(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Choose Avatar</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Presets" />
          <Tab label="Upload" />
        </Tabs>

        {error && (
          <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
            {error}
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && tab === 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
            {PRESET_SEEDS.map((seed) => (
              <Box
                key={seed}
                onClick={() => handlePresetSelect(seed)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  p: 0.5,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Avatar
                  src={dicebearUrl(seed)}
                  sx={{ width: 64, height: 64 }}
                />
                <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 0.5 }}>
                  {seed}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {!loading && tab === 1 && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              JPG, PNG or WEBP · max 2 MB · cropped to square automatically
            </Typography>
            <Button variant="outlined" component="label">
              Choose Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
