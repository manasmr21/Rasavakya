import Navbar from "./components/Navbar/Navbar"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ErrorPage from "./components/Error/ErrorPage";
import Otp from "./components/Signup/Otp";
import { useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import ForgotPassword from "./components/ResetPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import TextEditor from "./components/posts/TextEditor";
import SinglePost from "./components/posts/SinglePost";
import Profile from "./components/profile/Profile";
import Footer from "./components/Footer/Footer";
import PostComponents from "./components/PostCompnents/PostComponents";
import About from "./components/About/About"
import "./App.css"
// import ContactForm from "./components/Contact Form/ContactForm";


function App() {

  const {isLoggedin, setIsLoggedin} = useContext(LoginContext);

     const RedirectUserIfLoggedIn = ({children})=>{
      if(isLoggedin){
        return <Navigate to = "/" replace/>
      }

      return children;
     }
  
  return (
    <>
      <Router>
        <Navbar  />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={
            <RedirectUserIfLoggedIn>
              <Login/>
            </RedirectUserIfLoggedIn>
          } />
          <Route exact path="/signup" element={
            <RedirectUserIfLoggedIn>
              <Signup/>
            </RedirectUserIfLoggedIn>
          } />
          <Route exact path="/verify-email/:otpPath" element={
            <RedirectUserIfLoggedIn>
              <Otp/>
            </RedirectUserIfLoggedIn>
          } />
          <Route exact path="*" element={<ErrorPage/>} />
          <Route exact path="/forgot-password" element={
            <RedirectUserIfLoggedIn>
              <ForgotPassword/>
            </RedirectUserIfLoggedIn>
          } />
          <Route exact path="/reset-password/:token" element={<ResetPassword />} />
          <Route exact path="/text-editor" element={<TextEditor/>} />
          <Route exact path="/posts/:postID" element={<SinglePost/>} />
          <Route exact path="/profile/:userId" element={<Profile/>} />
          <Route exact path="/about" element={<About/>} />
          <Route exact path="/posts" element={<PostComponents/>} />
        </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App
