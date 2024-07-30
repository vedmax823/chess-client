import React, { FC } from "react";
import ChessPlayer from "../../../../Components/UI/ChessPlayer";
import ChessTimer from "./timer";
import { Colors } from "../../../../models/Colors";
import DisconnectionTimer from "./DisconnectionTimer";

interface UserWithTimerProps {
  displayName: string;
  image: string;
  time: number;
  isActive: boolean;
  color : Colors;
  points: number;
  disconnected : string | null;
  timeForReconnect : number;
}

const UserWithTimer: FC<UserWithTimerProps> = ({
  displayName,
  image,
  time,
  isActive,
  points,
  color,
  disconnected,
  timeForReconnect
}) => {
  return (
    <div className="shadow-md rounded-lg border border-neutral-500 flex justify-between p-2">
      <ChessPlayer displayName={displayName} imageUrl={image} />
      <div>
        {(disconnected && isActive) ? <DisconnectionTimer timeLeft={timeForReconnect} color={color}/> : null}
      </div>
      <div className="flex">
        {(points || points === 0) && (
          <div
            className={`py-3 px-4 rounded-lg mx-2 ${
              points === 1 ? "bg-green-600 text-slate-100" : "bg-slate-300 rounded border"
            }`}
          >
            {" "}
            {points}
          </div>
        )}
        <ChessTimer timeLeft={time} isActive={isActive} color={color}/>
      </div>
    </div>
  );
};

export default UserWithTimer;
