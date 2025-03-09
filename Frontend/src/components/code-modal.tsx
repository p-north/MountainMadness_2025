import { Button } from '@/components/ui/button';
import { Trash } from "lucide-react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface QuizQuestion {
  id: number;
  title: string;
  description: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CodeQuizProps {
  question: QuizQuestion;
}

export function CodeQuiz({ question }: CodeQuizProps) {
  const [code, setCode] = useState(question?.code);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<string[][]>([[""]]); // Initial test case

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

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running...\n');

    try {
      let consoleOutput = '';
      const captureConsoleLog = (...args: any[]) => {
        consoleOutput += args.map(arg => JSON.stringify(arg, null, 2)).join(' ') + '\n';
      };

      // Override console.log to capture logs
      const originalConsoleLog = console.log;
      console.log = captureConsoleLog;

      // Extract function from user code
      const wrappedCode = `
        (function() {
          ${code}
          if (typeof solution !== 'function') {
            throw new Error("No function named 'solution' found. Make sure you define 'function solution(...)'.");
          }
          return solution;
        })();
      `;

      const result = eval(wrappedCode);

      // Restore console.log
      console.log = originalConsoleLog;

      if (typeof result !== 'function') {
        throw new Error("Extracted result is not a function.");
      }

      setOutput(prev => prev + 'Function defined successfully!\n' + consoleOutput);

      // Convert inputs and execute function
      testCases.forEach((testCase, i) => {
        try {
          const parsedTestCase = testCase.map(value => {
            try {
              return JSON.parse(value); // Convert JSON input
            } catch {
              return value; // Otherwise, treat as string
            }
          });

          const resultValue = result(...parsedTestCase);
          setOutput(prev => prev + `Test case ${i + 1}: ${JSON.stringify(resultValue)}\n`);
        } catch (error) {
          setOutput(prev => prev + `Test case ${i + 1} failed: ${error}\n`);
        }
      });
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <DialogContent className="max-w-[calc(100%-2rem)] h-[90vh]">
      {
        question ? <>
        <DialogHeader>
        <DialogTitle>{question.title}</DialogTitle>
        <span className={`inline-block text-sm px-2 py-1 rounded ${
          question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
        <DialogDescription>{question.description}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden h-full">

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">JavaScript</span>
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
              extensions={[javascript({ jsx: true })]}
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
          <div className="mt-4 space-y-4">
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
          <div>
            <h3 className="font-semibold mb-2">Output</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono h-48 overflow-y-auto">
              {output || 'Run your code to see the output...'}
            </pre>
          </div>
        </div>
      </div>

          </> : <DialogHeader>
        <DialogTitle>Loading...</DialogTitle>
      </DialogHeader>
      }
      
    </DialogContent>
  );
}
