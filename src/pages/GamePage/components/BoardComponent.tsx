import React, { useState, useEffect, FC } from "react";
import { Board } from "../../../models/Board";
import { Cell } from "../../../models/Cell";
import CellComponent from "./CellComponent";
import { Player } from "../../../models/Player";
import { FigureNames } from "../../../models/Figure";
import { createMoveAnotationAndPosition } from "../../../helpers/createMove";
import socketService from "../../../services/socket-service";
import useStore from "../../../store/useUser";
import UserWithTimer from "./UI/UserWithTimer";
import { Colors } from "../../../models/Colors";
import { Figure } from "../../../models/Figure";
import { Queen } from "../../../models/figures/Queen";
import { Rook } from "../../../models/figures/Rook";
import { Knight } from "../../../models/figures/Knight";
import { Bishop } from "../../../models/figures/Bishop";
import white_queen_logo from "../../../assets/white-queen.png";
import white_rook_logo from "../../../assets/white-rook.png";
import white_knight_logo from "../../../assets/white-knight.png";
import white_bishop_logo from "../../../assets/white-bishop.png";
import black_queen_logo from "../../../assets/black-queen.png";
import black_rook_logo from "../../../assets/black-rook.png";
import black_knight_logo from "../../../assets/black-knight.png";
import black_bishop_logo from "../../../assets/black-bishop.png";


interface BoardProps {
  gameId: string;
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player;
  swapPlayer: () => void;
  whitePlayer: Player;
  blackPlayer: Player;
  whitePlayerTime: number;
  blackPlayerTime: number;
  isBlocked: boolean;
  gameResult: GameResult;
  disconnection: DisconnectionType;
}



