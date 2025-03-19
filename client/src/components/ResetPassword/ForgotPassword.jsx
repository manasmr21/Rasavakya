import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function ForgotPassword() {
  const [useremail, setUserEmail] = useState();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  //Send the reset password link
  const sendResetPasswordLink = async () => {
    try {
      setDisabled(true);

      if(!useremail){
        toast.error("Please enter your email", {
          position : "top-center"
        })
        setDisabled(false);
        return
      }

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

      setTimeout(() => {
        setDisabled(false);
      }, 2000);

    } catch (error) {
      console.log(error);
    }

   
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#ffe4db]">
      <div className="container m-auto flex justify-center items-center ">
        <div className="form-container border w-[80%] md:w-[60%] lg:w-[30%] rounded-lg overflow-hidden shadow-2xl bg-white  ">
          <div>
            <h1 className="text-center py-4 bg-[orangered] text-white rasavakya2 text-xl font-medium">
              Forgot Password???
            </h1>

            <div className="p-4 flex justify-center items-center">
              <form className="default font-medium w-[85%]">
                <div className="">
                  <div className="text-sm">
                    <label htmlFor="email">Enter email</label>
                  </div>

                  <div className="mt-1">
                    <input
                      type="email"
                      className="w-full border border-gray-400 outline-none focus:border-[orangered] p-1 text-sm rounded-sm"
                      name="email"
                      placeholder="Enter email to get password reset link"
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full  text-center">
              <button
                className=" mb-8 w-[78%] bg-[orangered] text-white mt-5 py-2 rounded-sm text-md font-semibold hover:scale-[98%] duration-100 active:scale-[90%]"
                onClick={sendResetPasswordLink}
                disabled={disabled}
              >
                {!disabled ? (
                  "Send"
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

export default ForgotPassword;
