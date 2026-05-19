import { useEffect, useState } from "react";
import { App } from "../App.tsx";
import { fetchPosts } from "../api.tsx";

// export const Login = () => {
//   const handleGithubLogin = () => {
//     globalThis.location.href = "http://localhost:8000/auth/github/login";
//   };

//   return (
//     <div className="login">
//       <h2>Login</h2>
//       <button type="button" onClick={handleGithubLogin}>
//         Login with GitHub
//       </button>
//     </div>
//   );
// };

export const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await fetch("http://localhost:8000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        password: password,
      }),
    });

    globalThis.location.reload();
  };

  return (
    <div className="login">
      <h2>Login</h2>

      <input
        placeholder="username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={handleLogin}
      >
        Login
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
