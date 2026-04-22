import { useEffect, useState } from "react";
import "./App.css";
import { format } from "date-fns";

type post = {
  id: number;
  title: string | null;
  body: string | null;
  time: string;
};

type Feed = {
  nextId: number;
  posts: post[];
};

type postProps = {
  setPost: React.Dispatch<React.SetStateAction<Feed>>;
  data: Feed;
};
const Title = () => (
  <div className="title-container">
    <p>Title</p>
    <input type="text" name="title" placeholder="Enter a title" id="title" />
  </div>
);

const Body = () => (
  <div className="body">
    <p>Title</p>
    <textarea name="body" id="text-area" placeholder="Write your post....">
    </textarea>
  </div>
);

const SinglePost = (
  { data, ondelete }: { data: post; ondelete: () => void },
) => (
  <>
    <h3>Alex Johnson</h3>
    <p>{data.time}</p>
    <h2>{data.title}</h2>
    <p>{data.body}</p>
    <button type="button" onClick={ondelete}>Delete</button>
  </>
);

const Feed = (
  { data, setPost }: {
    data: Feed;
    setPost: React.Dispatch<React.SetStateAction<Feed>>;
  },
) => {
  return data.posts.map((post) => (
    <SinglePost
      key={post.id}
      data={post}
      ondelete={() => {
        const deletePost = async () => {
          const response = await fetch("http://localhost:8080/delete", {
            method: "POST",
            body: JSON.stringify(post),
          });
          const result = await response.json();
          console.log("in delete", response, result.data);
          setPost(result.data);
        };
        deletePost();
      }}
    />
  ));
};

const Post = ({ setPost, data }: postProps) => {
  const submitPost = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const time = format(new Date(Date.now()), "yyyy-MM-dd");
    const newPost = { id: data.nextId + 1, title, body, time };

    const addData = async () => {
      const response = await fetch("http://localhost:8080/add", {
        method: "POST",
        body: JSON.stringify(newPost),
      });
      const result = await response.json();
      setPost(result.data);
    };

    addData();
  };

  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={submitPost}>
        <Title />
        <Body />
        <button type="submit" id="submit-btn">Post</button>
      </form>
      <Feed data={data} setPost={setPost} />
    </>
  );
};

const App = () => {
  const [postList, setPost] = useState<Feed>({
    nextId: 1,
    posts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/getdata");
      const result = await response.json();
      console.log(response, result.data);
      setPost(result.data);
    };

    fetchData();
  }, []);
  return <Post setPost={setPost} data={postList} />;
};
export default App;
