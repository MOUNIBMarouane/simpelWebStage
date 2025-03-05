// import { createContext, useContext, useState, useEffect } from "react";
// import { getUserAccount } from "../service/authService";
// import { useNavigate } from "react-router-dom";

// // Create the AuthContext
// const AuthContext = createContext({
//   user: null,
//   setUser: () => {},
//   login: () => {},
//   logout: () => {},
// });

// // AuthProvider component to wrap the app
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate(); // useNavigate is now used inside a Router context

//   // Fetch user data on initial load
//   useEffect(() => {
//     const fetchUser = async () => {
//       const accessToken = localStorage.getItem("accessToken");
//       if (accessToken) {
//         const userData = await getUserAccount();
//         if (userData) {
//           setUser(userData);
//         }
//       }
//     };

//     fetchUser();
//   }, []);

//   // Login function
//   const login = async (accessToken) => {
//     localStorage.setItem("accessToken", accessToken);
//     const userData = await getUserAccount();
//     if (userData) {
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("accessToken");
//     navigate("/"); // Redirect to the login page
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use AuthContext
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
