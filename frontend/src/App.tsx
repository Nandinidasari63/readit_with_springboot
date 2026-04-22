import { useState } from "react";
import "./App.css";

type post = {
title:string | null,
body:string | null
}

type postProps =  
  {setPost:(x:post[]) => void,data:post[]}


const Title = () => (
  <div className="title-container">
    <p>Title</p>
    <input type="text" name="title" placeholder="Enter a title" id="title"></input>
  </div>
);

const Body = () => (
  <div className="body">
    <p>Title</p>
    <textarea name="body" id="text-area" placeholder="Write your post....">
    </textarea>
  </div>
);


const SingleFeed = ({data}:{data:post}) => <>
<h3>Alex Johnson</h3>
<p>1234</p>
<h2>{data.title}</h2>
<p>{data.body}</p>
<button type="button">Delete</button>
</>

const Feed = ({data}:{data:post[]}) => {
return data.map((post) => 
  <SingleFeed data={post}/>
)
}

const Post = ({setPost,data}:postProps) => {
  
  const submitPost = (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);  
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const newPost = {title,body};
    setPost([...data,newPost])
  };

  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={submitPost}>
        <Title />
        <Body />
        <button type="submit" id="submit-btn">Post</button>
      </form>
      <Feed data={data}/>
    </>
  );
};

const App = () => {
  const [post,setPost] =  useState<post[]>([{title:"title of post",body:"this is my post"}])
  return <Post setPost={setPost} data={post}/>;
};
export default App;
