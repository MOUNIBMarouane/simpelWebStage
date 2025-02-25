import React, { useState } from "react";
import { motion } from "framer-motion";

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newEmployer, setNewEmployer] = useState({
    name: "",
    position: "",
    email: "",
  });

  const handleChange = (e) => {
    setNewEmployer({ ...newEmployer, [e.target.name]: e.target.value });
  };

  const addOrEditEmployer = () => {
    if (!newEmployer.name || !newEmployer.position || !newEmployer.email)
      return;

    if (editingEmployer) {
      setEmployers(
        employers.map((emp) =>
          emp.id === editingEmployer ? { ...emp, ...newEmployer } : emp
        )
      );
    } else {
      setEmployers([...employers, { id: Date.now(), ...newEmployer }]);
    }

    setShowForm(false);
    setNewEmployer({ name: "", position: "", email: "" });
    setEditingEmployer(null);
  };

  const deleteEmployer = (id) => {
    setEmployers(employers.filter((emp) => emp.id !== id));
  };

  const editEmployer = (emp) => {
    setNewEmployer(emp);
    setEditingEmployer(emp.id);
    setShowForm(true);
  };

  const filteredEmployers = employers.filter((employer) =>
    Object.values(employer).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-full h-full flex justify-center items-center text-white">
      <div className="bg-black/60 w-full h-full backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold">Employer List</h2>

        <input
          type="text"
          placeholder="Search employers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <div className="grid grid-cols-4 gap-6 mt-5">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            + Add Employer
          </button>
          {filteredEmployers.map((emp) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-700 p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">{emp.name}</h3>
              <p className="text-sm">{emp.position}</p>
              <p className="text-sm text-gray-300">{emp.email}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => editEmployer(emp)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployer(emp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-black/70 p-6 rounded-lg shadow-lg w-96 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              {editingEmployer ? "Edit Employer" : "Add New Employer"}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newEmployer.name}
              onChange={handleChange}
              className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={newEmployer.position}
              onChange={handleChange}
              className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployer.email}
              onChange={handleChange}
              className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={addOrEditEmployer}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {editingEmployer ? "Update" : "Add"}
              </button>
              <div
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
              >
                Cancel
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployerList;
