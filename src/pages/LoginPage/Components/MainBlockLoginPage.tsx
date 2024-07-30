import React, { useEffect, useState } from "react";
import { Board } from "../../../models/Board";
import BoardShow from "./BoardShow";
import { Colors } from "../../../models/Colors";
import { Player } from "../../../models/Player";
import MovesComponent from "../../GamePage/components/MovesComponent";
import { startPosition } from "../../../helpers/constants";

const MainBlockLoginPage = () => {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player>(whitePlayer);
  const [moves, setMoves] = useState<MoveFromBack[]>([startPosition]);
  const [result, setResult] = useState<number[] | null>(null);
  const [showedMove, setShowedMove] = useState<ShowedMove>({
    index: 0,
    isPossitionBlocked: false,
  });
  const [currentPosition, setCurrentPosition] = useState<CurrentPositionType>({
    currentPosition: null,
    lastMove: null,
  });

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (!currentPosition.currentPosition) return;
    const newBoard = new Board();
    newBoard.init_cells();
    newBoard.addFiguresFromPosition(currentPosition.currentPosition);
    newBoard.setLastMove(currentPosition.lastMove || "");
    setBoard(newBoard);
  }, [currentPosition]);

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }

  function startNewGame() {
    const newBoard = new Board();
    newBoard.init_cells();
    newBoard.addFigures();
    setBoard(newBoard);
  }

  function createResult(result: string, color: Colors) {
    if (result === "mate") {
      setResult(color === Colors.WHITE ? [1, 0] : [0, 1]);
    }
    if (result === "draw") {
      setResult([0.5, 0.5]);
    }
  }

  function deleteResult() {
    setResult(null);
  }

  function addMove(move: MoveFromBack) {
    if (showedMove.index === moves.length - 1) {
      setMoves([...moves, move]);
      setShowedMove({ index: moves.length, isPossitionBlocked: false });
    } else {
      setMoves(moves.slice(0, showedMove.index + 1).concat([move]));
      setShowedMove({ index: showedMove.index + 1, isPossitionBlocked: false });
    }
    setCurrentPosition({
      currentPosition: move.position,
      lastMove: move.move,
    });
  }

  function changeWatchedPosition(index: number) {
    setShowedMove({ index, isPossitionBlocked: false });
    setCurrentPosition({
      currentPosition: moves[index].position,
      lastMove: moves[index].move,
    });
    index % 2 === 0
      ? setCurrentPlayer(whitePlayer)
      : setCurrentPlayer(blackPlayer);
  }

  return (
    <div className="w-full flex flex-wrap justify-center">
      <div className="w-full xl:w-3/5 flex justify-center py-10 px-2">
        <BoardShow
          board={board}
          swapPlayer={swapPlayer}
          currentPlayer={currentPlayer}
          setBoard={setBoard}
          addMove={addMove}
          createResult={createResult}
          deleteResult={deleteResult}
          isFinished={result}
        />
      </div>
      <div className="py-10 w-full xl:w-2/5 px-4">
        <div className="flex justify-around w-full ml-8 xl:ml-0">
          <div
            className={`flex items-center justify-around p-2 border rounded-lg w-5/12 ${
              currentPlayer.color === whitePlayer.color
                ? ` ring ring-lime-600`
                : ``
            }`}
          >
            <div className="text-lg font-medium">White</div>
            {result ? (
              <div
                className={`px-3 py-2 border rounded-lg ${
                  result[0] === 1 ? "bg-green-500" : "bg-slate-200"
                }`}
              >
                {result[0]}
              </div>
            ) : null}
          </div>
          <div
            className={`flex items-center justify-around p-2 border rounded-lg w-5/12 ${
              currentPlayer.color === blackPlayer.color
                ? ` ring ring-lime-600`
                : ``
            }`}
          >
            <div className="text-lg font-medium">Black</div>
            {result ? (
              <div
                className={`px-3 py-2 border rounded-lg ${
                  result[1] === 1 ? "bg-green-500" : "bg-slate-200"
                }`}
              >
                {result[1]}
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-full ml-8 xl:ml-0">
          <MovesComponent
            moves={moves}
            currentMove={showedMove.index}
            changeWatchedPosition={changeWatchedPosition}
          />
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">How to make a move</h2>
          <p className="text-gray-700">
            Click on the piece to see the possible moves. Then select the
            desired square for the move. Unfortunately, the drag-and-drop
            function is still in development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainBlockLoginPage;
