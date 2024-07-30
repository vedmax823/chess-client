import React, { FC, useState } from "react";
import { Player } from "../../../models/Player";
import useStore from "../../../store/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import socketService from "../../../services/socket-service";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

interface DrawResignComponentProps {
  whitePlayer: Player;
  blackPlayer: Player;
  drawProposed: Player | null;
  gameId: string;
}

const DrawResignComponent: FC<DrawResignComponentProps> = ({
  whitePlayer,
  blackPlayer,
  drawProposed,
  gameId,
}) => {
  const [resign, setResign] = useState(false);
  const user = useStore((state) => state.user);
  function proposeDraw(player: Player) {
    socketService.emit("proposeDraw", { gameId, player });
  }

  function declineDraw() {
    socketService.emit("declineDraw", gameId);
  }

  function acceptDraw() {
    socketService.emit("acceptDraw", gameId);
  }

  function resignGame(){
    setResign(false);
    socketService.emit("resign", gameId);
  }

  if (resign) return (<div className="flex justify-around border rounded-lg p-2 mx-4 ">
    
      <div>
        Do you really want to resign?
        <button
          className="bg-red-500 px-3 py-2 rounded-lg text-cyan-50 m-3"
          onClick={() => setResign(false)}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        <button
          className="bg-green-600 py-2 px-3 text-cyan-50 rounded-lg"
          onClick={resignGame}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>)

  return (
    <React.Fragment>
      {user && drawProposed && drawProposed.user ? (
        <div className="flex justify-around border rounded-lg p-2 mx-4 ">
          
            <React.Fragment>
              {drawProposed.user.id === user.id ? (
                <div>
                  You proposed a draw
                  <button
                    className="bg-red-500 px-3 py-2 rounded-lg text-cyan-50 m-3"
                    onClick={declineDraw}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              ) : (
                <div>
                  {drawProposed.user.displayName} proposed draw
                  <button
                    className="bg-red-500 px-3 py-2 rounded-lg text-cyan-50 m-3"
                    onClick={declineDraw}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                  <button
                    className="bg-green-600 py-2 px-3 text-cyan-50 rounded-lg"
                    onClick={acceptDraw}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              )}
            </React.Fragment>
          
        </div>
      ) : user ? (
        <div className="flex justify-around border rounded-lg p-2 mx-4">
          <button
            className="p-3 border rounded-lg"
            onClick={() =>
              proposeDraw(
                user.id === whitePlayer.user!.id ? whitePlayer : blackPlayer
              )
            }
          >
            {/* <FontAwesomeIcon icon={faFlag} /> */}
            1/2-1/2
          </button>
          <button
            className="p-3 border rounded-lg"
            onClick={() => setResign(true)}
          >
            Resign <FontAwesomeIcon icon={faFlag} />
          </button>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default DrawResignComponent;
