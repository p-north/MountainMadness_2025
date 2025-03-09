import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CodeQuiz } from './code-modal'; // Ensure correct import path
import { BehaviorQuiz } from './behavior-modal';

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

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  useEffect(() => {
    const totalCells = rows * cols;
    const numSelectedCells = Math.floor(totalCells * 0.25);
    const newSelectedCells = new Set<string>();

    while (newSelectedCells.size < numSelectedCells) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      newSelectedCells.add(`${randomRow}-${randomCol}`);
    }

    setSelectedCells(newSelectedCells);
    setClickedCells(new Set());
  }, [rows, cols]);

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`;

    if (!clickedCells.has(cellKey)) {
      setClickedCells((prev) => new Set(prev).add(cellKey));

      if (selectedCells.has(cellKey)) {
        // Open modal with question data
        setCurrentQuestion({
          id: 1,
          title: 'Two Sum',
          description: 'Given an array of numbers, return indices of the two numbers that add up to a target.',
          code: `function solution(nums, target) {\n  // Your code here. Do not change the function name.\n}`,
          difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        });
        setIsModalOpen(true);
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

      {isModalOpen && currentQuestion && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild />
          {mode === 'leet-code' ? <CodeQuiz question={currentQuestion} /> : <BehaviorQuiz question={currentQuestion} />}
        </Dialog>
      )}
    </div>
  );
}

export default Grid;
