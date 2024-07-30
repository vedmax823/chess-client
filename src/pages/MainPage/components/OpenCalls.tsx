import React, { useEffect, useState } from "react";
import useStore from "../../../store/useUser";
import { getOpenCalls } from "../../../actions/gameActions";
import socketService from "../../../services/socket-service";
import { useNavigate } from "react-router-dom";

const onJoin = (id: string) => {
  try {
    socketService.emit<string>("joinGame", id);
  } catch (e) {
    console.log("not success");
  }
};

const OpenCalls = () => {
  
  const user = useStore((state) => state.user);

  const [openCalls, setOpenCalls] = React.useState<OpenCall[]>([]);
  const navigate = useNavigate();
  const fetchUser = useStore(state => state.fetchUser)

  useEffect(() => {
    socketService.connect();

    try {
      getOpenCalls()
        .then((data) => {
          console.log(data);
          setOpenCalls(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.log("not success");
    }

    socketService.on("disconnect", () => {
      fetchUser();
    });

    const handleNewCalls = (newOpenCall: OpenCall) => {
      // console.log("new open call", newOpenCall);
      setOpenCalls((prevOpenCalls) => [...prevOpenCalls, newOpenCall]);
    };

    const handleDeleteGames = (arrId: string[]) => {
      setOpenCalls((prevOpenCalls) =>
        prevOpenCalls.filter((call) => !arrId.includes(call.id))
      );
    };

    socketService.on("gameStarted", (game: Game) => {
      const newPath = `/live/${game.id}`;
      navigate(newPath);
    });

    socketService.on("newGame", handleNewCalls);
    socketService.on("deletedGames", handleDeleteGames);

    return () => {
      // socketService.off('newGame', handleNewCalls)
      // socketService.off('deletedGames', handleDeleteGames)
      socketService.disconnect();
    };
  }, []);

  console.log(user?.id);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-chessGreen mb-4">
        Open Calls
      </h2>
      <table className="min-w-full bg-chessBrown text-chessGreen">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">User Name</th>
            <th className="py-2 px-4 border-b text-left">Time Control</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {openCalls.map((call) => (
            <tr key={call.id}>
              <td className="py-2 px-4 border-b">
                {call.playerOne.displayName}
              </td>
              <td className="py-2 px-4 border-b">{call.timeControl}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onJoin(call.id)}
                  className="bg-chessGreen text-chessLight px-4 py-2 rounded hover:bg-chessDark transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={user?.id === call.playerOne.id}
                >
                  Join
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenCalls;
