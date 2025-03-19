import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../ContextProvider/Context";
import noPosts from "../../assets/noPosts.png";

function Posts() {
  const constantSliceValue = 6 ;
  const { poems } = useContext(LoginContext);
  const navigate = useNavigate();
  const [sliceValue, setSliceValue] = useState(constantSliceValue);
  const [slicedPoems, setSlicedPoems] = useState([]);

  useEffect(() => {
    if (poems) {
      setSlicedPoems(poems.slice(0, sliceValue));
    }
  }, [poems, sliceValue]);

  const redirectToThePost = (e) => {
    const postId = e.currentTarget.id;
    navigate(`/posts/${postId}`);
  };


  const showMorePoems = () => {
    setSliceValue(sliceValue + 6);

    if(sliceValue > poems.length){
      setSliceValue(poems.length);
    }

    setSlicedPoems(poems.slice(slicedPoems.length, sliceValue));
  };

  const showLessPoems = () => {
    setSliceValue(sliceValue - 6);

    if(sliceValue < 0){
      setSliceValue(10);
    }

    setSlicedPoems(poems.slice(0, sliceValue));
  };

  return (
    <>
      <h1 className="text-center text-[orangered] underline rasavakya1 text-bg mt-10">
        Gallery
      </h1>
      <div className=" flex flex-wrap justify-center items-center  mt-16 place-items-center mb-20 md:w-[90%] m-auto">
        {slicedPoems && slicedPoems.length > 0 ? (
          slicedPoems?.map((poem) => (
            <div
              key={poem._id}
              className="w-[85%] cursor-pointer md:w-[500px] lg:w-[400px] text-center text-wrap mx-6 mt-10 grid place-items-center title2 bg-white shadow-lg hover:scale-[95%] transition border-4 border-gray-600"
              id={poem._id}
              onClick={redirectToThePost}
            >
              <div className="border-4 border-gray-500 ">
                <div className="border-4 border-gray-400">
                  <div className=" border-4 border-gray-300">
                    <div className="border-4 border-gray-200">
                      <div className="p-5 border border-gray-100">
                        <h1 className="text-center font-semibold w-[90%] mb-4 text-md border-b-2 border-gray-300  pb-3">
                          {poem.title}
                        </h1>
                        <p className="description text-md p-1">
                          {poem.description}
                        </p>
                        <p className="author w-full text-right italic font-medium text-gray-400">
                          {" "}
                          -{poem.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <img src={noPosts} alt="" className=" bg-transparent w-[350px]" />
        )}
      </div>
      <div className="m-auto flex justify-center items-center">
        <button
          className={`p-2 bg-[orangered] border border-[orangered] hover:text-black hover:bg-white text-white rounded mx-2 mb-8 transition ${
            slicedPoems.length > constantSliceValue ? "block" : "hidden"
          }`}
          onClick={showLessPoems}
        >
          Show Less
        </button>
        <button
          className={`p-2 bg-[orangered] border border-[orangered] hover:text-black hover:bg-white text-white rounded mx-2 mb-8 transition ${
            slicedPoems.length == poems.length ? "hidden" : "block"
          }`}
          onClick={showMorePoems}
        >
          Show More
        </button>
      </div>
    </>
  );
}

export default Posts;
