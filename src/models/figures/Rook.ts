import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from '../Figure';
import logo_white from '../../assets/white-rook.png'
import logo_black from '../../assets/black-rook.png' 



export class Rook extends Figure{
    constructor(color : Colors,  cell : Cell, was_mooving: boolean = false){
        super(color, cell, was_mooving);
        this.name = FigureNames.ROOK;
        this.logo = color === Colors.WHITE ? logo_white : logo_black
    }

    canMove(target: Cell,  skipMainCheck : boolean = false): boolean {
        if(!skipMainCheck && !super.canMove(target))
          return false;
        if(this.cell.isEmptyVertical(target) && !this.cell.board.isCheckAfterMove(this.cell, target, this.color))
          return true
        if(this.cell.isEmptyHorizontal(target) && !this.cell.board.isCheckAfterMove(this.cell, target, this.color))
          return true
        return false
      }
}