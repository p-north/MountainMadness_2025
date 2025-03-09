import { useState, useEffect } from 'react';

function Grid({ difficulty, mode, callback }: { difficulty: string; mode: string; callback: Function }) {
  let rows = 0;
  let cols = 0;

  if (difficulty === 'easy') {
    rows = 4;
    cols = 4;
  } else if (difficulty === 'medium') {
    rows = 6;
    cols = 6;
  } else if (difficulty === 'hard') {
    rows = 8;
    cols = 8;
  }

  // State to store randomly selected cells
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  // State to track clicked cells
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const totalCells = rows * cols;
    const numSelectedCells = Math.floor(totalCells * 0.25); // 25% of the grid
    const newSelectedCells = new Set<string>();

    while (newSelectedCells.size < numSelectedCells) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      newSelectedCells.add(`${randomRow}-${randomCol}`);
    }

    setSelectedCells(newSelectedCells);
    setClickedCells(new Set()); // Reset clicked cells when difficulty changes
  }, [rows, cols]);

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;

    if (!clickedCells.has(cellKey)) {
      setClickedCells((prev) => new Set(prev).add(cellKey));

      if (selectedCells.has(cellKey)) {
        alert(`🎉 You found a selected cell at Row ${rowIndex + 1}, Col ${colIndex + 1}!`);
      } else {
        callback((prevScore: number) => prevScore + 1);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div
        className={`w-full max-w-[640px] p-4 grid gap-4 border ${mode === 'leet-code' ? 'border-blue-300' : 'border-purple-500'}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const rowIndex = Math.floor(index / cols);
          const colIndex = index % cols;
          const cellKey = `${rowIndex}-${colIndex}`;
          const isSelected = selectedCells.has(cellKey);
          const isClicked = clickedCells.has(cellKey);

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ease-in-out cursor-pointer
                  ${
                    isClicked
                      ? isSelected
                        ? 'bg-red-500' // Selected cell clicked
                        : 'bg-green-500' // Wrong cell clicked
                      : mode === 'leet-code' ? 'bg-blue-400' : 'bg-purple-600'
                  }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default Grid;
