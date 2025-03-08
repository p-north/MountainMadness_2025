import { useEffect } from "react";

function Noise({speed}: {speed:number;}) {

    
    useEffect(()=>{
        var audio = new Audio ("/assets/suspense-horror.mp3");
        audio.playbackRate = speed ;
        audio.loop = true;
        audio.play();
    }
        
        
        
        ,[]);

    return null;
}

export default Noise;