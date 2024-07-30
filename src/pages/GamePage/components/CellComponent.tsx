import React, { FC } from "react";
import { Cell } from "../../../models/Cell";
import { Colors } from "../../../models/Colors";
import { Figure, FigureNames } from "../,,/../../../models/Figure";
import useFigure from "../../../store/useFigure";

interface CellProps {
  cell: Cell;
  click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({ cell, click }) => {
//   const figureStore = useFigure();

//   const onMouseDown = (e: React.MouseEvent) => {
//     const mouseHoldTimeout = setTimeout(() => {
//       if (cell.figure)
//         figureStore.grabFigure(
//           new Figure(cell.figure.color, new Cell(100, 100, this, board), cell.figure.was_mooving)
//         );
//     }, 100);
//   };

  return (
    <div
      onClick={() => click(cell)}
    //   onMouseDown={onMouseDown}
      className={[
        "cell_chess",
        cell.color == Colors.BLACK ? "cell_black" : "cell_white",
        cell.figure?.name === FigureNames.PAWN ? "cell_pawn" : "cell_figure",
      ].join(" ")}
      style={{ background: cell.possible && cell.figure ? "green" : "" }}
    >
      {cell.possible && !cell.figure && <div className={"possible"} />}
      {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
    </div>
  );
};

export default CellComponent;
