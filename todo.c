// when entring the email in forgot password == > message A link is sent to your email
//                                                      resend verification button
//                                                          when Administrative Access is invalid should be a warning

/**
 * @brief
 *
 * !password in register
 * !!after register should show a message
 * !!
 * !!after verified a message welcome
 * !!
 * !!message significative
 * !!
 * !!exit
 * !!
 * !!resend
 * !!
 * !!add page to create a new type of document
 * !!
 * !!add foreing keydoc and add in the type
 * !!
 * !!active button add the activation status
 * !!
 * !!select list
 * !!
 * !!modification of users
 * !!
 * !!log status for admin
 * !!
 * !!search list should be generale
 * !!
 * !!role update
 * !!
 * !!actions should be out the list (in the top)
 * !!
 * !!after creation of doc should be viewed
 * !!
 * !!modify and delete document from view
 * !!
 * !!creation step by step and improvement of the css
 * !!
 * !!
 * !!choose a beter templete and colors
 * !!
 * !!table en tete serqui => code, descriptif, boolen(active, desactive)
 * !!
 * !!line serqui => code, numline, titre, descriptif
 * !!
 * !!add button status to change serqui
 * !!
 * !!
 * !!Fa1
 */

// when entring the email in forgot password ==> message A link is sent to your email
// resend verification button
// when Administrative Access is invalid should be a warning

// const [selectedDocs, setSelectedDocs] = useState([]);

// const handleSelectDoc = (id) => {
//   setSelectedDocs((prevSelectedDocs) =>
//     prevSelectedDocs.includes(id)
//       ? prevSelectedDocs.filter((docId) => docId !== id) // Deselect
//       : [...prevSelectedDocs, id] // Select
//   );
// };

// Update the checkbox input in the table row:

// javascript
// Copy
// <input
//   type="checkbox"
//   className="w-6 h-6 rounded-lg"
//   checked={selectedDocs.includes(doc.id)}
//   onChange={() => handleSelectDoc(doc.id)}
// />

// Step 3: Implement Bulk Delete
// Add a method to delete all selected documents:

// javascript
// const handleBulkDelete = async () => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (!accessToken) {
//     console.warn("No access token found. User is not logged in.");
//     navigate("/");
//     return;
//   }

//   try {
//     // Delete from the database
//     await Promise.all(
//       selectedDocs.map((id) =>
//         axios.delete(`http://192.168.1.94:5204/api/Documents/${id}`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         })
//       )
//     );

//     // Remove from the state
//     setDocuments((prevDocs) =>
//       prevDocs.filter((doc) => !selectedDocs.includes(doc.id))
//     );

//     // Clear selected documents
//     setSelectedDocs([]);

//     toast.success("Selected documents deleted successfully!");
//   } catch (err) {
//     console.error("Failed to delete documents:", err);
//     toast.error("Failed to delete documents. Please try again.");
//   }
// };

// Add a button to trigger the bulk delete:

// javascript
// Copy
// <div
//   className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
//   onClick={handleBulkDelete}
// >
//   <Trash size={18} />
//   Delete Selected
// </div>

// Full Updated Code
// Here’s the updated DocumentList component with the new functionality:
//     import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FileText,
//   RefreshCw,
//   Search,
//   Calendar,
//   Undo,
//   Eye,
//   Trash,
//   Check,
//   File,
// } from "lucide-react";
// import DocumentCard from "./DocumentCard";
// import AddDocs from "./AddDocs";
// import { getDocuments } from "../../../service/docSrvice";
// import axios from "axios";
// import LoadingDocs from "./loadingDocs";
// import { toast, ToastContainer } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
// import { getUserAccount } from "../../../service/authService";
// import "react-toastify/dist/ReactToastify.css";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";

// const DocumentList = () => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const navigate = useNavigate();
//   const [statuscontole, setStatusControl] = useState("Opened");
//   const [activedel, setActiveDel] = useState(false);
//   const [selectedDocs, setSelectedDocs] = useState([]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await getUserAccount();
//       if (userData) {
//         setUser(userData);
//       } else {
//         navigate("/");
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);
//       const fetchedDocs = await getDocuments();
//       console.log("Fetched documents:", fetchedDocs);
//       setDocuments(fetchedDocs);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load documents. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchDocuments();
//     setTimeout(() => setRefreshing(false), 600);
//   };

