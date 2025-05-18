import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import CryptoJS from "crypto-js";
import { LoginContext } from "../ContextProvider/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function Login() {
  const [hidePswd, setHidePswd] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const [inputValue, setInputValue] = useState({
    useremail: "",
    password: "",
  });

  const { setIsLoggedin } = useContext(LoginContext);

  // set cookie
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);

  const history = useNavigate();

  //regex to verify the email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //encrypt the headers while sending it to the backend
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(inputValue),
    "@encryptTheUserData@5969#$%"
  ).toString();

  //handle the user log in button
  const handleUserLogin = async (e) => {
    e.preventDefault();

    const { useremail, password } = inputValue;

    if (!emailRegex.test(useremail) || useremail == "") {
      toast.error("Enter valid Email", {
        position: "top-center",
      });
    } else if (password == "" || password.length < 5) {
      toast.error("Enter Valid Password", {
        position: "top-center",
      });
    } else {
      try {
        setDisabled(true);
        const data = await fetch("https://rasavakya-backend.vercel.app/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: cipherText,
          }),
        });

        const res = await data.json();

        //set cookies and save the token in local storage
        if (data.ok) {
          localStorage.setItem("userDataToken", res.token);
          toast.success(res.message, {
            position : "top-center"
          })
          setTimeout(()=>{
            history("/");
          },1500)
          setInputValue({
            useremail: "",
            password: "",
          });

          setIsLoggedin(true);
          window.location.reload();
          setCookie("myCookie", res.token, { path: "/" });
        } else {
          toast.error(res.error, {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log(error.message);
      }

     setTimeout(()=>{
      setDisabled(false)
     },2000)
    }
  };

  const toggleHidePswd = (e) => {
    e.preventDefault();
    setHidePswd(!hidePswd);
  };

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
    <div className="w-full h-[100vh] grid place-items-center bg-[#ffe4db]">
      <div className=" bg-white w-[90%] sm:w-[75%] lg:w-[30%] rounded-lg px-8 py-5 sm:py-10 shadow-md mt-11">
        <h1 className="text-center font-bold text-3xl sm:text-4xl">Log in</h1>
        <form className=" mt-6 sm:mt-10">
          <label htmlFor="useremail">Enter Your email:</label>
          <div className=" border p-2 flex justify-between mt-2 mb-8">
            <input
              type="email"
              className="outline-none w-full"
              placeholder="Enter your email"
              onChange={setValue}
              name="useremail"
              value={inputValue.useremail}
            />
          </div>

          <label htmlFor="password">Enter Your password:</label>
          <div className=" border p-1 flex justify-between mt-2">
            <input
              type={hidePswd ? "password" : "text"}
              className="outline-none w-[75%]"
              placeholder="Enter your password"
              onChange={setValue}
              name="password"
              value={inputValue.password}
            />

            <button
              className="text-center py-1 px-3 bg-slate-300 border rounded-sm hover:bg-orange-600 hover:text-white"
              onClick={toggleHidePswd}
            >
              {hidePswd ? "Hide" : "Show"}
            </button>
          </div>
          <NavLink
            className=" text-right hover:text-[#fc9974] hover:underline mt-2 cursor-pointer block"
            to="/forgot-password"
          >
            Forgot password?
          </NavLink>
        </form>

        <button
          className="w-full flex justify-center items-center bg-[orangered] text-white mt-8 py-3 rounded-sm text-xl font-semibold hover:scale-[98%] duration-100 active:scale-[90%]"
          onClick={handleUserLogin}
          disabled={disabled}
        >
          {!disabled ? (
            "Log in"
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
          Don't have an account?{" "}
          <NavLink
            to="/signup"
            className="hover:underline hover:text-[orangered]"
          >
            SignUp
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
