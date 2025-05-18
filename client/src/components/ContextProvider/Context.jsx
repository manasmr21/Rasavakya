import { createContext, useEffect, useState } from "react";

export const LoginContext = createContext("");

function Context({ children }) {
  const [loginData, setLoginData] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [poems, setPoems] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const token = localStorage.getItem("userDataToken");

  //fetch all liked and commented posts
  const likedAndCommented = async (token) => {
    try {
      const data = await fetch("https://rasavakya-backend.vercel.app/liked-commented", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const response = await data.json();

      if (data.ok) {
        setLikedPosts(response.likedPosts.map((post) => post._id));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetch all posts
  const fetchPost = async () => {
    try {
      const data = await fetch("https://rasavakya-backend.vercel.app/fetch-all-posts", {
        method: "GET",
      });

      const response = await data.json();

      if (!data.ok) {
        console.log(response.error);
      } else {
        setPoems(response.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  
  const validateUser = async (token) => {
    try {
      const data = await fetch("https://rasavakya-backend.vercel.app/validateuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const res = await data.json();

      if (!data.ok || !res) {
        console.log("Error occurred.");
      } else if (data.ok) {
        setIsLoggedin(true);
        setLoginData(res.userData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      validateUser(token);
      likedAndCommented(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <LoginContext.Provider
      value={{
        loginData,
        setLoginData,
        isLoggedin,
        setIsLoggedin,
        poems,
        setPoems,
        likedPosts,
        setLikedPosts,
        token,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default Context;
