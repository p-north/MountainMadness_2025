import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css';
import Board from './pages/Board.tsx';
import Landing, { loader as LeaderboardLoader } from './pages/Landing.tsx';
import RootLayout from './pages/RootLayout.tsx';
import { ScoreContextProvider } from './util/score-context.tsx';

// const ScoreContext = createContext<number>(0); 
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{
      index: true,
      element: <Landing />,
      loader: LeaderboardLoader
    },
    {
      path: "leet-code",
      children: [
        {
          path: "easy",
          element: <Board />, 
        },
        {
          path: "medium",
          element: <Board />
        },
        {
          path: "hard",
          element: <Board />
        }
      ]
    },
    {
      path: "behavior",
      children: [
        {
          path: "easy",
          element: <Board />
        },
        {
          path: "medium",
          element: <Board />
        },
        {
          path: "hard",
          element: <Board />
        }
      ]
    },
  ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScoreContextProvider>
      <RouterProvider router={router} />
    </ScoreContextProvider>
  </StrictMode>,
)
