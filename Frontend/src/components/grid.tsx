
import { useState, useEffect } from "react";


// var local_score = 1;
function Grid({difficulty,callback}: { difficulty: string; callback: Function;}) {
  
  

    let rows = 0;
    let cols = 0;
  
    if (difficulty === "easy") {
      rows = 4;
      cols = 4;
    } else if (difficulty === "medium") {
      rows = 6;
      cols = 6;
    } else if (difficulty === "hard") {
      rows = 8;
      cols = 8;
    }
  
    // 🔹 State to store randomly selected cells (Set ensures uniqueness)
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  
    // 🔹 State to track clicked cells (stores both selected & non-selected)
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
  
      if (!clickedCells.has(cellKey)) {
        setClickedCells((prev) => new Set(prev).add(cellKey)); // Mark cell as clicked


  
        if (selectedCells.has(cellKey)) {
          alert(`🎉 You found a selected cell at Row ${rowIndex + 1}, Col ${colIndex + 1}!`);
        }

        else{
          callback((prevScore: number) => prevScore + 1);
          // local_score+=1;
        }
      }
    };
  
    return (
      <div className="absolute flex justify-center items-center min-h-screen p-5 left-[50%] translate-x-[-50%]">
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
                                     ? isSelected
                                       ? "bg-red-500" // Turns red if it was randomly selected
                                       : "bg-green-500" // Turns green if it was NOT randomly selected
                                     : "bg-purple-600" // Default state before clicking
                                 }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      
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




  