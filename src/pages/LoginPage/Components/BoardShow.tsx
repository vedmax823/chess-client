import React, { FC , useState, useEffect} from "react";
import { Board } from "../../../models/Board";
import CellComponent from "../../GamePage/components/CellComponent";
import { Cell } from "../../../models/Cell";
import { Colors } from "../../../models/Colors";
import { FigureNames, Figure } from "../../../models/Figure";
import { Player } from "../../../models/Player";
import { createMoveAnotationAndPosition } from "../../../helpers/createMove";
import { Bishop } from "../../../models/figures/Bishop";
import { Knight } from "../../../models/figures/Knight";
import { Queen } from "../../../models/figures/Queen";
import { Rook } from "../../../models/figures/Rook";
import white_queen_logo from "../../../assets/white-queen.png"
import white_rook_logo from "../../../assets/white-rook.png";
import white_knight_logo from "../../../assets/white-knight.png";
import white_bishop_logo from "../../../assets/white-bishop.png";
import black_queen_logo from "../../../assets/black-queen.png";
import black_rook_logo from "../../../assets/black-rook.png";
import black_knight_logo from "../../../assets/black-knight.png";
import black_bishop_logo from "../../../assets/black-bishop.png";
import { create } from "domain";




interface BoardShowProps {
  board: Board;
  swapPlayer: () => void;
  currentPlayer: Player;
  setBoard: (board: Board) => void;
  addMove: (move: MoveFromBack) => void;
  createResult: (result: string, color: Colors) => void;
  deleteResult: () => void;
  isFinished : number[] | null
}

const BoardShow: FC<BoardShowProps> = ({
  board,
  swapPlayer,
  currentPlayer,
  setBoard,
  addMove,
  createResult,
  deleteResult,
  isFinished
}) => {
  
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [additionFigure, setAdditionanFigure] = useState({
    white: false,
    black: false,
  });
  const [movingCell, setMovingCell] = useState<Cell | null>(null);

  function showAdditionFigure(color: Colors, cell: Cell) {
    color === Colors.BLACK
      ? setAdditionanFigure({ ...additionFigure, black: true })
      : setAdditionanFigure({ ...additionFigure, white: true });
    setMovingCell(cell);
  }

  function click(cell: Cell) {
    if (isFinished) return
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
        createMove(selectedCell, cell, figure);
      }
      setSelectedCell(null);
      updateBoard();
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  function createMove(selectedCell: Cell, cell: Cell, figure : Figure | null = null, byPawn: boolean = false) {
    const move = createMoveAnotationAndPosition(
      selectedCell,
      cell,
      board,
      "1",
      figure,
      byPawn
    );

    if (!move) return;

    addMove(move);

    if (board.isMate(currentPlayer.color)) {
      createResult("mate", currentPlayer.color);
      return console.log("mate");
      
    }

    if (board.isStealMate(currentPlayer.color)) {
      createResult("draw", currentPlayer.color);
      return console.log("steal mate");
      
    }

    if (board.isDraw()) {
      createResult("draw", currentPlayer.color);
      return console.log("draw");
      
    }

    deleteResult();

    setSelectedCell(null);
    swapPlayer();
  }

  function createfigureAndUpdate(figure: Figure, cell: Cell) {
    const figureTaken = cell.figure;
    cell.setFigure(figure);
    setAdditionanFigure({ black: false, white: false });
    createMove(selectedCell!, cell, figureTaken, true);
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

  return (
    <div className="relative">
      <div className="board_chess">
        {board.cells.map((row) =>
          row.map((cell) => (
            <CellComponent cell={cell} key={cell.id} click={click} />
          ))
        )}
      </div>
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

export default BoardShow;