const BoardComponent: FC<BoardProps> = ({
  gameId,
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  whitePlayer,
  blackPlayer,
  whitePlayerTime,
  blackPlayerTime,
  isBlocked,
  gameResult,
  disconnection
}) => {
  
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [additionFigure, setAdditionanFigure] = useState({
    white: false,
    black: false,
  });
  const [movingCell, setMovingCell] = useState<Cell | null>(null);
  const user = useStore((store) => store.user);

  function showAdditionFigure(color: Colors, cell: Cell) {
    color === Colors.BLACK
      ? setAdditionanFigure({ ...additionFigure, black: true })
      : setAdditionanFigure({ ...additionFigure, white: true });
    setMovingCell(cell);
  }

  function click(cell: Cell) {
    if (
      gameResult.isFinished ||
      isBlocked ||
      !user ||
      !currentPlayer ||
      !currentPlayer.user ||
      user.id !== currentPlayer.user.id
    )
      return;
    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell) &&
      cell.figure?.name !== FigureNames.KING
    ) {
      const figure = cell.figure;
      if (selectedCell.moveFigure(cell)) {
        if (
          cell.figure?.name === FigureNames.PAWN &&
          (cell.y === 0 || cell.y === 7)
        ) {
          return showAdditionFigure(cell.figure?.color!, cell);
        }
        createMoveAndSend(selectedCell, cell, figure);
      }
      setSelectedCell(null);
      updateBoard();
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  function createMoveAndSend(selectedCell: Cell, cell: Cell, figure: Figure | null = null, byPawn: boolean = false) {
    const move = createMoveAnotationAndPosition(
      selectedCell,
      cell,
      board,
      gameId,
      figure,
      byPawn
    );

    if (!move) return;

    if (board.isMate(currentPlayer.color)) {
      console.log("mate");
      return socketService.emit("gameResult", { move, result: "mate" });
    }

    if (board.isStealMate(currentPlayer.color)) {
      console.log("steal mate");
      return socketService.emit("gameResult", { move, result: "stealMate" });
    }

    if (board.isDraw()) {
      console.log("draw");
      return socketService.emit("gameResult", { move, result: "draw" });
    }

    socketService.emit("move", move);
    setSelectedCell(null);
    swapPlayer();
  }

  function createfigureAndUpdate(figure: Figure, cell: Cell) {
    const figureTaken = cell.figure;
    cell.setFigure(figure);
    setAdditionanFigure({ black: false, white: false });
    createMoveAndSend(selectedCell!, cell, figureTaken, true);
  }

  function createNewFigure(name: FigureNames, color: Colors, cell: Cell) {
    if (FigureNames.QUEEN === name) {
      createfigureAndUpdate(new Queen(color, cell), cell);
    }
    if (FigureNames.ROOK === name) {
      createfigureAndUpdate(new Rook(color, cell), cell);
    }
    if (FigureNames.KNIGHT === name) {
      createfigureAndUpdate(new Knight(color, cell), cell);
    }
    if (FigureNames.BISHOP === name) {
      createfigureAndUpdate(new Bishop(color, cell), cell);
    }
  }

  useEffect(() => {
    showCells();
  }, [selectedCell]);

  function showCells() {
    board.findCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  // console.log(board)

  return (
    <div className="relative">
      {user && blackPlayer.user && whitePlayer.user && currentPlayer.user && (
        <UserWithTimer
          disconnected={blackPlayer.user.id === user.id ? disconnection.whiteUserDisconnectedAt : disconnection.blackUserDisconnectedAt}
          timeForReconnect={blackPlayer.user.id === user.id ? disconnection.timeLeftWhiteToReconnect : disconnection.timeLeftBlackToReconnect}
          color={user.id === blackPlayer.user.id ? Colors.WHITE : Colors.BLACK}
          points={
            user.id === blackPlayer.user.id
              ? gameResult.pointsWhite
              : gameResult.pointsBlack
          }
          displayName={
            user.id === blackPlayer.user.id
              ? whitePlayer.user.displayName
              : blackPlayer.user.displayName
          }
          image={
            user.id === blackPlayer.user.id
              ? whitePlayer.user.image
              : blackPlayer.user.image
          }
          time={
            blackPlayer.user.id === user.id ? whitePlayerTime : blackPlayerTime
          }
          isActive={
            !gameResult.isFinished
              ? user.id !== blackPlayer.user.id
                ? currentPlayer.color === Colors.BLACK
                : currentPlayer.color === Colors.WHITE
              : false
          }
        />
      )}
      {blackPlayer.user && user && blackPlayer.user.id === user.id ? (
        <div className="board_chess">
          {[...board.cells]
            .reverse()
            .map((row) =>
              [...row]
                .reverse()
                .map((cell) => (
                  <CellComponent cell={cell} key={cell.id} click={click} />
                ))
            )}
        </div>
      ) : (
        <div className="board_chess">
          {board.cells.map((row) =>
            row.map((cell) => (
              <CellComponent cell={cell} key={cell.id} click={click} />
            ))
          )}
        </div>
      )}
      {user && blackPlayer.user && whitePlayer.user && currentPlayer.user && (
        <UserWithTimer
          disconnected={blackPlayer.user.id !== user.id ? disconnection.whiteUserDisconnectedAt : disconnection.blackUserDisconnectedAt}
          timeForReconnect={blackPlayer.user.id !== user.id ? disconnection.timeLeftWhiteToReconnect : disconnection.timeLeftBlackToReconnect}
          color={user.id !== blackPlayer.user.id ? Colors.WHITE : Colors.BLACK}
          points={
            user.id !== blackPlayer.user.id
              ? gameResult.pointsWhite
              : gameResult.pointsBlack
          }
          displayName={
            user.id !== blackPlayer.user.id
              ? whitePlayer.user.displayName
              : blackPlayer.user.displayName
          }
          image={
            user.id !== blackPlayer.user.id
              ? whitePlayer.user.image
              : blackPlayer.user.image
          }
          time={
            blackPlayer.user.id !== user.id ? whitePlayerTime : blackPlayerTime
          }
          isActive={
            !gameResult.isFinished
              ? user.id === blackPlayer.user.id
                ? currentPlayer.color === Colors.BLACK
                : currentPlayer.color === Colors.WHITE
              : false
          }
        />
      )}
      {additionFigure.white && movingCell && (
        <div className="choose_figure_white">
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.QUEEN, Colors.WHITE, movingCell)
            }
          >
            <img src={white_queen_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.ROOK, Colors.WHITE, movingCell)
            }
          >
            <img src={white_rook_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.KNIGHT, Colors.WHITE, movingCell)
            }
          >
            <img src={white_knight_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.BISHOP, Colors.WHITE, movingCell)
            }
          >
            <img src={white_bishop_logo} alt="" />
          </div>
        </div>
      )}

      {additionFigure.black && movingCell && (
        <div className="choose_figure_white">
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.QUEEN, Colors.BLACK, movingCell)
            }
          >
            <img src={black_queen_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.ROOK, Colors.BLACK, movingCell)
            }
          >
            <img src={black_rook_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.KNIGHT, Colors.BLACK, movingCell)
            }
          >
            <img src={black_knight_logo} alt="" />
          </div>
          <div
            className="cell_chess"
            onClick={() =>
              createNewFigure(FigureNames.BISHOP, Colors.BLACK, movingCell)
            }
          >
            <img src={black_bishop_logo} alt="" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardComponent;
