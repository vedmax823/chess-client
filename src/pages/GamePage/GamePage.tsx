import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BoardComponent from "./components/BoardComponent";
import { Board } from "../../models/Board";
import { Player } from "../../models/Player";
import { Colors } from "../../models/Colors";
import socketService from "../../services/socket-service";
import MovesComponent from "./components/MovesComponent";
import useStore from "../../store/useUser";
import DrawResignComponent from "./components/DrawResignComponent";
import { startPosition } from "../../helpers/constants";

const GamePage = () => {
  const user = useStore((state) => state.user);
  const { gameId } = useParams<{ gameId: string }>();
  const [board, setBoard] = useState(new Board());
  const [drawProposed, setDrawProposed] = useState<Player | null>(null);
  const [gameResult, setGameResult] = useState<GameResult>({
    isFinished: true,
    pointsBlack: 0,
    pointsWhite: 0,
  });

  const fetchUser = useStore(state => state.fetchUser);
  const logout = useStore(store => store.logout)
  const [currentPosition, setCurrentPosition] = useState<CurrentPositionType>({
    currentPosition: null,
    lastMove: null,
  });

  const [whitePlayer, setWhitePlayer] = useState<Player>(
    new Player(Colors.WHITE)
  );
  const [blackPlayer, setBlackPlayer] = useState<Player>(
    new Player(Colors.BLACK)
  );
  const [whitePlayerTime, setWhitePlayerTime] = useState<number>(0);
  const [blackPlayerTime, setBlackPlayerTime] = useState<number>(0);

  const [disconnection, setDisconnection] = useState<DisconnectionType>({
    whiteUserDisconnectedAt: null,
    blackUserDisconnectedAt: null,
    timeLeftBlackToReconnect: 0,
    timeLeftWhiteToReconnect: 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);
  const [moves, setMoves] = useState<MoveFromBack[]>([startPosition]);
  const [showedMove, setShowedMove] = useState<ShowedMove>({
    index: 0,
    isPossitionBlocked: false,
  });

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }

  function changeWatchedPosition(index: number) {
    setShowedMove({ index, isPossitionBlocked: moves.length - 1 > index });
    setCurrentPosition({
      currentPosition: moves[index].position,
      lastMove: moves[index].move,
    });
  }

  function startNewGame() {
    const newBoard = new Board();
    newBoard.init_cells();
    newBoard.addFigures();
    setBoard(newBoard);
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getGameAndUpdate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startNewGame();
    setCurrentPlayer(whitePlayer);
    getGameAndUpdate();

    // !!!! TODO :
    // REMOVE LISTENERS
    return () => {
      // socketService.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function updateGame(game: Game) {
    if (game.playerOne.id === game.gameDetails.whiteUserId) {
      setWhitePlayer(new Player(Colors.WHITE, game.playerOne));
      setBlackPlayer(new Player(Colors.BLACK, game.playerTwo));
    } else {
      setWhitePlayer(new Player(Colors.WHITE, game.playerTwo));
      setBlackPlayer(new Player(Colors.BLACK, game.playerOne));
    }
    setGameResult({
      isFinished: game.ifFinished,
      pointsBlack: game.gameDetails.pointsBlack,
      pointsWhite: game.gameDetails.pointsWhite,
    });
    const lastMove = game.gameDetails.moves
      ? game.gameDetails.moves[game.gameDetails.moves.length - 1].move
      : "";
    setMoves(game.gameDetails.moves || [startPosition]);
    setCurrentPosition({
      currentPosition: game.gameDetails.currentPosition,
      lastMove,
    });

    setDrawProposed(() =>
      game.gameDetails.drawProposed
        ? game.gameDetails.drawProposed === whitePlayer.color
          ? whitePlayer
          : blackPlayer
        : null
    );

    setShowedMove({
      index: game.gameDetails.moves ? game.gameDetails.moves.length - 1 : 0,
      isPossitionBlocked: false,
    });
    setDisconnection({
      whiteUserDisconnectedAt: game.gameDetails.whiteUserDisconnectedAt,
      blackUserDisconnectedAt: game.gameDetails.blackUserDisconnectedAt,
      timeLeftBlackToReconnect: game.gameDetails.timeLeftBlackToReconnect,
      timeLeftWhiteToReconnect: game.gameDetails.timeLeftWhiteToReconnect,
    });

    setCurrentPlayer(() =>
      whitePlayer.color === game.gameDetails.turn ? whitePlayer : blackPlayer
    );
    setBlackPlayerTime(game.gameDetails.timeLeftBlack);
    setWhitePlayerTime(game.gameDetails.timeLeftWhite);
  }

  function getGameAndUpdate() {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/game/created/${gameId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const game: Game = res.data;
        updateGame(game);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  useEffect(() => {
    setCurrentPlayer(
      whitePlayer.color === currentPlayer.color ? whitePlayer : blackPlayer
    );
    if (whitePlayer.user && blackPlayer.user) {
      if (!socketService.socket || !socketService.socket.connected) {
        socketService.connect();
      }

      socketService.emit("joinToWatch", gameId);

      socketService.on('disconnect', () => {
          fetchUser()
      });

      const handleMove = (gameDetails: GameDetails) => {
        // console.log(gameDetails);
        const lastMove = gameDetails.moves
          ? gameDetails.moves[gameDetails.moves.length - 1].move
          : "";
        setCurrentPosition({
          currentPosition: gameDetails.currentPosition,
          lastMove,
        });
        setMoves(gameDetails.moves || [startPosition]);
        setShowedMove({
          index: gameDetails.moves ? gameDetails.moves.length - 1 : 0,
          isPossitionBlocked: false,
        });

        setDrawProposed(() =>
          gameDetails.drawProposed
            ? gameDetails.drawProposed === Colors.WHITE
              ? whitePlayer
              : blackPlayer
            : null
        );
        setCurrentPlayer(
          whitePlayer.color === gameDetails.turn ? whitePlayer : blackPlayer
        );
        setBlackPlayerTime(gameDetails.timeLeftBlack);
        setWhitePlayerTime(gameDetails.timeLeftWhite);
        setDisconnection({
          whiteUserDisconnectedAt: gameDetails.whiteUserDisconnectedAt,
          blackUserDisconnectedAt: gameDetails.blackUserDisconnectedAt,
          timeLeftBlackToReconnect: gameDetails.timeLeftBlackToReconnect,
          timeLeftWhiteToReconnect: gameDetails.timeLeftWhiteToReconnect,
        });
      };

      const handleDraw = (color: Colors) => {
        setDrawProposed(color === Colors.WHITE ? whitePlayer : blackPlayer);
      };

      const handleDeclineDraw = (isDeclined: boolean) => {
        if (isDeclined) {
          setDrawProposed(null);
        }
      };

      const finishGame = (game: Game) => {
        updateGame(game);
        socketService.off("move", handleMove);
        socketService.off("gameResult", updateGame);
        socketService.off("drawDeclined", handleDraw);
        socketService.off("declineDraw", handleDeclineDraw);
      };

      socketService.on("move", handleMove);
      socketService.on("gameResult", finishGame);
      socketService.on("drawDeclined", handleDeclineDraw);
      socketService.on("drawProposed", handleDraw);
    }

    return () => socketService.disconnect();
  }, [whitePlayer, blackPlayer]);

  useEffect(() => {
    if (!currentPosition.currentPosition) return;
    const newBoard = new Board();
    newBoard.init_cells();
    newBoard.addFiguresFromPosition(currentPosition.currentPosition);
    newBoard.setLastMove(currentPosition.lastMove || "");
    setBoard(newBoard);
  }, [currentPosition]);

  if (!gameId) return <>Not Found</>;

  return (
    <>
      <div className="p-2 mt-8 lg:mt-0">
        <div className="flex w-full flex-col lg:flex-row">
          <div className="w-full flex flex-col items-center ">
            <BoardComponent
              gameResult={gameResult}
              gameId={gameId}
              board={board}
              setBoard={setBoard}
              currentPlayer={currentPlayer}
              swapPlayer={swapPlayer}
              whitePlayer={whitePlayer}
              blackPlayer={blackPlayer}
              whitePlayerTime={whitePlayerTime}
              blackPlayerTime={blackPlayerTime}
              isBlocked={showedMove.isPossitionBlocked}
              disconnection={disconnection}
            />
          </div>
          <div className="w-full lg:w-3/4">
            {!gameResult.isFinished &&
              user &&
              whitePlayer.user &&
              blackPlayer.user &&
              (whitePlayer.user.id === user.id ||
                blackPlayer.user.id === user.id) && (
                <DrawResignComponent
                  gameId={gameId}
                  whitePlayer={whitePlayer}
                  blackPlayer={blackPlayer}
                  drawProposed={drawProposed}
                />
              )}

            <MovesComponent
              moves={moves}
              changeWatchedPosition={changeWatchedPosition}
              currentMove={showedMove.index}
            />
            {!gameResult.isFinished &&<div className="bg-yellow-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">How to make a move</h2>
              <p className="text-gray-700">
                Click on the piece to see the possible moves. Then select the
                desired square for the move. Unfortunately, the drag-and-drop
                function is still in development.
              </p>
            </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
