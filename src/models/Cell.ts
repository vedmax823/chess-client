import { Board } from './Board';
import { Figure } from "./Figure";
import { Colors } from "./Colors";
import { FigureNames } from './Figure';

export class Cell {
    readonly i : number;
    readonly y : number;
    readonly color : string;
    readonly id : number;
    figure : Figure | null;
    possible: boolean;
    board : Board;


    constructor(i : number, y : number, figure : Figure | null, board : Board){
        this.i = i;
        this.y = y;
        this.color = ((i + y) % 2 == 0) ? Colors.WHITE : Colors.BLACK
        this.id = Math.random()
        this.figure = figure
        this.possible = false;
        this.board = board;
    }

    isEmpty(): boolean {
        return this.figure === null;
    }
    
    isEnemy(target: Cell): boolean {
        if (target.figure) {
          return this.figure?.color !== target.figure.color;
        }
        return false;
    }
    
    isEmptyVertical(target: Cell): boolean {
        if (this.i !== target.i) {
          return false;
        }
    
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
          if(!this.board.getCell(this.i, y).isEmpty()) {
            return false
          }
        }
        return true;
    }
    
    isEmptyHorizontal(target: Cell, ): boolean {
        if (this.y !== target.y) {
          return false;
        }
    
        const min = Math.min(this.i, target.i);
        const max = Math.max(this.i, target.i);
        for (let x = min + 1; x < max; x++) {
          if(!this.board.getCell(x, this.y).isEmpty()) {
            return false
          }
        }
        return true;
    }
    
    isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.i - this.i);
        const absY = Math.abs(target.y - this.y);
        if(absY !== absX)
          return false;
    
        const dy = this.y < target.y ? 1 : -1
        const dx = this.i < target.i ? 1 : -1
    
        for (let i = 1; i < absY; i++) {
          if(!this.board.getCell(this.i + dx*i, this.y + dy   * i).isEmpty())
            return false;
        }
        return true;
    }

    setFigure(figure: Figure) {
      this.figure = figure;
      this.figure.cell = this;
    }
  
    // addLostFigure(figure: FigureChess) {
    //   figure.color === Colors.BLACK
    //     ? this.board.lostBlackFigures.push(figure)
    //     : this.board.lostWhiteFigures.push(figure)
    // }

    getCoords() : string {
      return this.i + this.y.toString();
    }
  
    moveFigure(target: Cell) : boolean {
      if(this.figure && this.figure?.canMove(target) && !this.board.isCheckAfterMove(this, target, this.figure.color)){
        
        this.figure.moveFigure(target)

        let figure_buf : Figure | null = target.figure
        
        target.setFigure(this.figure);

        this.figure = null;
        if (target.figure && target.figure.color === Colors.WHITE ? target.board.white_king?.checkCheck() : target.board.black_king?.checkCheck()){
          target.figure && this.setFigure(target.figure)  
          figure_buf ?  target.setFigure(figure_buf) : target.figure = null
          return false
        }
        const lastMove = this.board.lastMove;
        
        if (target.figure && target.figure.name === FigureNames.PAWN 
          && lastMove
          && (Math.abs(target.y - this.y) === 1)
          && (Math.abs(target.i - this.i) === 1)
          && target.i === lastMove.to.i
          && lastMove.to.y === this.y
          && lastMove.to.figure.name === FigureNames.PAWN
          && Math.abs(lastMove.to.y - lastMove.from.y) === 2
         )
        {
          this.board.getCell(lastMove.to.i, lastMove.to.y).figure = null
          return true
        }
        if (target.figure?.name === FigureNames.KING && (Math.abs(this.i - target.i) === 2)){
          if (target.i === 6) {
            this.board.getCell(5, target.y).setFigure(this.board.getCell(7, target.y).figure!)
            this.board.getCell(5, target.y).figure?.setWasMooving()
            this.board.getCell(7, target.y).figure = null
          }
          if (target.i === 2) {
            this.board.getCell(3, target.y).setFigure(this.board.getCell(0, target.y).figure!)
            this.board.getCell(3, target.y).figure?.setWasMooving()
            this.board.getCell(0, target.y).figure = null
          }
        }
        target.figure?.setWasMooving()
        return true
      }
      return false
    }

    public checkCellUnderAttack(color: Colors) : boolean{
      // console.log(this)
      for (let i = 0; i < 8; i++){
          for (let j = 0; j < 8; j++){
              if (j === this.i && i === this.y) continue
              let target = this.board.getCell(j, i)
              
              if (target.figure && (target.figure.color !== color)){
                if (target.figure.name !== FigureNames.KING){
                  if (target.figure.canMove(this, true)) {
                    
                    return true
                  }
                }
                else{
                  const dx = Math.abs(this.i - target.i);
                  const dy = Math.abs(this.y - target.y);
                  if ((dy < 2) && (dx < 2)) return true
                }
              }
              
          }
      }
      return false
  }
}