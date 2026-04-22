import "./App.css";

const Title = () => (
  <div className="title">
    <p>Title</p>
    <input type="text" placeholder="Enter a title"></input>
  </div>
);

const Body = () => (
  <div className="body">
    <p>Title</p>
    <textarea name="body" id="text-area" placeholder="Write your post....">
    </textarea>
  </div>
);

const Post = () => {
  const submitPost = (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={submitPost}>
        <Title />
        <Body />
        <button type="submit" id="submit-btn">Post</button>
      </form>
    </>
  );
};

const App = () => {
  return <Post />;
};
export default App;
