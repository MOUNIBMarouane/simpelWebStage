import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import VerificationP from "./pages/Verification";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AutContext";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   children: [
  //     {
  //       index: true,
  //       element: <SignIn />,
  //     },
  //     // {
  //     //   element: <Layout />,
  //     //   children: [
  //     //     {
  //     //       path: "/dashboard",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <Dashboard />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //     {
  //     //       path: "/tictacto",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <TicTacToe />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //     {
  //     //       path: "/profile/:username",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <Profile />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //     {
  //     //       path: "/chat",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <Chat />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //     {
  //     //       path: "/search",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <Search />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //     {
  //     //       path: "/settings",
  //     //       element: (
  //     //         <ProtectedRoute>
  //     //           <Settings />
  //     //         </ProtectedRoute>
  //     //       ),
  //     //     },
  //     //   ],
  //     // },
  //   ],
  //   errorElement: (
  //     <div className=" font-bold border-l-4 h-screen  bg-blue-100 p-[50%]">
  //       404 Page Not Found
  //     </div>
  //   ),
  // },
  {
    path: "/",
    element: (
      // <PublicRoute>
      <SignUp />
      // </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      // <PublicRoute>
      <SignUp />
      // </PublicRoute>
    ),
  },
  {
    path: "/sigin",
    element: (
      // <PublicRoute>
      <SignIn />
      // </PublicRoute>
    ),
  },
  {
    path: "/verify/:email",
    element: (
      // <PublicRoute>
      <VerificationP />
      // </PublicRoute>
    ),
  },
]);
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-[100vw] h-[100vh] bg-red-500">
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <AuthProvider>
          {/* <Toaster /> */}
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
