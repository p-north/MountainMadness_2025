
import { useState, useEffect } from "react";

function Grid({difficulty}: { difficulty: string;}) {

    let rows = 0;
  let cols = 0;

  if (difficulty === "Easy") {
    rows = 4;
    cols = 4;
  } else if (difficulty === "Medium") {
    rows = 6;
    cols = 6;
  } else if (difficulty === "Hard") {
    rows = 8;
    cols = 8;
  }

  // 🔹 State to store randomly selected cells (Set ensures uniqueness)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  // 🔹 State to track which selected cells have been clicked
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());

  // 🔹 Generate random cells when the component mounts
  useEffect(() => {
    const totalCells = rows * cols;
    const numSelectedCells = Math.floor(totalCells * 0.25); // 25% of the grid

    const newSelectedCells = new Set<string>();
    while (newSelectedCells.size < numSelectedCells) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      newSelectedCells.add(`${randomRow}-${randomCol}`); // Store as "row-col"
    }
    setSelectedCells(newSelectedCells);
    setClickedCells(new Set()); // Reset clicked cells when difficulty changes
  }, [rows, cols]); // Runs when grid size changes

  // 🔹 Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;

    if (selectedCells.has(cellKey) && !clickedCells.has(cellKey)) {
      alert(`🎉 You found a selected cell at Row ${rowIndex + 1}, Col ${colIndex + 1}!`);
      setClickedCells((prev) => new Set(prev).add(cellKey)); // Mark cell as clicked
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-5">
      <table className="border-separate border-spacing-4 border border-purple-500">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: cols }).map((_, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.has(cellKey);
                const isClicked = clickedCells.has(cellKey);

                return (
                  <td
                    key={colIndex}
                    className={`w-20 h-20 border border-purple-800 text-white text-center font-bold text-lg transition-all duration-300 ease-in-out cursor-pointer 
                               ${
                                 isClicked
                                   ? "bg-red-500" // Turns red when clicked
                                   : isSelected
                                   ? "bg-purple-600" // Randomly selected but unclicked
                                   : "bg-purple-600" // Not randomly selected
                               }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {rowIndex * cols + colIndex + 1}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
    }
      

  export default Grid;




  