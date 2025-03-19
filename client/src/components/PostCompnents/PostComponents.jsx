import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../ContextProvider/Context";
import { useNavigate } from "react-router-dom";
import "./postcomponent.css";

function PostComponents() {
  const { poems } = useContext(LoginContext);
  const [poemArray, setPoemArray] = useState(poems);
  const navigate = useNavigate();
  const [hide, setHide] = useState("hidden");
  const [searchValue, setSearchValue] = useState("");
  const [cancelSearch, setCancelSearch] = useState("hidden");



  const searchPoems = async () => {
    try {
      if (!searchValue) {
        alert("Enter something to search");
        throw new Error("No result found");
      }

      const searchResult = poems?.filter((currentElement) => {
        return (
          currentElement?.title?.toLowerCase() === searchValue.toLowerCase() ||
          currentElement?.author?.toLowerCase() === searchValue.toLowerCase() ||
          currentElement?.username?.toLowerCase() === searchValue.toLowerCase() ||
          (Array.isArray(currentElement?.tags) 
            ? currentElement.tags.some(tag => tag.toLowerCase() === searchValue.toLowerCase()) 
            : currentElement?.tags?.toLowerCase() === searchValue.toLowerCase())
        );
      });
      

      if (searchResult.length > 0) {
        setPoemArray(searchResult);
      } else {
        const data = await fetch("http://localhost:3000/search-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: searchValue }),
        });

        const response = await data.json();

        if (data.ok) {
          setPoemArray(response.result);
        } else {
          setPoemArray(response.result);
          throw new Error(response.error);
        }
      }
      setCancelSearch("block");
    } catch (error) {
      console.log(error);
    }
  };

  const clearSearch = ()=>{
    setPoemArray(poems);
    setCancelSearch("hidden");
    setSearchValue("");
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setHide(window.scrollY > 350 ? "block" : "hidden");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mt-28 post-container">
      <div className="w-full">
        <div className="search mb-4 flex justify-center items-center">
          <label htmlFor="search"></label>
          <input
            type="text"
            name="search"
            className="rounded-lg outline-none mx-5 w-[65%] lg:w-[40%] p-3"
            value={searchValue}
            placeholder="Search for posts..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="flex">
            <button
              className="p-3 font-medium text-sm rounded text-white bg-[orangered] hover:scale-[105%] transition active:scale-[90%]"
              onClick={searchPoems}
            >
              Search
            </button>
            <button className={`mx-2 p-3 ${cancelSearch} font-medium text-sm rounded text-white bg-[orangered] hover:scale-[105%] transition active:scale-[90%]`}
              onClick={clearSearch}
            >Cancel</button>
          </div>
        </div>
      </div>

      <div className="post-components w-full grid place-items-center my-4">
        {Array.isArray(poemArray) && poemArray.length > 0 ? (
          poemArray.map((poem, index) => (
            <div
              key={poem?._id || index}
              className="p-5 text-center my-5 w-[90%] md:w-[70%] lg:w-[40%] bg-gray-100 rounded-lg shadow-md cursor-pointer"
              onClick={() => navigate(`/posts/${poem?._id}`)}
            >
              <h1 className="mb-5 text-[orangered] underline font-bold text-wrap">
                {poem?.title || "Untitled"}
              </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: poem?.poem || "No content available.",
                }}
                className="font-medium"
              ></p>
              <p className="my-5 text-right italic font-medium text-gray-500 text-md">
                by: {poem?.author || "Unknown"}
              </p>
              <p className="my-5 text-left italic font-medium text-gray-400 text-md">
                Posted by: {poem?.username || "Anonymous"}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 p-5">
            <div className="text-center text-gray-400 mb-5">
              <i className="fas fa-folder-open text-6xl"></i>
            </div>
            <p className="text-xl font-semibold text-gray-500">
              No posts to show!
            </p>
            <p className="text-md text-gray-400 mt-2">
              It seems a bit quiet here. Start by creating your first post or
              exploring others’ creations.
            </p>
            <button
              className="mt-5 bg-[orangered] text-white px-6 py-2 rounded-lg text-md font-medium hover:bg-[#f07649] transition active:scale-[90%]"
              onClick={() => navigate("/text-editor")}
            >
              Create Post
            </button>
          </div>
        )}
      </div>

      <button
        className={`hover:scale-[110%] transition active:scale-[95%] sticky right-0 bottom-5 lg:left-[95%] left-[90%] text-white px-5 py-3 rounded-full bg-[orangered] text-3xl ${hide}`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        &uarr;
      </button>
    </div>
  );
}

export default PostComponents;
