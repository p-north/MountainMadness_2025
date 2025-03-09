import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "./ui/loader";

export function BehaviorQuiz({ question, handleModals }: { question: { title: string; description: string }, handleModals: (prev?: any) => void }) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/response`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Question: question.description, 
        Answer: answer
      })
    })

    const data = await res.json();
    console.log("API Response:", data);

    const judge = data?.AI_answer?.score;
    console.log(judge)
    if (judge) {
      if (!isNaN(judge) && judge > 5) {
        handleModals((prev: any) => ({
          ...prev,
          quiz: false
        }));
      } else {
        console.log(data?.AI_answer);
        handleModals((prev: any) => ({
          ...prev,
          quiz: false,
          gameover: { description: data?.AI_answer }
        }));
      }
  }

  setIsSubmitting(false);

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

        <Button onClick={handleSubmit} className="w-full bg-blue-500 text-white" disabled={isSubmitting}>
          {isSubmitting ? <div className="w-full h-full flex justify-center items-center"><Loader className="text-white" /></div> : 'Submit Answer'}
        </Button>
      </div>
    </> : <div className="w-full h-full flex justify-center items-center"><Loader /></div>}
    </DialogContent>
  );
}
