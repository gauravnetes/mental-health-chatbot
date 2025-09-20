import { useContext } from "react";
import "./Main.css";
import { Context } from "../../context/Context";
import MyLoader from "../Loader/Loader";
import { assets } from "../../assets/assets";
const Main = () => {
 
  const {
    Input,
    setInput,
    RecentPrompt,
    setRecentPrompt,
    PrevPrompt,
    setPrevPrompt,
    ShowResult,
    Loading,
    setResultData,
    ResultData,
    onSent,
  } = useContext(Context);
  const handleKeyDown = (event)=>{
    if (event.key == "Enter") {
      onSent();
    }
  }
  const loadPrompt = (prompt) => {
    setInput(prompt);
  };
  return (
    <>
     <div className="relative w-[100%] h-[100vh] overflow-hidden">
     <div className="relative bg-red lg:px-5 lg:py-5">
        <nav className=" flex justify-between mt-8 lg:mt-0 ">
          <h1 className="absolute text-white left-[17vw] mt-1 lg:mt-0 lg:left-[6vw] text-2xl font-semibold">
            AstraG
          </h1>
          <img
            className=" absolute right-5 w-[40px] h-[40px]"
            src={assets.profile}
            alt="user"
          />
        </nav>
      </div>

      {!ShowResult ? (
        <>
          <div className="greet-cards relative h-32 text-center top-16 lg;top-20 ">
            <div className=" flex flex-col">
            <p className="text-[7vh]  lg:text-[13vh]">
              <span>Hello Deviies!</span>
            </p>
            <p className="text-[2.6vh] lg:text-[5vh] ">
            Ask anything, I’m here to help!{" "}
            </p>
            </div>

            
            <div className="cards h-72 w-[100%] absolute lg:left-[50%] lg:-translate-x-[50%] text-white mt-20 lg:mt-4 flex justify-center items-center flex-wrap gap-2 lg:gap-5 ">

              <div onClick={()=>loadPrompt("Suggest beautiful places to see on an upcoming road trip.")} className="card relative transition-all text-start ease-in-out duration-300 bg-[#181B18] hover:bg-[#161816] p-5 h-36 w-36 lg:w-40 lg:h-[26vh] rounded-3xl ">
                <p className="text-[13px] w-24">
                  Suggest beautiful places to see on an upcoming road trip.
                </p>
                <img
                  className="w-[30px] h-[30px] absolute  bottom-5 right-5 opacity-0 lg:opacity-100"
                  src={assets.plane}
                  alt=""
                />
              </div>
              <div onClick={()=>loadPrompt("Briefly summarize this concept: urban planning.")} className="card h-36 w-36 relative transition-all text-start ease-in-out duration-300 bg-[#181B18] hover:bg-[#161816] p-5 lg:w-40 lg:h-[26vh] rounded-3xl">
                <p className="text-[13px] w-24">
                  Briefly summarize this concept: urban planning.
                </p>
                <img
                  className="w-[30px] h-[30px] absolute  bottom-5 right-5 opacity-0 lg:opacity-100"
                  src={assets.urban}
                  alt=""
                />
              </div>
              <div onClick={()=>loadPrompt("Brainstorm team bonding activities for our work retreat.")} className="card relative h-36 w-36 transition-all text-start ease-in-out duration-300 bg-[#181B18] hover:bg-[#161816] p-5 lg:w-40 lg:h-[26vh] rounded-3xl">
                <p className="text-[13px] w-24">
                  Brainstorm team bonding activities for our work retreat.
                </p>
                <img
                  className="w-[35px] h-[35px] absolute  bottom-5 right-5 opacity-0 lg:opacity-100"
                  src={assets.brain}
                  alt=""
                />
              </div>
              <div onClick={()=>loadPrompt("Tell me about React js and React native.")} className="card h-36 w-36 relative transition-all text-start ease-in-out duration-300 bg-[#181B18] hover:bg-[#161816] p-5 lg:w-40 lg:h-[26vh] rounded-3xl">
                <p className="text-[13px] w-24">
                  Tell me about React js and React native.
                </p>
                <img
                  className="w-[35px] h-[35px] absolute  bottom-5 right-5 opacity-0 lg:opacity-100"
                  src={assets.react}
                  alt=""
                />
              </div>
            </div>
          </div>


        </>
      ) : (
        <>
          <div className="result px-5  w-100% h-[71vh] overflow-auto absolute lg:px-72 top-20 lg;top-24 py-2  flex flex-col gap-4  text-white">
            <div className="user flex gap-3 items-center">
              <img
                className="w-[30px] h-[30px]"
                src={assets.profile}
                alt="user"
              />
              <p>{RecentPrompt}</p>
            </div>
            <div className="result-data  ml-1   flex gap-2">
              <img  className="w-[30px] h-[30px]"
                src={assets.astra}
                alt="user" />
                {Loading? <MyLoader className="w-[80%] h-12 lg:h-[124px] "/>
                :
              <p className=" mt-1" dangerouslySetInnerHTML={{ __html: ResultData }} />
            }
            </div>
          </div>
        </>
      )}
      <div className="prompt flex gap-5 absolute bg-[#181B18] left-[50%] -translate-x-[50%] bottom-12  lg:bottom-16 w-[87%] lg:w-[46vw] rounded-full p-3">
        <input
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          value={Input}
          className="w-[90%] text-white ml-3 border-none outline-none bg-transparent"
          type="text"
          placeholder=""
        />

        {Input?
        <button onClick={() => onSent()}>
          <img src={assets.send} alt="" />
        </button>
        :null}
      </div>

      {/* <div className="absolute text-white bottom-2 lg:opacity-0  left-[50%] -translate-x-[50%]">made by sobu</div> */}
     </div>
    </>
  );
};

export default Main;
