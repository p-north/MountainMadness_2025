import { Button } from '@/components/ui/button';
import { Trash, Play } from "lucide-react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useState } from 'react';
import { Loader } from './ui/loader';

const loadPyodide = async () => {
  const pyodideModule = await import("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs");
  return await pyodideModule.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
  });
};







interface QuizQuestion {
  id: number;
  title: string;
  description: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CodeQuizProps {
  question: QuizQuestion;
  handleModals: (prev?: any) => void;
}

export function CodeQuiz({ question, handleModals }: CodeQuizProps) {

  // fetch(`${import.meta.env.VITE_SERVER_URL}/audio`,{
  //   method: "POST",
  //   headers:{
  //     "Content-Type" : "application/json"
  //   }
  //   })
  //   .then(response => response.json() )
  //   .then(data => (console.log(data)));

  const [code, setCode] = useState(question?.code || '');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<string[][]>([]); // Initial test case
  const [pyodide, setPyodide] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCode(question?.code);
  }, [question?.code])

  useEffect(() => {
    async function initializePyodide() {
      console.log('loading py');
      const py = await loadPyodide();
      console.log('loaded', py);
      setPyodide(py);
    }
    initializePyodide();
  }, []);

  const handleTestCaseChange = (index: number, paramIndex: number, value: string) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][paramIndex] = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, [""]]); // Adds a new empty test case
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index)); // Properly updates state
    }
  };

  const addParameter = (index: number) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index].push(""); // Adds a new parameter
    setTestCases(updatedTestCases);
  };

  const removeParameter = (testCaseIndex: number, paramIndex: number) => {
    const updatedTestCases = [...testCases];
    if (updatedTestCases[testCaseIndex].length > 1) {
      updatedTestCases[testCaseIndex].splice(paramIndex, 1); // Removes parameter
      setTestCases(updatedTestCases);
    }
  };

  const runCode = async () => {
    if (!pyodide) {
      setOutput("Pyodide is still loading. Please wait...");
      return;
    }

    setIsRunning(true);
    setOutput('Running...\n');

    try {
      // Define the function and capture output
      const wrappedCode = `
import sys
from io import StringIO

original_stdout = sys.stdout
sys.stdout = StringIO()

${code}

if 'solution' not in globals():
    raise NameError("No function named 'solution' found. Define 'def solution(...):'")

output = sys.stdout.getvalue()
sys.stdout = original_stdout
      `;

      await pyodide.runPythonAsync(wrappedCode);

      const functionExists = await pyodide.runPythonAsync("'solution' in globals()");
      if (!functionExists) {
        throw new Error("No function named 'solution' found.");
      }

      const consoleOutput = await pyodide.runPythonAsync("output");

      setOutput(prev => prev + 'Function defined successfully!\n' + consoleOutput);

      // Convert inputs and execute function
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const parsedTestCase = testCase.map(value => {
          try {
            return JSON.parse(value); // Convert JSON input
          } catch {
            return value; // Otherwise, treat as string
          }
        });

        const pythonTestCase = `solution(*${JSON.stringify(parsedTestCase)})`;

        try {
          const resultValue = await pyodide.runPythonAsync(pythonTestCase);
          setOutput(prev => prev + `Test case ${i + 1}: ${resultValue}\n`);
        } catch (error) {
          setOutput(prev => prev + `Test case ${i + 1} failed: ${error}\n`);
        }
      }
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const submitHandler = async () => {
    setIsSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/response`, {
      method: 'POST',
      body: JSON.stringify({
        Question: question.description, 
        Answer: code 
      })
    })

    const data = await res.json();
    const judge = data?.AI_answer?.split('/10') || [];
    if (judge.length) {
      const score = parseInt(judge[0].slice(judge[0].length - 2, judge[0].length));
      if (!isNaN(score) && score > 5) {
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
  }

  return (
    <DialogContent className={`max-w-[calc(100%-2rem)] h-[90vh] ${question ? 'flex flex-col justify-between': ''}`}>
      {
        question ? <>
        <DialogHeader>
        <DialogTitle>{question.title}</DialogTitle>
        <span className={`capitalize inline-block text-sm px-2 py-1 rounded ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
        <DialogDescription>{question.description}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden h-full">

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Python</span>
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Run Code
            </Button>
          </div>

          <div className="flex-1 overflow-hidden rounded-lg">
            <CodeMirror
              value={code}
              height="100%"
              theme={oneDark}
              extensions={[python()]}
              onChange={(value) => setCode(value)}
              className="h-full overflow-auto"
              basicSetup={{
                lineNumbers: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                autocompletion: true,
              }}
            />
          </div>

          {/* Dynamic Test Case Input UI */}
            <div className="mt-4 space-y-4 max-h-[240px] overflow-y-scroll">
              <h3 className="font-semibold">Test Cases</h3>
              {testCases.map((testCase, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {testCase.map((param, paramIndex) => (
                    <div key={paramIndex} className="relative">
                      <input
                        className="w-24 p-2 border rounded-md text-sm pr-6"
                        placeholder={`Param ${paramIndex + 1}`}
                        value={param}
                        onChange={(e) => handleTestCaseChange(index, paramIndex, e.target.value)}
                      />
                      {paramIndex !== 0 && <button
                        onClick={() => removeParameter(index, paramIndex)}
                        className="absolute right-2 top-[50%] translate-y-[-50%] text-red-400 text-xs font-bold"
                      >
                        ✕
                      </button>}
                    </div>
                  ))}
                  <Button onClick={() => addParameter(index)} className="px-2 py-1 text-xs">+ Param</Button>
                  {testCases.length > 1 && <button onClick={() => removeTestCase(index)} className="cursor-pointer text-gray-500">
                    <Trash className="h-5 w-5" />
                  </button>}
                </div>
              ))}
              <Button onClick={addTestCase} className="px-2 py-1 text-xs bg-blue-500 text-white">+ Add Test Case</Button>
            </div>
          </div>

          <div className="overflow-y-auto space-y-4">
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono h-48 overflow-y-auto">
              {output || 'Run your code to see the output...'}
            </pre>
          </div>
        </div>

        <Button type="submit" onClick={submitHandler}>
        {isSubmitting ? <div className="w-full h-full flex justify-center items-center"><Loader className="text-white" /></div> : 'Submit'}
        </Button>
          </> : <DialogHeader>
          <DialogTitle className="w-full h-full flex justify-center items-center"><Loader /></DialogTitle>
      </DialogHeader>
      }
      
    </DialogContent>
  );
}