//   const handleDocumentAdded = (newDoc) => {
//     setDocuments((prevDocs) => [newDoc, ...prevDocs]);
//   };

//   const handleDelete = async (id) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.warn("No access token found. User is not logged in.");
//       navigate("/");
//       return;
//     }

//     const deletedDoc = documents.find((doc) => doc.id === id);
//     setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));

//     let undo = false;

//     // Custom Toast Notification
//     const toastId = toast.warn(
//       <div className="flex flex-col mt-2">
//         <p className="font-semibold text-yellow-500 flex items-center gap-1">
//           <File size={24} className="text-yellow-500" />
//           Document deleted! Undo?
//         </p>
//         <div className="flex justify-end gap-3 m-2">
//           <div
//             className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition flex items-center"
//             onClick={() => {
//               setDocuments((prevDocs) => [deletedDoc, ...prevDocs]);
//               undo = true;
//               toast.dismiss(toastId);
//             }}
//           >
//             <Undo size={16} className="mr-1" />
//             Undo
//           </div>
//           <div
//             className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition flex items-center"
//             onClick={async () => {
//               if (!undo) {
//                 try {
//                   await axios.delete(
//                     `http://192.168.1.94:5204/api/Documents/${id}`,
//                     { headers: { Authorization: `Bearer ${accessToken}` } }
//                   );
//                   console.log("Document deleted successfully:", id);
//                 } catch (err) {
//                   console.error("Failed to delete from database:", err);
//                   setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore on failure
//                 }
//               }
//               toast.dismiss(toastId);
//             }}
//           >
//             <Check size={16} className="mr-1" />
//             Confirm
//           </div>
//         </div>
//       </div>,
//       { autoClose: 5000, closeOnClick: false, pauseOnHover: true }
//     );

// Auto-delete if not undone
//     setTimeout(async () => {
//       if (!undo) {
//         try {
//           await axios.delete(`http://192.168.1.94:5204/api/Documents/${id}`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           });
//           console.log("Document permanently deleted:", id);
//         } catch (err) {
//           console.error("Failed to delete document:", err);
//           setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore on failure
//         }
//       }
//     }, 5000);
//   };

//   const handleSelectDoc = (id) => {
//     setSelectedDocs((prevSelectedDocs) =>
//       prevSelectedDocs.includes(id)
//         ? prevSelectedDocs.filter((docId) => docId !== id) // Deselect
//         : [...prevSelectedDocs, id] // Select
//     );
//   };

//   const handleBulkDelete = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.warn("No access token found. User is not logged in.");
//       navigate("/");
//       return;
//     }

//     try {
//       // Delete from the database
//       await Promise.all(
//         selectedDocs.map((id) =>
//           axios.delete(`http://192.168.1.94:5204/api/Documents/${id}`, {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           })
//         )
//       );

//       // Remove from the state
//       setDocuments((prevDocs) =>
//         prevDocs.filter((doc) => !selectedDocs.includes(doc.id))
//       );

//       // Clear selected documents
//       setSelectedDocs([]);

//       toast.success("Selected documents deleted successfully!");
//     } catch (err) {
//       console.error("Failed to delete documents:", err);
//       toast.error("Failed to delete documents. Please try again.");
//     }
//   };

//   // Filtering logic (search, status, and date)
//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch =
//       doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       doc.content.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesFilter =
//       filterStatus === "all" || doc.status.toString() === filterStatus;

//     const docDate = new Date(doc.docDate).toISOString().split("T")[0]; // Format to YYYY-MM-DD

//     const matchesDate =
//       (!startDate || docDate >= startDate) && (!endDate || docDate <= endDate);

//     return matchesSearch && matchesFilter && matchesDate;
//   });

//   return (
//     <div className="w-full h-full max-h-full mx-auto py-2 px-4">
//       <div className="w-full flex justify-between items-center mb-4 ">
//         <ToastContainer
//           position="top-center"
//           toastStyle={{ textAlign: "center" }}
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
//         <div className="font-bold text-white flex items-center">
//           <FileText size={16} className="mr-2 text-blue-400" />
//           My Documents
//         </div>
//       </div>

