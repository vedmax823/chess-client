import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from '../Figure';
import logo_white from '../../assets/white-knight.png'
import logo_black from '../../assets/black-knight.png' 



export class Knight extends Figure{
    constructor(color : Colors,  cell : Cell, was_mooving: boolean = false){
        super(color, cell, was_mooving);
        this.name = FigureNames.KNIGHT;
        this.logo = color === Colors.WHITE ? logo_white : logo_black
    }

    canMove(target: Cell, skipMainCheck : boolean = false): boolean {
        if(!skipMainCheck && !super.canMove(target))
          return false;
        const dx = Math.abs(this.cell.i - target.i);
        const dy = Math.abs(this.cell.y - target.y);
    
        return ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) && !this.cell.board.isCheckAfterMove(this.cell, target, this.color)
    }

}