import { useRef, useEffect } from "react";
import Posts from "../posts/Posts";
import "./home.css";
import ContactForm from "../Contact Form/ContactForm";

function Home() {
  const postsRef = useRef(null); // Create a ref to the Posts component
  const contactRef = useRef(null);

  const scrollToContact = ()=>{
    if(contactRef.current){
      contactRef.current.scrollIntoView({behavior : "smooth"})
    }
  }

  const scrollToPosts = () => {
    if (postsRef.current) {
      postsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="home-container grid place-items-center w-full bg-no-repeat bg-cover bg-center pt-56 lg:pt-48 h-[100vh]">
        <div className="">
          <p className="text-center pr-2 sm:pr-0 text-2xl font-medium ml-5">
            ❝Unleash your thoughts with❞
          </p>
          <h1 className="rasavakya text-center pl-5 pt-5 text-[50px] sm:text-[60px] text-[orangered] font-extrabold">
            RasaVakya
          </h1>
        </div>
        <div>
          <button
            onClick={scrollToPosts}
            className=" mx-2 bg-[orangered] hover:bg-transparent hover:text-[orangered] border border-[orangered] transition text-white rounded p-3 text-lg font-medium"
          >
            Explore
          </button>
          <button
            onClick={scrollToContact}
            className=" mx-2 bg-[orangered] hover:bg-transparent hover:text-[orangered] border border-[orangered] transition text-white rounded p-3 text-lg font-medium"
          >
            Contact
          </button>
        </div>
      </div>

      <div ref={postsRef}>
        <Posts />
      </div>
      <div ref={contactRef}>
        <ContactForm />
      </div>
    </>
  );
}

export default Home;
