import React, { FC, useEffect, useState } from "react";
import socketService from "../../../../services/socket-service";
import { useParams } from "react-router-dom";
import { Colors } from "../../../../models/Colors";


interface DisconnectionTimerProps {
  timeLeft: number;
  color : Colors
}

const DisconnectionTimer: FC<DisconnectionTimerProps> = ({ timeLeft, color }) => {
  const { gameId } = useParams<{ gameId: string }>();
  const [time, setTime] = useState<number>(Math.max(timeLeft, 0));
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      setTime((time) => Math.max(time - 1, 0));
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft]);
  

  useEffect(() => {
    if (time === 0){
      socketService.emit("timeIsUp", {color, gameId});
    }
  }, [time])


  const minutes = Math.floor(time / 60);
  const seconds = Math.floor((time % 60));
  return (
    <div className="p-2"><div className="animate-pulse py-1 px-2 rounded-lg mx-2 bg-slate-600 text-slate-50 min-w-[160px] flex justify-center">
      disconnected {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
    </div>
  );
};

export default DisconnectionTimer;
