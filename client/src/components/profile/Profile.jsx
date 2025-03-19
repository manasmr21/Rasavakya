import "../posts/fonts.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../ContextProvider/Context";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [activeSection, setActiveSection] = useState("Posts");
  const userID = useParams();
  const userId = userID.userId;
  const {
    poems,
    setPoems,
    isLoggedin,
    loginData,
    setIsLoggedin,
    setLoginData,
    token,
  } = useContext(LoginContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [edit, setEdit] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const [logOutBtn, setLogOutBtn] = useState("hidden");
  const [confirmDisplay, setConfirmDisplay] = useState("hidden");

  const userPoems = poems.filter((poem) => {
    return poem.userId == userID.userId;
  });

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  //Log out the User
  const handleLogOutUser = async () => {
    let token = localStorage.getItem("userDataToken");
    try {
      const data = await fetch("http://localhost:3000/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "application/json",
        },
      });

      const res = await data.json();

      if (data.ok) {
        localStorage.removeItem("userDataToken");
        toast.success("User logged out", { position: "top-center" });
        removeCookie("myCookie");
        setIsLoggedin(false);
        setLoginData(null);
        navigate("/");
      } else {
        console.log(res.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //fetch user
  const fetchUser = async () => {
    try {
      const data = await fetch(
        `http://localhost:3000/fetch-user?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await data.json();
      if (data.ok) {
        setUserData(response.userData);
      } else {
        toast.error("User not found", {
          position: "top-center",
        });
        console.log(response.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Delete a post
  const deletePost = async (postId) => {
    try {
      const data = await fetch("http://localhost:3000/delete-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ postId }),
      });

      const response = await data.json();

      if (data.ok) {
        toast.success(response.message, {
          position: "top-center",
        });

        setPoems((prevPoems) =>
          prevPoems.filter((poem) => poem._id !== postId)
        );
      } else {
        toast.error(response.error || "Failed to delete the post.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
      toast.error("Something went wrong while deleting the post.", {
        position: "top-center",
      });
    }
  };

  //Handle Reset Password
  const resetPassword = async () => {
    try {
      const useremail = userData?.useremail;
      const data = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ useremail }),
      });

      const response = await data.json();

      if (data.ok) {
        toast.success(response.message, {
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(response.error, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    window.scrollTo(0, 0);
    setLogOutBtn(loginData?._id == userId ? "block" : "hidden");
  }, []);

  const likedPosts = poems.filter((poem) => poem.likes.includes(userID.userId));

  const commentedPosts = poems.filter((poem) =>
    poem.comments.some((comment) => comment.userId === userID.userId)
  );

  if (!userData) {
    return (
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full">
        <h1 className="text-center font-bold text-[orangered]">
          No User Found
        </h1>
        <p className="text-center text-lg">
          The user you are looking for either does not exist or may be deleted
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mt-24 mb-10">
        <div>
          <h1 className="text-center text-[orangered] underline poppins ubuntu-bold text-[30px] md:text-[45px]">
            {userData?.username || "Fetching..."}
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="bio-data font-medium lg:w-[27%] rounded bg-white ">
            <div className=" p-4 bg-[#ffe4db] rounded border-4 border-white ">
              <p className="mt-1">
                <span>UserID : </span>{" "}
                <span> {userData?._id || "Fetching..."} </span>{" "}
              </p>
              <p className="mt-3">
                <span>Email : </span>{" "}
                <span>{userData?.useremail || "Fetching..."}</span>{" "}
              </p>
              <p className="mt-3">
                <span>Joined on : </span>{" "}
                <span>
                  {" "}
                  {new Date(userData?.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}{" "}
                </span>{" "}
              </p>
              <p
                className="mt-3 hover:underline cursor-pointer hover:text-[orangered]"
                onClick={resetPassword}
                style={{
                  display: `${isLoggedin ? "block" : "none"}`,
                }}
              >
                Reset Password
              </p>
              <button
                className=" bg-[orangered] text-white rounded p-2 mt-3 hover:bg-white hover:text-black border transition border-[orangered]"
                onClick={() => setEdit(!edit)}
                style={{
                  display: `${
                    isLoggedin && userPoems.length > 0 ? "block" : "none"
                  }`,
                }}
              >
                Delete a post
              </button>
            </div>
          </div>
          <div className="all-posts w-[95%] lg:w-[70%] mt-8 rounded bg-white  overflow-hidden pt-4 px-2 md:p-3">
            <div className="w-full justify-between flex">
              {["Posts", "Liked", "Comments"].map((section) => {
                return (
                  <p
                    key={section}
                    className={` cursor-pointer text-wrap font-medium border border-[orangered] p-2 md:p-4 w-[33%] text-center hover:bg-white hover:text-[orangered] rounded ${
                      activeSection === section
                        ? "bg-[#ffcab6] text-[orangered] "
                        : "bg-[orangered] text-white"
                    } transition active:scale-[96%]`}
                    onClick={() => handleSectionClick(section)}
                  >
                    {section}
                  </p>
                );
              })}
            </div>

            <div className=" flex flex-wrap justify-center items-center">
              {activeSection == "Posts" ? (
                userPoems && userPoems.length > 0 ? (
                  userPoems.map((poem) => (
                    <div
                      key={poem._id}
                      className="w-[85%] cursor-pointer md:w-[500px] lg:w-[400px] text-center text-wrap mx-6 mt-10 grid place-items-center title2 bg-white shadow-lg hover:scale-[99%] transition border-4 border-gray-600 relative"
                      id={poem._id}
                    >
                      <div>
                        <div className="border-4 border-gray-500 ">
                          <div className="border-4 border-gray-400">
                            <div className=" border-4 border-gray-300">
                              <div className="border-4 border-gray-200">
                                <div
                                  className="p-5 border border-gray-100"
                                  onClick={() => {
                                    navigate(`/posts/${poem._id}`);
                                  }}
                                >
                                  <h1 className="text-center font-semibold w-[90%] mb-4 text-md border-b-2 border-gray-300  pb-3">
                                    {poem.title}
                                  </h1>
                                  <p className="description text-md p-1">
                                    {poem.description}
                                  </p>
                                  <p className="author w-full text-right italic font-medium text-gray-400">
                                    {" "}
                                    -{poem.author}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <i
                            className={`fa-solid fa-trash text-[#ff0000] absolute border rounded-3xl border-[orangered] bg-white z-10 p-4 top-[-5%] right-[-5%] cursor-pointer hover:scale-[115%] transition`}
                            style={{
                              display: `${
                                isLoggedin && edit ? "block" : "none"
                              }`,
                            }}
                            onClick={() => {
                              deletePost(poem._id);
                            }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-[orangered]">Nothing to show</div>
                )
              ) : activeSection == "Liked" ? (
                likedPosts && likedPosts.length > 0 ? (
                  likedPosts.map((poem) => (
                    <div
                      key={poem._id}
                      className="w-[85%] cursor-pointer md:w-[500px] lg:w-[400px] text-center text-wrap mx-6 mt-10 grid place-items-center title2 bg-white shadow-lg hover:scale-[95%] transition border-4 border-gray-600"
                      id={poem._id}
                    >
                      <div className="border-4 border-gray-500 ">
                        <div className="border-4 border-gray-400">
                          <div className=" border-4 border-gray-300">
                            <div className="border-4 border-gray-200">
                              <div
                                className="p-5 border border-gray-100"
                                onClick={() => {
                                  navigate(`/posts/${poem._id}`);
                                }}
                              >
                                <h1 className="text-center font-semibold w-[90%] mb-4 text-md border-b-2 border-gray-300  pb-3">
                                  {poem.title}
                                </h1>
                                <p className="description text-md p-1">
                                  {poem.description}
                                </p>
                                <p className="author w-full text-right italic font-medium text-gray-400">
                                  {" "}
                                  -{poem.author}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p></p>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-[orangered]">Nothing to show</div>
                )
              ) : activeSection == "Comments" ? (
                commentedPosts && commentedPosts.length > 0 ? (
                  commentedPosts.map((poem) => (
                    <div
                      key={poem._id}
                      className="w-[85%] cursor-pointer md:w-[500px] lg:w-[400px] text-center text-wrap mx-6 mt-10 grid place-items-center title2 bg-white shadow-lg hover:scale-[95%] transition border-4 border-gray-600"
                      id={poem._id}
                      onClick={() => {
                        navigate(`/posts/${poem._id}`);
                      }}
                    >
                      <div className="border-4 border-gray-500 ">
                        <div className="border-4 border-gray-400">
                          <div className=" border-4 border-gray-300">
                            <div className="border-4 border-gray-200">
                              <div className="p-5 border border-gray-100">
                                <h1 className="text-center font-semibold w-[90%] mb-4 text-md border-b-2 border-gray-300  pb-3">
                                  {poem.title}
                                </h1>
                                <p className="description text-md p-1">
                                  {poem.description}
                                </p>
                                <p className="author w-full text-right italic font-medium text-gray-400">
                                  {" "}
                                  -{poem.author}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-[orangered]">Nothing to show</div>
                )
              ) : (
                "Some Error Occured"
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        className={`p-3 text-white bg-[#EF0107] rounded  md:sticky md:bottom-8 right-8 border border-[orangered] hover:bg-white hover:text-[orangered] font-medium transition ${logOutBtn} float-end `}
        onClick={() => setConfirmDisplay("block")}
      >
        Log out
      </button>

      <button
        className={`p-3 text-white bg-[orangered] rounded md:sticky md:bottom-8 left-8 border border-[orangered] hover:bg-white hover:text-[orangered] font-medium transition ${logOutBtn} `}
        onClick={() => {
          navigate("/text-editor");
        }}
      >
        Create
      </button>

      <div
        className={`w-full h-full fixed top-0 grid place-items-center ${confirmDisplay}  bg-[#050505e0] z-10`}
      >
        <div
          className={`confirm-logout w-[90%] lg:w-[40%] bg-white  items-center m-auto rounded-lg py-10 left-0 top-0 `}
          id="logout"
        >
          <h2 className="text-center font-semibold p-3 md:font-bold text-[orangered]">
            Are you sure want to log out??
          </h2>
          <div className="flex justify-between mt-10 w-[70%] md:w-[30%] m-auto">
            <button
              className="border-[orangered] border rounded py-2 px-4 text-white bg-[orangered] hover:bg-white transition hover:text-[orangered]"
              onClick={handleLogOutUser}
            >
              Confirm
            </button>
            <button
              className="border-[orangered] border rounded py-2 px-4 text-[orangered]  hover:bg-[orangered] transition hover:text-[white]"
              onClick={() => setConfirmDisplay("hidden")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        limit={1}
        closeOnClick
        newestOnTop
        autoClose={100}
        pauseOnHover={false}
        hideProgressBar={true}
      />
    </div>
  );
}

export default Profile;
