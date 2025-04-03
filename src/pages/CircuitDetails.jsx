import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trash,
  Edit,
  CheckCircle,
  X,
  Info,
  List,
  Network,
} from "lucide-react";
import axios from "axios";
import FormInput from "../components/common/Form/Input";

const CircuitDetail = () => {
  const { circuitId } = useParams();
  const [circuit, setCircuit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [circuitDetails, setCircuitDetails] = useState([]);
  const [editingDetail, setEditingDetail] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCircuit, setEditedCircuit] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCircuit = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const circuitResponse = await axios.get(
          `http://192.168.1.94:5204/api/Circuit/${circuitId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const detailsResponse = await axios.get(
          `http://192.168.1.94:5204/api/CircuitDetail/by-circuit/${circuitId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setCircuit(circuitResponse.data);
        setCircuitDetails(detailsResponse.data);
      } catch (error) {
        console.error("Error fetching circuit:", error);
        setError("Failed to load circuit details");
      }
      setLoading(false);
    };

    fetchCircuit();
  }, [circuitId]);

  const addNotification = (notification) => {
    const notificationId = notification.id;
    const timeoutId = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, 5000);

    setNotifications((prev) => [...prev, { ...notification, timeoutId }]);
  };

  const handleUndo = (notification) => {
    clearTimeout(notification.timeoutId);
    if (notification.undo) notification.undo();
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedCircuit(isEditing ? null : { ...circuit });
  };

  const handleCircuitChange = (e) => {
    const { name, value } = e.target;
    setEditedCircuit((prev) => ({ ...prev, [name]: value }));
  };

  const handleCircuitSave = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://192.168.1.94:5204/api/circuit/${circuitId}`,
        editedCircuit,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setCircuit(response.data);
      setIsEditing(false);
      addNotification({
        id: Date.now(),
        message: "Circuit updated successfully!",
      });
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: "Failed to update circuit",
      });
    }
  };

  const handleAddDetail = async (newDetail) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://192.168.1.94:5204/api/circuitdetail",
        { ...newDetail, circuitId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setCircuitDetails((prev) => [...prev, response.data]);
      addNotification({
        id: Date.now(),
        message: `Detail ${response.data.stepNumber} added!`,
      });
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: "Failed to add detail",
      });
    }
  };

  const handleUpdateDetail = async (id, updatedDetail) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://192.168.1.94:5204/api/circuitdetail/${id}`,
        updatedDetail,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setCircuitDetails((prev) =>
        prev.map((detail) => (detail.id === id ? response.data : detail))
      );
      setEditingDetail(null);
      addNotification({
        id: Date.now(),
        message: `Detail ${response.data.stepNumber} updated!`,
      });
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: "Failed to update detail",
      });
    }
  };

  const handleDeleteDetail = (id) => {
    const detailToDelete = circuitDetails.find((d) => d.id === id);
    setCircuitDetails((prev) => prev.filter((d) => d.id !== id));

    addNotification({
      id: Date.now(),
      message: `Detail ${detailToDelete.stepNumber} deleted`,
      undo: () => setCircuitDetails((prev) => [...prev, detailToDelete]),
      onConfirm: async () => {
        try {
          await axios.delete(
            `http://192.168.1.94:5204/api/circuitdetail/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
        } catch (error) {
          setCircuitDetails((prev) => [...prev, detailToDelete]);
          addNotification({
            id: Date.now(),
            message: "Failed to delete detail",
          });
        }
      },
    });
  };

  if (loading)
    return <p className="text-white text-center">Loading circuit...</p>;
  if (error) return <p className="text-white text-center">{error}</p>;
  if (!circuit)
    return <p className="text-white text-center">Circuit not found</p>;

  return (
    <div className="w-full h-full flex-col justify-center bg-slate-900 items-center text-white rounded-lg p-3 relative">
      {/* Back button */}
      <div className="h-1/12">
        <Link
          to="/circuits"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={18}
          />
          Back to Circuits
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-10/12 mt-4">
        {/* Circuit Details Card */}
        <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl relative">
          <div className="flex flex-col justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
              <Network size={20} />
              Circuit Details
            </h2>

            {isEditing ? (
              <div className="absolute bottom-0 left-0 w-full flex justify-end gap-3 px-6 my-3">
                <button
                  onClick={handleCircuitSave}
                  className="px-3 py-1.5 text-sm bg-green-600/30 hover:bg-green-600/50 rounded-md flex items-center gap-1"
                >
                  <CheckCircle size={16} className="text-green-400" />
                  Save
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-3 py-1.5 text-sm bg-slate-600/30 hover:bg-slate-600/50 rounded-md flex items-center gap-1"
                >
                  <X size={16} className="text-slate-300" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="absolute top-4 right-4 p-2.5 bg-slate-600 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <Edit size={16} className="text-slate-300" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <DetailItem
              label="Circuit Key"
              value={
                isEditing ? (
                  <FormInput
                    name="circuitKey"
                    value={editedCircuit?.circuitKey || ""}
                    onChange={handleCircuitChange}
                  />
                ) : (
                  circuit.circuitKey
                )
              }
            />

            <DetailItem
              label="Title"
              value={
                isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={editedCircuit?.title || ""}
                    onChange={handleCircuitChange}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                ) : (
                  circuit.title
                )
              }
            />

            <DetailItem
              label="Status"
              value={
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    circuit.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {circuit.isActive ? "Active" : "Inactive"}
                </span>
              }
            />

            <div className="pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Description
              </h3>
              {isEditing ? (
                <textarea
                  name="descriptif"
                  value={editedCircuit?.descriptif || ""}
                  onChange={handleCircuitChange}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none min-h-[100px]"
                />
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {circuit.descriptif || (
                    <span className="italic text-slate-500">
                      No description
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Circuit Details Section */}
        <div className="md:col-span-3 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                <List size={20} />
                Circuit Steps
              </h2>
              <button
                onClick={() => setEditingDetail("new")}
                className="px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-md"
              >
                Add Step
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <motion.div className="h-full overflow-auto custom-scrollbar">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-700/80 backdrop-blur-sm">
                    <tr>
                      {["Step", "Description", "Duration", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-sm font-semibold text-slate-300"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/50">
                    {circuitDetails.map((detail) => (
                      <motion.tr
                        key={detail.id}
                        className="hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-blue-300">
                          {detail.stepNumber}
                        </td>
                        <td className="px-4 py-3">
                          {editingDetail === detail.id ? (
                            <input
                              value={detail.description}
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white"
                              onChange={(e) =>
                                setCircuitDetails((prev) =>
                                  prev.map((d) =>
                                    d.id === detail.id
                                      ? { ...d, description: e.target.value }
                                      : d
                                  )
                                )
                              }
                            />
                          ) : (
                            <span className="text-slate-300">
                              {detail.description}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingDetail === detail.id ? (
                            <input
                              type="number"
                              value={detail.duration}
                              onChange={(e) =>
                                setCircuitDetails((prev) =>
                                  prev.map((d) =>
                                    d.id === detail.id
                                      ? { ...d, duration: e.target.value }
                                      : d
                                  )
                                )
                              }
                              className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            <span className="text-slate-300">
                              {detail.duration} mins
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {editingDetail === detail.id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateDetail(detail.id, detail)
                                  }
                                  className="p-1.5 bg-green-600/30 hover:bg-green-600/50 rounded-md"
                                >
                                  <CheckCircle
                                    size={18}
                                    className="text-green-400"
                                  />
                                </button>
                                <button
                                  onClick={() => setEditingDetail(null)}
                                  className="p-1.5 bg-slate-600/30 hover:bg-slate-600/50 rounded-md"
                                >
                                  <X size={18} className="text-slate-300" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingDetail(detail.id)}
                                  className="p-1.5 bg-slate-600/30 hover:bg-slate-600/50 rounded-md"
                                >
                                  <Edit size={18} className="text-slate-300" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDetail(detail.id)}
                                  className="p-1.5 bg-red-600/30 hover:bg-red-600/50 rounded-md"
                                >
                                  <Trash size={18} className="text-red-400" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg backdrop-blur-sm border border-slate-700/50 bg-slate-800/80 shadow-xl"
            >
              {notification.undo ? (
                <Info size={18} className="text-blue-400" />
              ) : (
                <CheckCircle size={18} className="text-green-400" />
              )}
              <span className="text-sm">{notification.message}</span>
              {notification.undo && (
                <button
                  onClick={() => handleUndo(notification)}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  Undo
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value || "-"}</span>
  </div>
);

export default CircuitDetail;
