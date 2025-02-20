import { useState } from "react";
import "./App.css";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-[100vw] h-[100vh] bg-red-500">
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <SignUp />
      </ErrorBoundary>
    </div>
  );
}

export default App;
