import React, { useState, useEffect } from "react";
import { getDocumentLines, addDocumentLine } from "../../../service/LInes";
import { ChevronDown, CirclePlus } from "lucide-react";
import SubLine from "./SubLine";

const Line = ({ lineKey, role }) => {
  const [lines, setLines] = useState([]);
  const [isLinesVisible, setIsLinesVisible] = useState(false);
  const [isAddVisible, setIsVisible] = useState(false);
  const [expandedLines, setExpandedLines] = useState({});

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
        setLines(lineData);
      }
    };
    fetchLines();
  }, [lineKey]);

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

  const toggleSubLine = (id) => {
    setExpandedLines((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only the clicked line
    }));
  };

  return (
    <div className="sub-title flex-col w-full">
      <div
        className="lines-show p-2 flex justify-between items-center border-b-2 border-gray-500 hover:bg-gray-700"
        onClick={() => setIsLinesVisible(!isLinesVisible)}
      >
        <span>Lines:</span>
        <ChevronDown
          className={`transition-transform ${
            isLinesVisible ? "rotate-180" : ""
          }`}
        />
      </div>

      {isLinesVisible && (
        <div className="w-full">
          <div className="p-2 lines">
            {lines.map((line) => (
              <div className="w-full" key={line.id}>
                <div
                  className="w-full bg-gray-500 rounded p-2 mt-1 flex justify-between items-center"
                  key={line.id}
                >
                  <h3>
                    {line.title}- {line.id}
                  </h3>
                  <ChevronDown
                    onClick={() => toggleSubLine(line.id)}
                    className={`transition-transform ${
                      expandedLines[line.id] ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedLines[line.id] && (
                  <div className="w-full  rounded p-1  mt-1 flex flex-col justify-between items-center gap-2">
                    {" "}
                    <div className="w-full bg-gray-500/55 p-2 rounded">
                      <SubLine line={line.id} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(role?.toLowerCase() === "admin" ||
            role?.toLowerCase() === "fulluser") && (
            <div>
              {isAddVisible && (
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
                  <div
                    onClick={handleSaveLine}
                    className={`px-4 py-2 p-2 mb-2 rounded font-bold cursor-pointer ${
                      isFormValid
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                  >
                    +
                  </div>
                </div>
              )}
              <div onClick={() => setIsVisible(!isAddVisible)}>
                <CirclePlus
                  className={`m-2 transition-transform ${
                    isAddVisible ? "rotate-45" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Line;
