# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev
& build performances. To add it, see
[this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install
[eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
and
[eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)
for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# Readit

Your goal is to make a Reddit clone called Readit. If you don't know reddit, go
check it out.

For the first version, we will make a frontend only app that allows a user to
create a post, read a post and delete a post.

## Create

When you make a post(title + content) and click on Post, it should appear below
in your feed. The most recent post should be at the top.

## Delete

Delete should only happen with a confirmation.

# Conditions

- Frontend only
- Start simple, eventually add a reducer
- Keep the UI simple
- Do not use Tailwind or Material UI to start with.
- We can beautify it later
- Assume a default user name for now.
- Consider using the `date-fns` library for the dates and time stamps

# Backend

Add a backend and have all the interactions update the backend before updating
frontend state.

Upon first render, a fetch has to happen to get the initial state of the system
and render it.

# Things to consider

- Cors vs Proxy
- Where will you put the effect?
- If you are using reducers, will the update on the frontend happen before or
  after the call?

# Persistence

We will now add a persistence layer in the backend.

For our database, we will choose MongoDB. You will have to research and find out
how to use MongoDB, how to use MongoDB in Javascript, then use MongoDB in
Javascript.

The best suggestion is to first build a persistence layer independent of
MongoDB. Inject that as a dependency, then implement the MongoDB version of the
persitence layer interface.

Best of luck.

# Auth

Add a login mechanism. A user should only be able to see their posts, create
posts and generally perform other operations upon login.

Have the authentication be basic as of now. Just a username and a password.

Signup and login are the same at this point.

# Things to think about

- How does the backend change?
- How does the frontend change?
- What is the flow?
- Are you still a single page app? If not, how will it work?
- Maybe contexts get useful now?

# Likes

- Each post can be liked.
- Each post also shows how many likes it has received.
- A liked post can be unliked
- Your own post can be liked
- You can't like a post multiple times.

# Github OAuth

- The user should be able to login to your system with my Github account.
- Replace your current Login flow with Github OAuth.
- Get the username and id from the Github account they've logged in with
- Create mock data in your database pertaining to other users(since you probably
  won't be able to login with multiple Github ids)

f044d3fb5d68cb00d0f1c60ac49aa1f3a6787a14 - secret Ov23li6wQnWSJXHPuF1Y - id

https://github.com/login/oauth/authorize?client_id=Ov23li6wQnWSJXHPuF1Y&redirect_uri=http://localhost:8000/auth/github/callback