//       <div className="flex flex-row  w-full sm:w-auto justify-between  h-1/12">
//         <div className="flex flex-col sm:flex-row gap-2 items-start w-full h-full justify-between">
//           <div className="flex gap-2 justify-between w-full ">
//             {/* Search Input */}
//             <div className=" flex w-4/12">
//               <div className="relative ">
//                 <Search
//                   className="absolute left-3  top-3 transform  text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search documents..."
//                   className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className=" flex w-full justify-between">
//               {/* Add document button/card */}
//               <div className="w-4/12">
//                 <AddDocs onDocumentAdded={handleDocumentAdded} />
//               </div>
//               <div className="w-8/12 flex justify-around">
//                 {/* Start Date Filter */}
//                 <div className="flex items-center gap-2">
//                   <p>Start date: </p>
//                   <div className="relative ">
//                     <Calendar
//                       className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                       size={20}
//                     />
//                     <input
//                       type="date"
//                       className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* End Date Filter */}
//                 <div className="flex items-center gap-2">
//                   <p>End Date: </p>
//                   <div className="relative ">
//                     <Calendar
//                       className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                       size={20}
//                     />
//                     <input
//                       type="date"
//                       className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none "
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-500/20 border border-red-500/50 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <LoadingDocs />
//         </div>
//       ) : (
//         <div className="w-full h-10/12 p-1 overflow-y-scroll overflow-x-clip scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
//           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
//             {/* Document Liste */}
//             <div className="overflow-hidden rounded-lg shadow-lg">
//               <motion.table
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-full border-collapse bg-gray-900 text-white rounded-lg"
//               >
//                 <thead className="bg-blue-700 text-white">
//                   <tr>
//                     <th className="p-4 text-left uppercase text-sm tracking-wide">
//                       #
//                     </th>
//                     <th className="p-4 text-left uppercase text-sm tracking-wide">
//                       Title
//                     </th>
//                     <th className="p-4 text-left uppercase text-sm tracking-wide">
//                       Date
//                     </th>
//                     <th className="p-4 text-left uppercase text-sm tracking-wide">
//                       Type
//                     </th>
//                     <th className="p-4 uppercase text-sm tracking-wide text-center">
//                       <div>Status</div>
//                     </th>
//                     <th className="p-4 text-right uppercase text-sm tracking-wide flex items-center justify-evenly">
//                       <div onClick={handleRefresh}>
//                         <RefreshCw
//                           onClick={handleRefresh}
//                           disabled={loading || refreshing}
//                           className={`cursor-pointer rounded-4xl ${
//                             refreshing ? "animate-spin" : ""
//                           }`}
//                           size={28}
//                         />
//                       </div>
//                       <div
//                         className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
//                         onClick={handleBulkDelete}
//                       >
//                         <Trash size={18} />
//                         Delete Selected
//                       </div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredDocuments.length > 0 ? (
//                     filteredDocuments.map((doc) => (
//                       <motion.tr
//                         key={doc.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
//                       >
//                         <td className="p-4 flex gap-1.5">
//                           <input
//                             type="checkbox"
//                             className="w-6 h-6 rounded-lg"
//                             checked={selectedDocs.includes(doc.id)}
//                             onChange={() => handleSelectDoc(doc.id)}
//                           />
//                           <p>DOC-{doc.id}</p>
//                         </td>
//                         <td
//                           className="p-4"
//                           // onClick={() => handleUserClick(user, "update")}
//                         >
//                           {doc.title}
//                         </td>
//                         <td className="p-4">{doc.docDate}</td>
//                         <td className="p-4">{doc.documentType.typeName}</td>
//                         <td className="p-4 items-center ">
//                           <FormGroup className="items-center">
//                             <FormControlLabel
//                               control={<Switch />}
//                               label="Activate"
//                             />
//                           </FormGroup>
//                         </td>
//                         <td className="p-4 flex items-center justify-center space-x-3">
//                           {/* Toggle Button */}

//                           {/* View Button */}
//                           <Link to={`/DocumentDetail/${doc.id}`}>
//                             <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer">
//                               <Eye size={18} />
//                             </div>
//                           </Link>

//                           {/* Delete Button */}
//                           <div
//                             className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
//                             onClick={() => handleDelete(doc.id)}
//                           >
//                             <Trash size={18} />
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="p-4 text-center text-gray-400">
//                         No users found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </motion.table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
