import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from '../Figure';
import logo_white from '../../assets/white-bishop.png'
import logo_black from '../../assets/black-bishop.png' 



export class Bishop extends Figure{
    constructor(color : Colors,  cell : Cell, was_mooving: boolean = false){
        super(color, cell, was_mooving);
        this.name = FigureNames.BISHOP;
        this.logo = color === Colors.WHITE ? logo_white : logo_black
    }

    canMove(target: Cell, skipMainCheck : boolean = false): boolean {
        if(!skipMainCheck && !super.canMove(target))
          return false;
        if(this.cell.isEmptyDiagonal(target) && !this.cell.board.isCheckAfterMove(this.cell, target, this.color))
          return true
        return false
    }
}