import { createContext, ReactNode, useContext, useState } from "react";

interface ScoreContextType {
    score: number; 
    setScore: React.Dispatch<React.SetStateAction<number>>; 
}

// export const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

interface ScoreContextProviderProps {
    children: ReactNode; 
};

export const ScoreContext = createContext<ScoreContextType>({
    score: 0,
    setScore: () => {}, 
});

export function ScoreContextProvider({children}: ScoreContextProviderProps){
    const [score, setScore] = useState<number>(0);

    return(
        <ScoreContext.Provider value={{score, setScore}}>
            {children}
        </ScoreContext.Provider>
    )
};

export function useScore() {
    return useContext(ScoreContext);
};

