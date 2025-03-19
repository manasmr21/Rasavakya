import { useContext, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ThreeCircles} from "react-loader-spinner";
import { LoginContext } from "../ContextProvider/Context";

function ContactForm() {

    const form = useRef();
    const [disable, setDisable] = useState(false);
    const [values, setValues] = useState({
        user_name : "",
        user_email : "",
        description : ""
    })
    const {loginData,isLoggedin} = useContext(LoginContext)
useEffect(()=>{
  if(isLoggedin){
    setValues({
      user_name : loginData.username,
      user_email : loginData.useremail
    })
  }
},[])
     


    const sendEmail = (e)=>{
        e.preventDefault();
        setDisable(true);
        emailjs.sendForm("service_lw3j4z8", "template_jejqqro", form.current, {
            publicKey : "QldI8yl-6nDMy9n5x"
        } ).then(

            ()=>{
                toast.success("Message sent successfully.", {position : "top-center"})
                setDisable(false);
                if(!isLoggedin){
                  setValues({
                    user_name : "",
                    user_email : "",
                    description : ""
                })
                }else{
                  setValues({
                    description : ""
                  })
                }
            },

            (error)=>{
                toast.error("Message not sent. Some error occured",{ position : "top-center"})
                console.log(error, error.messsage);
            }
        )
    }

    const setInputValue = (e) => {
        const { name, value } = e.target;
    if(!isLoggedin){
      setValues(() => {
        return {
          ...values,
          [name]: value,
        };
      });
    }else{
      setValues({description : e.target.value})
    }
        
      };


  return (
    <div className="mt-20">
      <div>
        <h1 className="text-center mb-7 font-bold underline text-[orangered]">
          Contact Dev
        </h1>
      </div>
      <div className=" w-[80%] md:w-[60%] m-auto">
        <form ref={form} className="w-full flex flex-col">
        <label htmlFor="user_name">Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="mb-2 p-2 rounded bg-white"
            name="user_name"
            value={values.user_name}
            onChange={setInputValue}
            disabled = {isLoggedin}
          />
          <label htmlFor="user_email">Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="mb-2 p-2 rounded bg-white"
            name="user_email"
            value={values.user_email}
            onChange={setInputValue}
            disabled = {isLoggedin}
          />
          <label htmlFor="description">Message:</label>
          <textarea
            name="description"
            placeholder="write your query or give feedback..."
            className="mb-2 p-2 rounded resize-none h-[150px]"
            value={values.description}
            onChange={setInputValue}
          ></textarea>
          <button className="border flex justify-center items-center bg-[orangered] rounded w-[30%] my-2 hover:bg-white hover:text-black transition border-[orangered] font-medium text-lg m-auto text-white p-2 "
            onClick={sendEmail}
            disabled = {disable}
          >
           {!disable ? (
            "Send"
          ) : (
            <ThreeCircles
              visible={true}
              height="30"
              width="30"
              color="orangered"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
