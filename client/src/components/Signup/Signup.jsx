import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import cryptoRandomString from "crypto-random-string";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function Signup() {
  const navigate = useNavigate();
  //State Variables
  const [hidePswd, setHidePswd] = useState(true);
  const [hideCPswd, setHideCPswd] = useState(true);
  const [disabled, setDisabled] = useState(false);

  //User data object
  const [inputValue, setInputValue] = useState({
    username: "",
    useremail: "",
    password: "",
    cpassword: "",
  });

  const encryptedUserData = CryptoJS.AES.encrypt(
    JSON.stringify(inputValue),
    "@encryptTheUserData@5969#$%"
  ).toString();

  // regex to check for
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleUserDataSending = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(inputValue.useremail) || inputValue.useremail == "") {
      toast.error("Enter valid Email", {
        position: "top-center",
      });
    } else if (inputValue.username < 5 || inputValue.username == "") {
      toast.error("Please Enter your name", {
        position: "top-center",
      });
    } else if (inputValue.password == "" || inputValue.password.length < 5) {
      toast.error("Enter valid password", {
        position: "top-center",
      });
    } else if (inputValue.cpassword == "" || inputValue.cpassword.length < 5) {
      toast.error("Confirm your password with valid value", {
        position: "top-center",
      });
    } else if (inputValue.cpassword !== inputValue.password) {
      toast.error("Password doesn't match", {
        position: "top-center",
      });
    } else {
      try {
        setDisabled(true);
        const data = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            encryptedUserData,
          }),
        });

        const res = await data.json();

        if (data.ok) {
          toast.success(res.message, {
            position: "top-center",
          });

          const path = cryptoRandomString({ length: 10, type: "base64" });

          navigate(`/verify-email/${path}`, { state: inputValue.useremail });

          setInputValue({
            username: "",
            useremail: "",
            password: "",
            cpassword: "",
          });
        } else {
          toast.error(res.error, {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log(error.message);
      }

      setTimeout(() => {
        setDisabled(false);
      }, 3000);
    }
  };

  //To hide and show password
  const toggleHidePswd = (e) => {
    e.preventDefault();
    setHidePswd(!hidePswd);
  };

  const toggleHideCPswd = (e) => {
    e.preventDefault();
    setHideCPswd(!hideCPswd);
  };

  //Setting the corresponding values of the input fields
  const setValue = (e) => {
    const { name, value } = e.target;

    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[#ffe4db]">
      <div className=" bg-white w-[90%] sm:w-[75%] lg:w-[30%] rounded-lg px-6 py-6 shadow-md mt-16">
        <h1 className="text-center font-bold text-3xl">Sign Up</h1>
        <form className="mt-3 ">
          <label htmlFor="username">Enter your name:</label>
          <div className=" border p-1 flex justify-between mb-2">
            <input
              type="text"
              className="outline-none w-full "
              placeholder="Enter your name"
              onChange={setValue}
              value={inputValue.username}
              name="username"
            />
          </div>

          <label htmlFor="useremail">Enter email:</label>
          <div className=" border p-1 flex justify-between  mb-2">
            <input
              name="useremail"
              type="email"
              className="outline-none w-full"
              placeholder="Enter your email"
              onChange={setValue}
              value={inputValue.useremail}
            />
          </div>

          <label htmlFor="password">Enter password:</label>
          <div className=" border p-1 flex justify-between mb-2">
            <input
              type={hidePswd ? "password" : "text"}
              className="outline-none w-[83%]"
              placeholder="Enter password"
              onChange={setValue}
              value={inputValue.password}
              name="password"
            />

            <button
              className="text-center py-1 px-3 bg-slate-300 border rounded-sm hover:bg-orange-600 hover:text-white text-sm"
              onClick={toggleHidePswd}
            >
              {hidePswd ? "Show" : "Hide"}
            </button>
          </div>

          <label htmlFor="cpassword">Confirm password:</label>
          <div className=" border p-1 flex justify-between">
            <input
              type={hideCPswd ? "password" : "text"}
              className="outline-none w-[83%]"
              placeholder="Confirm password"
              onChange={setValue}
              value={inputValue.cpassword}
              name="cpassword"
            />

            <button
              className="text-center py-1 px-3 bg-slate-300 border rounded-sm hover:bg-orange-600 hover:text-white text-sm"
              onClick={toggleHideCPswd}
            >
              {hideCPswd ? "Show" : "Hide"}
            </button>
          </div>
        </form>

        <button
          type="submit"
          className="w-full bg-[orangered] text-white mt-6 py-2 rounded-sm text-xl font-semibold hover:scale-[98%] duration-100 active:scale-[90%] flex justify-center items-center"
          onClick={handleUserDataSending}
          disabled={disabled}
        >
          {!disabled ? (
            "Sign Up"
          ) : (
            <ThreeCircles
              visible={true}
              height="30"
              width="30"
              color="white"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          )}
        </button>
        <p className="mt-3">
          Already have an account?
          <NavLink
            to="/login"
            className="hover:underline hover:text-[orangered]"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
