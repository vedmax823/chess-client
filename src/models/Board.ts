import { Cell } from "./Cell";
import { King } from "./figures/King";
import { Colors } from "./Colors";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Bishop } from "./figures/Bishop";
import { Knight } from "./figures/Knight";
import { Rook } from "./figures/Rook";
import { Figure, FigureNames } from "./Figure";

export const VERTICAL = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const HORISONTAL = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];



export class Board {
  cells: Cell[][] = [];
  lastMove: Move | null = null;
  white_king: King | null = null;
  black_king: King | null = null;

  public init_cells() {
    for (let i = 0; i < 8; i++) {
      const rows: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        rows.push(new Cell(j, i, null, this));
      }
      this.cells.push(rows);
    }
  }

  getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  getPosition(){
    return this.cells.map(row => 
        row.map(cell =>
          cell.figure ? cell.figure.color[0] + (cell.figure.name === FigureNames.KNIGHT ? 'n' : cell.figure.name[0]) + (cell.figure.was_mooving ? 'y' : 'n') : '00'
        )
    )
  }

  public getDeepCopy = () => {
    const position = this.getPosition();
    const newBoard = new Board();
    newBoard.init_cells();
    newBoard.addFiguresFromPosition(position);
    const lastMove = this.lastMove;
    newBoard.setLastMove(lastMove && lastMove.from.getCoords() + lastMove.to.getCoords())
    return newBoard;
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();

    newBoard.cells = this.cells;
    newBoard.white_king = this.white_king;
    newBoard.black_king = this.black_king;
    newBoard.lastMove = this.lastMove;
    // console.log(newBoard)
    //newBoard.lostWhiteFigures = this.lostWhiteFigures
    //newBoard.lostBlackFigures = this.lostBlackFigures
    return newBoard;
  }

  public findCells(selectedCell: Cell | null) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        target.possible = !!selectedCell?.figure?.canMove(target);
      }
    }
  }



  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }

  private addKings() {
    this.white_king = new King(Colors.WHITE, this.getCell(4, 7));
    this.black_king = new King(Colors.BLACK, this.getCell(4, 0));
  }

  private addQueens() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }

  private addBishops() {
    new Bishop(Colors.BLACK, this.getCell(2, 0));
    new Bishop(Colors.BLACK, this.getCell(5, 0));
    new Bishop(Colors.WHITE, this.getCell(2, 7));
    new Bishop(Colors.WHITE, this.getCell(5, 7));
  }

  private addKnights() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }

  private addRooks() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }

  public addFigures() {
    this.addPawns();
    this.addKnights();
    this.addKings();
    this.addBishops();
    this.addQueens();
    this.addRooks();
  }

  public setLastMove(move : string | null){
    const lastFour = move?.slice(-4);

    if (!lastFour || lastFour.length < 4) return this.lastMove = null;
    const from = this.getCell(parseInt(lastFour[0]), parseInt(lastFour[1]));
    const to = this.getCell(parseInt(lastFour[2]), parseInt(lastFour[3]));
    if (!from || !to) return this.lastMove = null;
    this.lastMove = {from, to}
  }

  public addFiguresFromPosition(position: string[][]) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const figure = position[i][j];

        if (figure === "00") continue;

        const color = figure[0] === "w" ? Colors.WHITE : Colors.BLACK;

        switch (figure[1]) {
          case "p":
            new Pawn(color, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;

          case "n":
            new Knight(color, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;

          case "b":
            new Bishop(color, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;

          case "r":
            new Rook(color, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;

          case "q":
            new Queen(color, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;

          case "k":
            if (color === Colors.WHITE)
              this.white_king = new King(Colors.WHITE, this.getCell(j, i), figure[2] === 'y' ? true : false);
            else this.black_king = new King(Colors.BLACK, this.getCell(j, i), figure[2] === 'y' ? true : false);
            break;
        }
      }
    }
  }

  public isCheckAfterMove(from: Cell, to: Cell, colorKing : Colors) {
    const newBoard = this.getDeepCopy();
    const newCell = newBoard.getCell(from.i, from.y);
    const newPossibleCell = newBoard.getCell(to.i, to.y);
    if (!newCell.figure) return false;
    if (newPossibleCell.figure && newPossibleCell.figure.name === FigureNames.KING) return false;
    newCell.figure.makeMove(newPossibleCell);
    const newKing = colorKing === Colors.WHITE ? newBoard.white_king : newBoard.black_king;
    return newKing && newKing.checkCheck();
  }

  public isMate(colorTurn: Colors) {
    const king = colorTurn === Colors.WHITE ? this.black_king : this.white_king;
    if (!king) return false;
    if (!king.checkCheck()) return false;

    const kingPossibleCells = king.findPossibleCells();
    if (kingPossibleCells.length > 0) return false;

    const noCheckMoves = this.cells.reduce((acc : Move[], row) => {
      row.forEach(cell => {
        if (!cell.figure || cell.figure.color === colorTurn || cell.figure.name === FigureNames.KING) return;
        const possibleMoves = cell.figure.findPossibleCells();
        if (possibleMoves.length === 0) return;
        for (const possibleCell of possibleMoves) {
          if (!this.isCheckAfterMove(cell, possibleCell, colorTurn === Colors.WHITE ? Colors.BLACK : Colors.WHITE)){
            const move = {from : cell, to : possibleCell}
            acc = [...acc, move]
          } 
        }
      })
      return acc
    }, [])
    // console.log(noCheckMoves)
    return noCheckMoves.length === 0;
  }

  public isStealMate(colorTurn: Colors) {
    const king = colorTurn === Colors.WHITE ? this.black_king : this.white_king;
    if (!king) return false;
    if (king.checkCheck()) return false;
    const kingPossibleCells = king.findPossibleCells();
    if (kingPossibleCells.length > 0) return false;
    const posibleMoves = this.cells.reduce((acc : Move[], row) => {
      row.forEach(cell => {
        if (!cell.figure || cell.figure.color === colorTurn || cell.figure.name === FigureNames.KING) return;
        const possibleMoves = cell.figure.findPossibleCells();
        if (possibleMoves.length === 0) return;
        for (const possibleCell of possibleMoves) {
            const move = {from : cell, to : possibleCell}
            acc = [...acc, move] 
        }
      })
      return acc
    }, [])
    return posibleMoves.length === 0;
  }


  public isDraw(){
    const whiteFigure : Figure[] = [];
    const blackFigure : Figure[]= [];
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.figure && cell.figure.name !== FigureNames.KING){
          cell.figure.color === Colors.WHITE ? whiteFigure.push(cell.figure) : blackFigure.push(cell.figure)
        }
      })
    })

    return (whiteFigure.length === 0 && blackFigure.length === 0) 
    || (whiteFigure.length === 1 && (whiteFigure[0].name === FigureNames.KNIGHT || whiteFigure[0].name === FigureNames.BISHOP) && blackFigure.length === 0)
    || (blackFigure.length === 1 && (blackFigure[0].name === FigureNames.KNIGHT || blackFigure[0].name === FigureNames.BISHOP) && whiteFigure.length === 0)
    || (whiteFigure.length === 1 && (whiteFigure[0].name === FigureNames.BISHOP || whiteFigure[0].name === FigureNames.KNIGHT) 
    && blackFigure.length === 1 && (blackFigure[0].name === FigureNames.BISHOP || blackFigure[0].name === FigureNames.KNIGHT))
  }

}
