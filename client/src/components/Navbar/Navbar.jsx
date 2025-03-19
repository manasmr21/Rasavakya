import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../ContextProvider/Context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Navbar() {
  //state variables
  const [bgTrans, setBgTrans] = useState(true);
  const [closeMenu, setCloseMenu] = useState(false);
  const navigate = useNavigate();
  const { isLoggedin, loginData } = useContext(LoginContext);

  //Log out the user
  const handleLogOutUser = () => {
    navigate(`/profile/${loginData._id}`);
  };

  //navbar color changes when window is scrolled down.
  window.addEventListener("scroll", () => {
    scrollY > 20 ? setBgTrans(false) : setBgTrans(true);
  });

  //function to handle opening and closing the menu
  const toggleMenu = (e) => {
    e.preventDefault();

    setCloseMenu(!closeMenu);
  };

  //only to close the menu
  const closeNavbar = () => {
    setCloseMenu(false);
  };

  //close the menu when any navigation tab is clicked
  useEffect(() => {
    const navMenues = document.getElementById("navmenues").children;

    const closeNavbar = () => {
      setCloseMenu(false);
    };

    Array.from(navMenues).forEach((child) => {
      child.addEventListener("click", closeNavbar);
    });

    return () => {
      Array.from(navMenues).forEach((child) => {
        child.removeEventListener("click", closeNavbar);
      });
    };
  }, []);

  //close the menu when clicked anywhere other than the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeMenu && !event.target.closest(".navbar")) {
        closeNavbar();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <>
      <nav
        className={`p-3 ${
          bgTrans ? "bg-transparent" : "bg-[orangered]"
        } fixed w-full top-0 transition ease-linear max-lg:p-0 z-10`}
      >
        <div className="navbar w-[95%] m-auto flex justify-between align-middle max-lg:relative max-lg:w-full">
          <div className="logo w-[50%] max-lg:m-4">
            <h1
              className={`${
                bgTrans ? "text-[orangered]" : "text-[white]"
              } text-[25px] sm:text-[35px] cursor-pointer`}
            >
              <Link to="/">RasaVakya</Link>
            </h1>
          </div>

          <div className="burgerMenu w-[25px] m-5 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              onClick={toggleMenu}
            >
              <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
            </svg>
          </div>

          <div
            className={`navigations w-[25%] max-xl:w-[30%] flex justify-center items-center max-lg:bg-[#ee855e] max-lg:bg-opacity-[0.5] max-lg:backdrop-blur max-lg:text-white max-lg:text-[20px] max-lg:flex-col max-lg:h-[100vh] max-lg:justify-between max-lg:w-[70%] max-lg:absolute ${
              !closeMenu ? "max-lg:right-[-100%]" : "max-lg:right-0"
            } max-lg:transition-all max-lg:duration-500`}
          >
            <div
              className="closeMenu w-full grid place-items-end p-4 lg:hidden"
              id="closeMenu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="w-[25px]"
                onClick={toggleMenu}
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>

            <ul
              className={`flex justify-between items-center w-full font-medium max-lg:flex-col max-lg:h-[50%] ${
                bgTrans ? "text-black" : "text-white"
              } max-lg:text-white`}
              id="navmenues"
            >
              <Link to="/">
                <li
                  className={`${
                    bgTrans ? "hover:text-[orangered]" : "hover:underline"
                  } cursor-pointer `}
                >
                  Home
                </li>
              </Link>
              <Link to="/posts">
                <li
                  className={`${
                    bgTrans ? "hover:text-[orangered]" : "hover:underline"
                  } cursor-pointer `}
                >
                  Posts
                </li>
              </Link>
              <Link to="/about">
                <li
                  className={`${
                    bgTrans ? "hover:text-[orangered]" : "hover:underline"
                  } cursor-pointer `}
                >
                  About
                </li>
              </Link>

              {!isLoggedin ? (
                <Link
                  to="/login"
                  className={`${
                    bgTrans
                      ? "text-white bg-[orangered] hover:bg-transparent hover:text-[orangered]"
                      : "text-[orangered] bg-white hover:scale-[95%]"
                  } p-2 md:px-4 md:py-2 rounded-md cursor-pointer transition outline-none  border border-[orangered]`}
                >
                  Log in
                </Link>
              ) : (
                <button
                  onClick={handleLogOutUser}
                  className={`${
                    bgTrans
                      ? "text-white bg-[orangered] hover:bg-transparent hover:text-[orangered]"
                      : "text-[orangered] bg-white hover:scale-[95%]"
                  } p-2 md:px-4 md:py-2 rounded-md cursor-pointer transition outline-none  border border-[orangered]`}
                >
                  Profile
                </button>
              )}
            </ul>

            <div className="contacts w-full flex lg:hidden py-3 justify-evenly">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-[25px]"
              >
                <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="w-[15px]"
              >
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-[25px]"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-[25px]"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer limit={1} autoClose={1004} />
    </>
  );
}

export default Navbar;
