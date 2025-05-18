import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function ResetPassword() {
  const [passwords, setPasswords] = useState("");
  const [hidePswd, setHidePswd] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const setValue = (e) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const toggleHidePswd = (e) => {
    e.preventDefault();
    setHidePswd(!hidePswd);
  };

  //Reset password function
  const ResetPassword = async () => {
    try {
      const { password, cpassword } = passwords;

      setDisabled(true);

      if (password != cpassword) {
        toast.error("Passwords does not match", {
          position: "top-center",
        });
      } else if (!password || !cpassword) {
        toast.error("Invalid password", {
          position: "top-center",
        });
      } else {
        const data = await fetch(
          `https://rasavakya-backend.vercel.app/reset-password/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              passwords,
            }),
          }
        );

        const response = await data.json();
        if (data.ok) {
          toast.success(response.message, {
            position: "top-center",
          });
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          toast.error(response.error, {
            position: "top-center",
          });
        }
      }

      setTimeout(() => {
        setDisabled(false);
      }, 2000);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#ffe4db]">
      <div className="container m-auto flex justify-center items-center ">
        <div className="form-container border w-[80%] md:w-[60%] lg:w-[30%] rounded-lg overflow-hidden shadow-2xl bg-white  ">
          <div>
            <h1 className="text-center py-4 bg-[orangered] text-white rasavakya2 text-xl font-medium">
              Reset Your Password
            </h1>

            <div className="p-4 flex justify-center items-center">
              <form className="default font-medium w-[85%]">
                <div className="">
                  <div className="text-sm">
                    <label htmlFor="password">Enter New Password</label>
                  </div>

                  <div className="mt-1 flex justify-between">
                    <input
                      type={hidePswd ? "password" : "text"}
                      className="w-[80%] border border-gray-400 outline-none focus:border-[orangered] p-1 text-sm rounded-sm"
                      name="password"
                      placeholder="New Password"
                      onChange={setValue}
                    />
                    <button
                      className="text-center py-1 px-3 bg-slate-300 border rounded-sm hover:bg-orange-600 hover:text-white"
                      onClick={toggleHidePswd}
                    >
                      {hidePswd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 flex justify-center items-center">
              <form className="default font-medium w-[85%]">
                <div className="">
                  <div className="text-sm">
                    <label htmlFor="cpassword">Confirm New Password</label>
                  </div>

                  <div className="mt-1 flex justify-between">
                    <input
                      type={hidePswd ? "password" : "text"}
                      className="w-[80%] border border-gray-400 outline-none focus:border-[orangered] p-1 text-sm rounded-sm"
                      name="cpassword"
                      placeholder="Confirm Password"
                      onChange={setValue}
                    />
                    <button
                      className="text-center py-1 px-3 bg-slate-300 border rounded-sm hover:bg-orange-600 hover:text-white"
                      onClick={toggleHidePswd}
                    >
                      {hidePswd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="w-full  text-center">
              <button
                className=" mb-8 w-[78%] bg-[orangered] text-white mt-5 py-2 rounded-sm text-md font-semibold hover:scale-[98%] duration-100 active:scale-[90%]"
                onClick={ResetPassword}
                disabled={disabled}
              >
                {!disabled ? (
                  "Reset Password"
                ) : (
                  <ThreeCircles
                    visible={true}
                    height="30"
                    width="400"
                    color="white"
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
