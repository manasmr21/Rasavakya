import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function Otp() {
  const [otp, setOtp] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [disabled, setDisabled] = useState(false);

  const useremail = location.state;

  const codedUserData = CryptoJS.AES.encrypt(
    JSON.stringify(useremail),
    "@encryptTheUserData@5969#$%"
  ).toString();

  useEffect(() => {
    if (!useremail) {
      navigate("/");
    }
  }, []);

  const verifyTheUser = async (e) => {
    e.preventDefault();

    try {
      setDisabled(true);

      if (!otp) {
        toast.error("Please Enter OTP to verify", {
          position: "top-center",
        });
        setDisabled(false);
        return;
      }

      const data = await fetch("https://rasavakya.vercel.app/verify-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useremail,
          verificationCode: otp,
        }),
      });

      const response = await data.json();

      if (data.ok) {
        toast.success(response.message, {
          position: "top-center",
        });
        setTimeout(()=>{
          navigate("/");
        },1500)
      } else {
        toast.error(response.error, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  const resentOTP = async () => {
    try {
      const data = await fetch("https://rasavakya.vercel.app/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codedUserData }),
      });

      const res = await data.json();

      if(data.ok){
        toast.success(res.message, {
          position : "top-center"
        })
      }else{
        toast.error(res.error, {
          position : "top-center"
        })
      }

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
              Verify your email
            </h1>

            <div className="p-4 flex justify-center items-center">
              <form className="default font-medium w-[85%]">
                <div className="">
                  <div className="text-sm">
                    <label htmlFor="otp">OTP</label>
                  </div>

                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full border border-gray-400 outline-none focus:border-[orangered] p-1 text-sm rounded-sm"
                      name="otp"
                      placeholder="Enter OTP"
                      maxLength="6"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full  text-center">
              <button
                className=" mb-8 w-[78%] bg-[orangered] text-white mt-5 py-2 rounded-sm text-md font-semibold hover:scale-[98%] duration-100 active:scale-[90%] m-auto"
                onClick={verifyTheUser}
                disabled={disabled}
              >
                {!disabled ? (
                  "Verify"
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
              <p
                className="text-center text-[orangered] cursor-pointer mb-5 hover:underline"
                onClick={resentOTP}
              >
                Resend OTP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
