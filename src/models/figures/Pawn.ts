
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from '../Figure';
import logo_white from '../../assets/white-pawn.png'
import logo_black from '../../assets/black-pawn.png' 



export class Pawn extends Figure{
    
    isFirstStep: boolean;

    constructor(color : Colors,  cell : Cell, was_mooving: boolean = false){
        super(color, cell, was_mooving);
        this.name = FigureNames.PAWN;
        this.logo = color === Colors.WHITE ? logo_white : logo_black
        this.isFirstStep = color === Colors.WHITE ? cell.y === 6 : cell.y === 1
    }

    canMove(target: Cell, skipMainCheck : boolean = false): boolean {
        if(!skipMainCheck && !super.canMove(target))
          return false;
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1
        const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2

        if ((target.y === this.cell.y + direction || this.isFirstStep
            && (target.y === this.cell.y + firstStepDirection))
            && target.i === this.cell.i
            && this.cell.board.getCell(this.cell.i, this.cell.y + direction).isEmpty()
            && this.cell.board.getCell(target.i, target.y).isEmpty()) {
          return !this.cell.board.isCheckAfterMove(this.cell, target, this.color);
        }
    
        if(target.y === this.cell.y + direction
            && (target.i === this.cell.i + 1 || target.i === this.cell.i - 1)
            && this.cell.isEnemy(target)) {
          return !this.cell.board.isCheckAfterMove(this.cell, target, this.color);
        }

        const lastMove = this.cell.board.lastMove;

        if(lastMove && target.y === this.cell.y + direction
          && (target.i === this.cell.i + 1 || target.i === this.cell.i - 1)
          && target.i === lastMove.to.i
          && !target.figure
          && lastMove.to.figure?.name === FigureNames.PAWN
          && (Math.abs(lastMove.to.y - lastMove.from.y) === 2)
          && this.cell.y === lastMove.to.y
        ) {
        return !this.cell.board.isCheckAfterMove(this.cell, target, this.color);
      }

        if(target.y === this.cell.y + direction
          && (target.i === this.cell.i + 1 || target.i === this.cell.i - 1)
          && skipMainCheck) {
        return !this.cell.board.isCheckAfterMove(this.cell, target, this.color);
      }
    
        return false;
      }

      makeMove(target: Cell): void {
        
        const lastMove = this.cell.board.lastMove;

        if (!target.figure
          && lastMove
          && (Math.abs(target.y - this.cell.y) === 1)
          && (Math.abs(target.i - this.cell.i) === 1)
          && target.i === lastMove.to.i
          && lastMove.to.figure.name === FigureNames.PAWN
          && Math.abs(lastMove.to.y - lastMove.from.y) === 2
         )
        {
          this.cell.board.getCell(lastMove.to.i, lastMove.to.y).figure = null
        }
        super.makeMove(target);
      }
    
      moveFigure(target: Cell) {
        // console.log('pawn move')
        super.moveFigure(target);
        this.isFirstStep = false;
      }
}