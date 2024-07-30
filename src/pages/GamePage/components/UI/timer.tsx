// src/ChessTimer.tsx
import React, { useState, useEffect } from "react";
import socketService from "../../../../services/socket-service";
import { Colors } from "../../../../models/Colors";
import { useParams } from "react-router-dom";

interface ChessTimerProps {
  timeLeft: number;
  isActive: boolean;
  color : Colors
}

const ChessTimer: React.FC<ChessTimerProps> = ({ timeLeft, isActive, color }) => {
  // console.log(timeLeft)
  const { gameId } = useParams<{ gameId: string }>();
  const [playerTime, setPlayerTime] = useState<number>(Math.max(timeLeft, 0));

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // if (timeLeft !== playerTime) clearInterval(interval!);
    if (isActive) {
      interval = setInterval(() => {
        setPlayerTime((time) => Math.max(time - 1, 0));
      }, 100);
    } else clearInterval(interval!);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && playerTime === 0) {
      console.log("Time is up");
      socketService.emit("timeIsUp", {color, gameId});
    }
  }, [playerTime, isActive, gameId, color])

  useEffect(() => {
    setPlayerTime(() => Math.max(timeLeft, 0));
  }, [timeLeft, isActive]);

  const minutes = Math.floor(playerTime / 600);
  const seconds = Math.floor((playerTime % 600) / 10);
  const tenths = playerTime % 10;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center space-x-4">
        <div
          className={`p-3 rounded-lg min-w-[85px] flex justify-center text-lg text-white ${
            isActive ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          {playerTime > 600 ? (
            <span>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          ) : (
            <span>
              {minutes}:{seconds} . <span className="text-sm">{tenths}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessTimer;
