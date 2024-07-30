import { Cell } from "./Cell";
import { Colors } from "./Colors";
import logo from "../../assets/white-king.png";

export enum FigureNames {
  FIGURE = "figure",
  KING = "king",
  KNIGHT = "knight",
  PAWN = "pawn",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
}

export const shortLongNames: Record<string, string> = {
  k: FigureNames.KING,
  n: FigureNames.KNIGHT,
  p: FigureNames.PAWN,
  q: FigureNames.QUEEN,
  r: FigureNames.ROOK,
  b: FigureNames.BISHOP,
};

export class Figure {
  color: Colors;
  cell: Cell;
  id: number;
  logo: typeof logo | null;
  name: FigureNames;
  was_mooving: boolean;

  constructor(color: Colors, cell: Cell, was_mooving: boolean = false
  ) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.id = Math.random();
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.was_mooving = was_mooving;
  }

  canMove(target: Cell, skipMainCheck: boolean = false): boolean {
    if (!skipMainCheck && target.figure?.color === this.color) return false;
    // if (target.figure?.name === FigureNames.KING) return false;

    // if(target.figure?.name === FigureNames.KING)
    //   return false
    return true;
  }

  setWasMooving() {
    this.was_mooving = true;
  }

  moveFigure(target: Cell) {}

  makeMove(target: Cell) {
    // console.log(target)
    this.cell.figure = null;
    target.setFigure(this);
  }

  findPossibleCells(): Cell[] {
    return this.cell.board.cells.reduce((acc, row) => {
      return [...acc, ...row.filter((cell) => this.canMove(cell))];
    }, []);
  }
}
