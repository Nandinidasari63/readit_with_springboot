import { useEffect, useState } from "react";
import { App } from "../App.tsx";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Authentication failed");
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    globalThis.window.location.href = `${API_URL}/auth/github/login`;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography
            variant="h4"
            sx={{ marginBottom: 3, textAlign: "center" }}
          >
            {isSignup ? "Create Account" : "Login to Readit"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={isLoading}
              required
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ marginTop: 2, marginBottom: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Button
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
              disabled={isLoading}
            >
              {isSignup ? "Back to Login" : "Create New Account"}
            </Button>
          </Box>

          <Divider sx={{ marginY: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGithubLogin}
            disabled={isLoading}
            sx={{ marginTop: 2 }}
          >
            Login with GitHub
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export const Auth = () => {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          credentials: "include",
        });
        const result = await response.json();
        setIsLogged(!!result.data?._id);
      } catch {
        setIsLogged(false);
      }
    };

    checkLogin();
  }, []);

  if (isLogged === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isLogged ? (
    <App />
  ) : (
    <Login onLoginSuccess={() => setIsLogged(true)} />
  );
};
