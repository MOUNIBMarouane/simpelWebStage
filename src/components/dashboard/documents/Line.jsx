import React, { useState, useEffect } from "react";
import { getDocumentLines, addDocumentLine } from "../../../service/LInes";

const Line = ({ lineKey, role }) => {
  const [lines, setLines] = useState([]);

  const [roleUser, setRoleUser] = useState(role || "user");

  const [newLine, setNewLine] = useState({
    title: "",
    article: "",
    prix: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchLines = async () => {
      const lineData = await getDocumentLines(lineKey);
      if (lineData) {
        console.log("Fetched line data", lineData);
        setLines(lineData);
      }
    };
    fetchLines();
  }, [lineKey]); // Ensure this effect runs when `lineKey` changes

  useEffect(() => {
    setRoleUser(role);
    console.log("Updated roleUser:", role);
  }, [role]);

  useEffect(() => {
    setIsFormValid(
      newLine.title.trim() && newLine.article.trim() && newLine.prix.trim()
    );
  }, [newLine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLine = async () => {
    if (!isFormValid) return;

    const savedLine = await addDocumentLine(
      lineKey,
      newLine.title,
      newLine.article,
      newLine.prix
    );
    if (savedLine) {
      setLines([...lines, savedLine]);
      setNewLine({ title: "", article: "", prix: "" });
    }
  };

  return (
    <div className="sub-title">
      <input type="text" value={role} readOnly />
      {(role?.toLowerCase() === "admin" ||
        role?.toLowerCase() === "fulluser") && (
        <div className="w-full flex flex-row p-2 justify-between items-center gap-1">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newLine.title}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="article"
            placeholder="Article"
            value={newLine.article}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            name="prix"
            placeholder="Prix"
            value={newLine.prix}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleSaveLine}
            className={`px-4 py-2 p-2 mb-2 rounded font-bold ${
              isFormValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            +
          </button>
        </div>
      )}
      {lines.map((line) => (
        <h3 key={line.id}>{line.title}</h3>
      ))}
    </div>
  );
};

export default Line;
