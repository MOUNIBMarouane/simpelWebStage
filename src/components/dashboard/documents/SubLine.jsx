import React, { useState, useEffect } from "react";
import { getDocumetSublines, addDocumentSubLine } from "../../../service/LInes";

const SubLine = ({ line, role }) => {
  const [subLines, setSubLines] = useState([]);
  const [newSubLine, setNewSubLine] = useState({
    title: "",
    attribute: "",
  });

  const [isSubFormVisible, setIsSubFormVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchSubLines = async () => {
      if (!line?.id) return;
      const subLineData = await getDocumetSublines(line.id);
      setSubLines(subLineData);
    };

    fetchSubLines();
  }, [line?.id]);

  useEffect(() => {
    setIsFormValid(newSubLine.title.trim() && newSubLine.attribute.trim());
  }, [newSubLine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubLine = async () => {
    if (!isFormValid) return;

    const savedSubLine = await addDocumentSubLine({
      ligneId: line.id,
      title: newSubLine.title,
      attribute: newSubLine.attribute,
    });

    if (savedSubLine) {
      setSubLines([...subLines, savedSubLine]);
      setNewSubLine({ title: "", attribute: "" });
    }
  };

  return (
    <div className="subline">
      <div className="line__title">Sublines</div>
      <div className="subline__list">
        {subLines.length > 0 ? (
          subLines.map((subLine) => (
            <div
              key={subLine.id}
              className="subline__item bg-gray-600 text-white p-2 rounded my-1"
            >
              {subLine.title} - {subLine.attribute}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No sublines available.</p>
        )}
      </div>

      {/* Show Add Sublines for Admin and FullUser */}
      {(role?.toLowerCase() === "admin" ||
        role?.toLowerCase() === "fulluser") && (
        <div>
          {isSubFormVisible && (
            <div className="w-full flex flex-row p-2 justify-between items-center gap-1">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newSubLine.title}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                name="attribute"
                placeholder="Attribute"
                value={newSubLine.attribute}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
              />
              <div
                onClick={handleSaveSubLine}
                className={`px-4 py-2 p-2 mb-2 rounded font-bold cursor-pointer ${
                  isFormValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                +
              </div>
            </div>
          )}
          <div onClick={() => setIsSubFormVisible(!isSubFormVisible)}>
            <span
              className={`cursor-pointer ${
                isSubFormVisible ? "rotate-45" : ""
              }`}
            >
              ➕
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubLine;
