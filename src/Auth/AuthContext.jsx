// import { createContext, useContext, useState, useEffect } from "react";
// import { getUserAccount } from "../service/authService"; // Ensure this function exists

// // Create context
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await getUserAccount(); // Get user details
//       setUser(userData);
//     };
//     fetchUser();
//   }, []);

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("accessToken"); // Remove token if stored
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Correctly export `useAuth`
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
