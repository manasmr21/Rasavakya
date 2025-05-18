import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../ContextProvider/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SinglePost() {
  const { loginData, poems = [], likedPosts, setLikedPosts } = useContext(LoginContext);
  const postId = useParams();
  const [comment, setComment] = useState("");
  const [hide, setHide] = useState("hidden");
  const navigate = useNavigate();
  const token = localStorage.getItem("userDataToken");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loginData?.likedPosts) {
      const liked = loginData.likedPosts.includes(postId?.postID);
      setIsLiked(liked);
    }
  }, [loginData, postId]);

  const thePost = poems?.find((poem) => poem._id === postId?.postID);

  const comments = thePost?.comments ?? []; // Default to an empty array

  // Like a post
  const likePost = async () => {
    try {
      const data = await fetch("https://rasavakya-backend.vercel.app/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ postId: postId?.postID }),
      });

      const response = await data.json();
      if (data.ok) {
        setIsLiked(!isLiked);
      } else {
        toast.error(response?.error || "Failed to like the post", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (thePost?.poem) {
      const post = document.getElementById("post");
      post.innerHTML = thePost.poem;
    }
  }, [isLiked, thePost]);

  // Comment on the post
  const commentOnPost = async () => {
    try {
      const data = await fetch("https://rasavakya-backend.vercel.app/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          postId: postId?.postID,
          comment,
        }),
      });

      const response = await data.json();

      if (!data.ok) {
        toast.error(response?.error || "Failed to post the comment", {
          position: "top-center",
        });
      } else {
        setTimeout(() => {
          window.location.reload();
          toast.success(response?.message || "Comment added successfully", {
            position: "top-center",
          });
        }, 1500);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHide(window.scrollY > 300 ? "block" : "hidden");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!thePost) {
    return (
      <div className="text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full">
        <h1 className="text-2xl font-bold">Post not found...</h1>
        <p className="text-gray-500 mt-4">The post you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mt-24 font-bold title2 grid place-items-center mb-10">
        <div className="flex flex-col w-[80%] justify-center items-center">
          <div className="lg:w-[50%] text-center">
            <div className="grid place-items-center border-b-2 border-gray-400 relative">
              <p className="absolute top-0 right-3 text-3xl cursor-pointer hover:scale-[115%] select-none transition active:scale-[90%]">
                <i
                  className={`fa-${isLiked ? "solid" : "regular"} fa-heart`}
                  style={{ color: "red" }}
                  onClick={likePost}
                />
              </p>
              <p className="w-full text-2xl md:text-3xl text-center mb-2 text-wrap">
                {thePost?.title || "Untitled"}
              </p>
              <p className="italic text-gray-400">by {thePost?.author || "Anonymous"} </p>
            </div>

            <div className="mt-5 mb-10">
              <p id="post" className="grid place-items-center"></p>
            </div>
            <div className="flex justify-center items-center">
              {thePost?.tags?.map((tag) => (
                <p key={tag} className="text-gray-500 mx-1 mb-2">
                  {tag.includes("#") ? tag : `#${tag}`}
                </p>
              )) || <p className="text-gray-500">No tags available</p>}
            </div>
            <div>
              <p>
                Posted by:{" "}
                <span
                  className="text-gray-500 cursor-pointer"
                  onClick={() => navigate(`/profile/${thePost?.userId}`)}
                >
                  {thePost?.username || "Unknown"}
                </span>
              </p>
              <p>
                Posted at:{" "}
                <span className="text-gray-500">
                  {new Date(thePost?.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  }) || "Unknown date"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="makePosts flex flex-col justify-center w-[80%] lg:w-[40%] m-auto my-10">
        <label htmlFor="comment" className="font-semibold underline">
          Comment:
        </label>
        <textarea
          name="comment"
          id="comment"
          className="rounded resize-none outline-none p-5 h-40 mt-3 text-md"
          placeholder="Add comment here..."
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="mt-8 bg-[orangered] w-[30%] rounded cursor-pointer transition hover:scale-[105%] active:scale-[85%] m-auto text-white p-3"
          onClick={commentOnPost}
        >
          Post Comment
        </button>
      </div>

      <div className="comments w-[90%] md:w-[60%] lg:w-[40%] m-auto">
        <h2 className="text-center mb-4 underline underline-offset-4 font-medium text-orange-400">
          Comments
        </h2>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={`${comment?.userId}-${index}`}
              className="mb-2 bg-gray-100 rounded shadow py-7 px-3"
            >
              <p className="text-sm font-medium underline italic text-gray-500">
                {comment?.username || "Anonymous"}
              </p>
              <p className="text-md text-gray-700 mt-1">{comment?.comment || "No comment"}</p>
              <p className="text-xs text-right font-semibold text-gray-400 mt-1">
                {new Date(comment?.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                }) || "Unknown date"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center my-5">No comments available.</p>
        )}
      </div>
      <button
        className={`${hide} font-extrabold text-3xl fixed right-8 bottom-8 bg-[orangered] text-white px-4 py-2 border rounded-3xl active:scale-[90%] hover:bg-[#f07649] transition`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        &uarr;
      </button>
    </>
  );
}

export default SinglePost;
