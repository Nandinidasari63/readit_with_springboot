import { addUserApi } from "../api.tsx";
import { useState } from "react";
import { App } from "../App.tsx";

export const Login = ({ setLogStatus }) => {
  const onsubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("username") as string;
    const password = formData.get("password") as string;
    await addUserApi(name, password);
    setLogStatus(true);
  };

  return (
    <>
      <form
        className="login"
        onSubmit={onsubmit}
      >
        <h2>Login</h2>
        <input type="text" placeholder="enter name" name="username" />
        <input type="password" placeholder="enter password" name="password" />
        <button type="submit">
          Login
        </button>
      </form>
    </>
  );
};

export const Auth = () => {
  const [islogged, setLogStatus] = useState(false);
  const component = islogged ? <App /> : <Login setLogStatus={setLogStatus} />;
  return component;
};
