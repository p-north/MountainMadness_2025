function Score({userScore, Mode}: { userScore: number; Mode: string;}) {


    var colour;

    if(Mode == "leet-code"){
        colour = "purple"; 
    }

    else{
        colour = "blue";
    }
    return(<div style={{backgroundColor:colour}} className="w-40 h-40 rounded-lg">
        <p>User Score: {userScore}</p>
    </div>);
    

}

export default Score;