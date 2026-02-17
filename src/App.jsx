import Editor from "./components/Editor";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{display:"flex", height:"100vh"}}>
      <Editor />
      <Dashboard />
    </div>
  );
}

export default App;
