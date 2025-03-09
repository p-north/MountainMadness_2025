import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CodeQuiz } from './code-modal'; // Ensure correct import path
import { BehaviorQuiz } from './behavior-modal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useScore } from '@/util/score-context';
import { Link, useNavigate } from 'react-router';
import { Loader } from './ui/loader';

function Grid({
  difficulty,
  mode,
  callback,
}: {
  difficulty: string;
  mode: string;
  callback: Function;
}) {
  const navigate = useNavigate();
  const { score, setScore } = useScore();

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
  const [isModalOpen, setIsModalOpen] = useState<{
    quiz: boolean;
    confirm: boolean;
    gameover: boolean | { description: string };
  }>({
    quiz: false,
    confirm: false,
    gameover: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Handle cell click
    const handleCellClick = (rowIndex: number, colIndex: number) => {
      const cellKey = `${rowIndex}-${colIndex}`;
  
      if (!clickedCells.has(cellKey)) {
        setClickedCells((prev) => {
          const newClickedCells = new Set(prev).add(cellKey);
  
          // Check if all cells have been clicked
          if (newClickedCells.size === rows * cols) {
            setIsModalOpen({
              quiz: false,
              confirm: false,
              gameover: { description: "Congratulations! You clicked all tiles!" },
            });
          }
  
          return newClickedCells;
        });
  
        if (selectedCells.has(cellKey)) {
          // Open modal with question data
          if (mode === 'behavior') {
            console.log('Hello');
            fetch(`${import.meta.env.VITE_SERVER_URL}/questions/behaviour/${difficulty}`)
              .then((response) => response.json())
              .then((data) => {
                setCurrentQuestion({
                  title: 'Behavioral Questions',
                  description: data.question,
                });
              });
  
            setIsModalOpen((prev) => ({
              ...prev,
              quiz: true,
            }));
          } else {
            console.log('data fetching..');
  
            fetch(`${import.meta.env.VITE_SERVER_URL}/questions/leetcode/${difficulty}`)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
  
                const question = data.question;
                setCurrentQuestion({
                  title: question.title,
                  description: question.description,
                  difficulty,
                  code: `def solution():\n  # Your code here. Do not change the function name.`,
                });
              });
          }
  
          setIsModalOpen((prev) => ({
            ...prev,
            quiz: true,
          }));
        }
        callback((prevScore: number) => prevScore + 1);
      }
    };
  

  const quizDialogHandler = (open: boolean) => {
    if (!open) {
      setIsModalOpen((prev) => ({
        ...prev,
        quiz: true,
        confirm: true,
      }));
    }
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    if (name === '') {
      alert('Enter your name');
      return;
    } else if (mode === 'leet-code') {
      setIsSubmitting(true);
      //Send name to leet-code leader board
      fetch(`${import.meta.env.VITE_SERVER_URL}/leaderboard/leetcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          score: score,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));

      navigate('/');
      setIsSubmitting(false);
      return;
    } else {
      //Send name to behavior leader board

      fetch(
        `${import.meta.env.VITE_SERVER_URL}/leaderboard/${
          mode === 'behavior' ? 'behaviour' : 'leetcode'
        }`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            score: score,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));

      navigate('/');
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <div
        className={`w-full max-w-[640px] p-4 grid gap-4 border ${
          mode === 'leet-code' ? 'border-blue-300' : 'border-purple-500'
        }`}
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
                      : mode === 'leet-code'
                      ? 'bg-blue-400'
                      : 'bg-purple-600'
                  }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            ></div>
          );
        })}
      </div>

      {isModalOpen.quiz && (
        <Dialog open={isModalOpen.quiz} onOpenChange={quizDialogHandler}>
          <DialogTrigger asChild />
          {mode === 'leet-code' ? (
            <CodeQuiz question={currentQuestion} handleModals={setIsModalOpen} />
          ) : (
            <BehaviorQuiz question={currentQuestion} handleModals={setIsModalOpen} />
          )}
        </Dialog>
      )}

      {isModalOpen.confirm && (
        <Dialog
          open={isModalOpen.confirm}
          onOpenChange={(open) => {
            if (!open) {
              setIsModalOpen((prev) => ({ ...prev, confirm: false }));
            }
          }}
        >
          <DialogTrigger asChild />
          <DialogContent hideX={true} className="max-w-md">
            <DialogHeader>
              <DialogTitle>Are you sure you want to end the game?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between gap-2">
              <Button
                variant="ghost"
                className="w-1/2"
                onClick={() => {
                  setIsModalOpen((prev) => ({ ...prev, confirm: false }));
                }}
              >
                No
              </Button>

              <Button
                onClick={() => {
                  setIsModalOpen({ quiz: false, confirm: false, gameover: true });
                }}
                className="w-1/2"
              >
                Yes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isModalOpen.gameover && (
        <Dialog open={!!isModalOpen.gameover}>
          <DialogTrigger asChild />
          <DialogContent className="max-w-3xl" hideX={true}>
            <DialogHeader>
              <DialogTitle>Gameover</DialogTitle>
              <p className="text-center">Your score: {score}</p>
              {typeof(isModalOpen.gameover) !== 'boolean' && isModalOpen.gameover?.description && (
                <p className="text-center">{isModalOpen.gameover?.description}</p>
              )}
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-2">
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <Loader />
                  </div>
                ) : (
                  'Submit'
                )}
              </Button>
              <Link to="/">
                <Button className="w-full" variant="ghost" type="button">
                  Close without ranking registration
                </Button>
              </Link>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Grid;
