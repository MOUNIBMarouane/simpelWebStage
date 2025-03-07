import React, { useState, useEffect } from "react";
import { getDocumetSublines, addDocumentSubLine } from "../../../service/LInes";
import { ChevronDown, CirclePlus } from "lucide-react";

const SubLine = ({ LineId, role }) => {
  const [subLines, setSubLines] = useState([]);
  const [isAddVisible, setIsVisible] = useState(false);
  const [newSubLine, setNewSubLine] = useState({
    title: "",
    attribute: "",
  });
  role = "admin";
  const [isSubFormVisible, setIsSubFormVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchSubLines = async () => {
      if (!LineId) {
        console.log("subline of line %d---------- NULL", LineId);
        console.log("subline roleuser of line %d---------- NULL", role);
        return;
      }
      const subLineData = await getDocumetSublines(LineId);
      console.log("subline of line %d----------", LineId, subLineData);
      setSubLines(subLineData);
    };
    fetchSubLines();
  }, [LineId]);

  useEffect(() => {
    const valid = newSubLine.title.trim() && newSubLine.attribute.trim();
    console.log("Form validation status:", valid); // Debugging
    setIsFormValid(valid);
  }, [newSubLine]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubLine = async () => {
    console.log("✅ subline of line call of add handler"); // Debugging log

    if (!isFormValid) {
      console.log("❌ Form is not valid. Cannot submit.");
      return;
    }

    const savedSubLine = await addDocumentSubLine(
      LineId,
      newSubLine.title,
      newSubLine.attribute
    );

    if (savedSubLine) {
      setSubLines([...subLines, savedSubLine]);
      setNewSubLine({ title: "", attribute: "" });
      console.log("✅ Subline successfully added!");
    } else {
      console.log("❌ Failed to add subline.");
    }
  };

  return (
    <div className="subline">
      <div className="line__title">Sublines</div>
      <div className="subline__list">
        {subLines?.length > 0 ? (
          subLines.map((subLine) => (
            <div
              key={subLine.id}
              className="subline__item bg-gray-600 text-white p-2 rounded my-1"
            >
              {subLine.title} - {subLine.attribute}
            </div>
          ))
        ) : (
          <div>
            <p className="text-gray-400">No sublines available.</p>
          </div>
        )}
        <div
          onClick={() => {
            setIsVisible(!isAddVisible);
            setIsSubFormVisible(!isSubFormVisible);
          }}
        >
          <CirclePlus
            className={`m-2 transition-transform ${
              isAddVisible ? "rotate-45" : ""
            }`}
          />
        </div>
      </div>
      {/* Show Add Sublines for Admin and FullUser */}
      befor role {role}
      {/* {(role?.toLowerCase() === "admin" ||
        role?.toLowerCase() === "fulluser") && ( */}
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
              disabled={!isFormValid}
              className={`px-4 py-2 p-2 mb-2 rounded font-bold cursor-pointer ${
                isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-500"
              }`}
            >
              +
            </div>
          </div>
        )}
        <div onClick={() => setIsSubFormVisible(!isSubFormVisible)}>
          <span
            className={`cursor-pointer ${isSubFormVisible ? "rotate-45" : ""}`}
          >
            {" "}
            add{" "}
          </span>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default SubLine;
