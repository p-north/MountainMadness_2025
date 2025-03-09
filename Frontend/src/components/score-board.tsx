function Score({userScore, Mode}: { userScore: number; Mode: string;}) {
    const colour = Mode === "leet-code" ? "bg-blue-400" : "bg-purple-400";
    
    return(
    <>
    <div className={`w-40 h-10 rounded-lg ${colour} flex justify-center items-center absolute top-7 right-7`}>
        <p>User Score: {userScore}</p>
    </div>
    </>
    );
}

export default Score;