import { Cell } from "../models/Cell";
import { Board } from "../models/Board";
import { Colors } from "../models/Colors";
import { FigureNames, Figure } from "../models/Figure";
import { HORISONTAL, VERTICAL } from "../models/Board";

export function createMoveAnotationAndPosition(
  cellStart: Cell,
  cellEnd: Cell,
  board: Board,
  gameId: string,
  figureTaken: Figure | null = null,
  byPawn: boolean = false
) {
  const figure = cellEnd.figure;

  if (!figure) return;

  const isTake =
    (figureTaken && !(byPawn && cellStart.i === cellEnd.i)) ||
    (cellEnd.figure?.name === FigureNames.PAWN &&
      Math.abs(cellEnd.i - cellStart.i) === 1)
      ? "x"
      : "";
  const king =
    figure.color === Colors.WHITE ? board.black_king : board.white_king;

  const coords = cellStart.getCoords() + cellEnd.getCoords();
  let annotation =
    figure.name === FigureNames.PAWN || byPawn
      ? makePawnAnnotation(cellStart, cellEnd, isTake)
      : figure.name + isTake + HORISONTAL[cellEnd.i] + VERTICAL[cellEnd.y];
  if (figure.name === FigureNames.KING && cellStart.i - cellEnd.i === 2)
    annotation = "0-0-0";
  if (figure.name === FigureNames.KING && cellStart.i - cellEnd.i === -2)
    annotation = "0-0";
  //   annotation += isMate ? isMate : isCheck;
  const position = board.getPosition();

  if (board.isMate(figure.color)) {
    annotation += "#";
    return { move: figure.name + coords, annotation, position, gameId };
  }

  if (board.isDraw()) {
    annotation += "=";
    return { move: figure.name + coords, annotation, position, gameId };
  }

  if (board.isStealMate(figure.color)) {
    annotation += "=";
    return { move: figure.name + coords, annotation, position, gameId };
  }

  const isCheck = king!.checkCheck() ? "+" : "";

  annotation += isCheck;

  return { move: figure.name + coords, annotation, position, gameId };
}

const makePawnAnnotation = (
  cellStart: Cell,
  cellEnd: Cell,

  isTake: string = ""
) => {
  let newFigure =
    cellEnd.y === 0 || cellEnd.y === 7 ? "=" + cellEnd.figure!.name : "";
  let annotation = isTake
    ? HORISONTAL[cellStart.i] +
      isTake +
      HORISONTAL[cellEnd.i] +
      VERTICAL[cellEnd.y]
    : HORISONTAL[cellEnd.i] + VERTICAL[cellEnd.y];
  return annotation + newFigure;
};
