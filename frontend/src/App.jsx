import Main from "./components/Main/Main";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <>
      <div className="h-[100vh] w-[100%] overflow-hidden ">
        <Sidebar />
        <Main />
      </div>
    </>
  );
}

export default App;
