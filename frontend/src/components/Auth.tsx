import { useEffect, useState } from "react";
import { App } from "../App.tsx";
import { fetchPosts } from "../api.tsx";

export const Login = () => {
  const handleGithubLogin = () => {
    globalThis.location.href = "http://localhost:8000/auth/github/login";
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <button type="button" onClick={handleGithubLogin}>
        Login with GitHub
      </button>
    </div>
  );
};
export const Auth = () => {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetchPosts();
        if (res?.data?._id) {
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      } catch {
        setIsLogged(false);
      }
    };

    checkLogin();
  }, []);

  if (isLogged === null) return <p>Loading...</p>;

  return isLogged ? <App /> : <Login />;
};
