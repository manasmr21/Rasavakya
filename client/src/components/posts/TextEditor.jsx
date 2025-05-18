import { useState, useRef, useMemo, useEffect, useContext } from "react";
import JoditEditor from "jodit-react";
import "./fonts.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../ContextProvider/Context";

function TextEditor() {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [contentData, setContentData] = useState({
    title: "",
    author: "",
    description: "",
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const history = useNavigate();
  const { loginData, setPoems } = useContext(LoginContext);

  // run only authentication token is available
  useEffect(() => {
    const token = localStorage.getItem("userDataToken");
    if (!token || !loginData || !loginData.verified) {
      history("/login");
    }
  }, []);

  const setValues = (e) => {
    const { name, value } = e.target;

    setContentData(() => {
      return {
        ...contentData,
        [name]: value,
      };
    });
  };

  const addTags = () => {
    const tagElements = document.getElementById("tags");
    const newTagContainer = document.getElementById("newTagsContainer");

    if (tags.length >= 5) {
      toast.error("Can't add more than 5 tags");
      return
    }

    if (tagInput.trim() !== "") {
      const newTag = document.createElement("span");
      const deleteTag = document.createElement("span");

      deleteTag.innerHTML = " &#10008;";
      deleteTag.classList = "cursor-pointer text-black hover:text-[orangered]";

      newTag.textContent = tagElements.value + " ";

      newTag.classList = "p-1 mx-1 bg-gray-400 rounded text-white";

      newTag.appendChild(deleteTag);

      newTagContainer.appendChild(newTag);

      tagElements.value = "";

      setTags([...tags, tagInput]);
      setTagInput("");
      deleteTag.onclick = () => {
        newTagContainer.removeChild(newTag);
        setTags(tags.filter((tag) => tag !== tagElements.value.trim()));
      };
    } else {
      toast.error("Please enter a tag", {position : "top-center"});
    }
  };

  const handleInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const config = useMemo(
    () => ({
      allowResizeX: false,
      allowResizeY: false,
      limitChars: 800,
      height: 300,
      maxWidth: 800,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "ul",
        "ol",
        "fontsize",
        "superscript",
        "subscript",
        "cut",
        "copy",
        "paste",
        "selectall",
        "hr",
        "brush",
        "undo",
        "redo",
        "preview",
        "image",
      ],
      disablePlugins:
        "iframe,image,image-processor,image-properties,indent,inline-popup,link,media,mobile,video,about,ai-assistant,drag-and-drop-element,drag-and-drop,spellcheck",
      controls: {
        font: {
          list: {
            "Ruge Boogie, cursive": "Rudge Boogie",
            "Qwitcher Grypen, cursive": "Qwitcher Grypen",
            "Ruwudu, serif": "Ruwudu",
            "Dancing Script, cursive": "Dancing Script",
            "Playwrite GB S, cursive": "Play write GB S",
            "Pacifico, cursive": "Pacifico",
            "Caveat, cursive": "Caveat",
            "Shadows Into Light, cursive": "Shadows into light",
            "Permanent Marker, cursive": "Permanent Marker",
            "Indie Flower, cursive": "Indie Flower",
            Cursive: "Cursive",
          },
        },
      },
      enter: "br",
      cleanHTML: {
        removeEmptyTags: false,
        replaceNBSP: false,
      },
    }),
    []
  );

  //Make the post
  const uploadPost = async () => {

    try {
      const token = localStorage.getItem("userDataToken");

      if (!contentData.title || !content || !contentData.author) {
      toast.error("Please fill all the fields", {position: "top-center"})
        return;
      }

      const data = await fetch("https://rasavakya-backend.vercel.app/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          title: contentData.title,
          author: contentData.author,
          poem: content,
          tags,
          description: contentData.description,
        }),
      });

      const response = await data.json();

      if (data.ok) {
        toast.success(response.message, { position: "top-center" });
        setContentData({
          title: "",
          author: "",
          description: ""
        });
        setContent("");
        setPoems(response.poems);

      } else {
        toast.error(response.error || "An error occurred.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#ffe4db]">
      <div className="grid place-content-center z-0 mt-16 w-[95%] p-1 ml-2">
        <div className="flex ">
          <div className="title w-full mr-3">
            <label htmlFor="title">Title &#9733; : </label>
            <input
              type="text"
              name="title"
              value={contentData.title}
              placeholder="Enter the title"
              className="p-2 rounded-md border focus:border-[orangered] outline-none w-full"
              onChange={setValues}
              maxLength={60}
            />
          </div>
          <div className="author w-full">
            <label htmlFor="author">Author name &#9733; : </label>
            <input
              type="text"
              value={contentData.author}
              name="author"
              placeholder="Name of the composer"
              className="p-2 rounded-md outline-none border focus:border-[orangered] w-full"
              onChange={setValues}
              maxLength={30}
            />
          </div>
        </div>

        <div className="descrption w-full mt-3">
          <label htmlFor="description"> Brief Description &#9733; : </label>
          <textarea
            name="description"
            value={contentData.description}
            className="w-full rounded resize-none outline-none border focus:border-[orangered] p-2 h-28"
            placeholder="What is it about??? (max characters 350)"
            onChange={setValues}
            maxLength={350}
          />
        </div>

        <div className="tags mt-2 w-full	text-wrap" id="tagContainer">
          <label htmlFor="tags">Tags :</label> <br />
          <input
            type="text"
            name="tags"
            placeholder="Enter a tag(#tag)"
            className="p-2 rounded-md outline-none border focus:border-[orangered]"
            id="tags"
            onChange={handleInputChange}
            maxLength={15}
          />
          <button
            className=" bg-[orangered] p-2 rounded text-white mx-4 active:scale-[90%]"
            onClick={addTags}
          >
            &#10010;
          </button>
          <div className="mt-2" id="newTagsContainer"></div>
        </div>
        <div className="mt-2 mb-4 w-full">
          <label htmlFor="content">Body &#9733; : </label>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onChange={(newContent) => {
              setContent(newContent);
            }}
          />
        </div>

        <div className="text-center">
          <button
            className="text-center bg-[orangered] text-white font-medium text-xl p-2 w-[40%] rounded transition active:scale-[90%] mb-3"
            onClick={uploadPost}
          >
            Post
          </button>
        </div>
      </div>
      <ToastContainer limit={1} autoClose={500} closeOnClick  />
    </div>
  );
}

export default TextEditor;
