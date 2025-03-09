import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BehaviorQuiz({ question }: { question: { title: string; description: string } }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    console.log("Submitted Answer:", answer);
    alert("Your answer has been submitted!");
  };

  return (
    <DialogContent className="max-w-[calc(100%-2rem)] h-[60vh]">
      {question ? <>
        <DialogHeader>
        <DialogTitle>{question.title}</DialogTitle>
        <DialogDescription>{question.description}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col space-y-4">
        <label className="text-sm font-medium text-gray-700">Your Answer</label>
        <textarea
          className="w-full h-40 p-3 border rounded-md text-sm"
          placeholder="Write your response here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full bg-blue-500 text-white">
          Submit Answer
        </Button>
      </div>
    </> : <div>Loading...</div>}
    </DialogContent>
  );
}
