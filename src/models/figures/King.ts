import { Figure } from '../Figure';
import { Colors } from '../Colors';
import { FigureNames } from '../Figure';
import { Cell } from '../Cell';

import logo_white from '../../assets/white-king.png'
import logo_black from '../../assets/black-king.png' 


export class King extends Figure{
    constructor(color : Colors,  cell : Cell, was_mooving: boolean = false){
        super(color, cell, was_mooving);
        this.name = FigureNames.KING;
        this.logo = color === Colors.WHITE ? logo_white : logo_black
    }

    canMove(target: Cell, skipMainCheck : boolean = false): boolean {
        if(!skipMainCheck && !super.canMove(target))
          return false;
        if (target.figure?.color === this.color) return false;

        if ((!this.was_mooving) && (target.y === 0) && (this.color === Colors.BLACK)){
            if (target.i === 6){
                if (!this.cell.board.getCell(7, 0).figure?.was_mooving){
                    if ((this.cell.board.getCell(6, 0).figure || this.cell.board.getCell(5, 0).figure)
                        || (this.cell.board.getCell(6, 0).checkCellUnderAttack(Colors.BLACK) 
                        || this.cell.board.getCell(5, 0).checkCellUnderAttack(Colors.BLACK))
                        || (this.checkCheck())) return false
                    
                    return true
                } 
                return false
            }
            if (target.i === 2){
                if (!this.cell.board.getCell(0, target.y).figure?.was_mooving){
                    if ((this.cell.board.getCell(3, 0).figure || this.cell.board.getCell(2, 0).figure || this.cell.board.getCell(1, 0).figure)  
                        || (this.cell.board.getCell(3, 0).checkCellUnderAttack(Colors.BLACK) 
                        || this.cell.board.getCell(2, 0).checkCellUnderAttack(Colors.BLACK))
                        || (this.checkCheck())) return false
                    return true
                }
                return false
            }
        }

        if ((!this.was_mooving) && (target.y === 7) && (this.color === Colors.WHITE)){
            if (target.i === 6){
                if (this.cell.board.getCell(7, 7).figure && !this.cell.board.getCell(7, target.y).figure?.was_mooving){
                    if ((this.cell.board.getCell(6, 7).figure || this.cell.board.getCell(5, 7).figure) 
                        || (this.cell.board.getCell(6, 7).checkCellUnderAttack(Colors.WHITE) 
                        || this.cell.board.getCell(5, 7).checkCellUnderAttack(Colors.WHITE))
                        || (this.checkCheck())) return false
                    return true
                }
                return false
            }
            if (target.i === 2){
                if (!this.cell.board.getCell(0, target.y).figure?.was_mooving){
                    if ((this.cell.board.getCell(3, 7).figure || this.cell.board.getCell(2, 7).figure || this.cell.board.getCell(1, 7).figure) 
                        || (this.cell.board.getCell(3, 7).checkCellUnderAttack(Colors.WHITE) 
                        || this.cell.board.getCell(2, 7).checkCellUnderAttack(Colors.WHITE))
                        ||(this.checkCheck())) return false
                    return true
                } 
                return false
            }
        }

        let dy = Math.abs(this.cell.y - target.y)
        let dx = Math.abs(this.cell.i - target.i)
        if ((dy > 1) || (dx > 1)) return false
        
        return !this.cell.board.isCheckAfterMove(this.cell, target, this.color)
    }


    public checkCheck(cell : Cell | null = null, color : Colors | null = null) : boolean{
        const checkingCell = cell || this.cell
        const checkingColor = color || this.color;
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                let target = this.cell.board.getCell(j ,i)
                if (target.figure && (target.figure.color !== checkingColor)){
                    if (target.figure.name !== FigureNames.KING){
                      if (target.figure.canMove(checkingCell, true)) return true
                    }
                    else{
                      const dx = Math.abs(checkingCell.i - target.i);
                      const dy = Math.abs(checkingCell.y - target.y);
                      if ((dy < 2) && (dx < 2)) return true
                    }
                  }
            }
        }
        return false
    }


    public isMat() : boolean{
        if (!this.checkCheck()) return false
        const possibleLenght = this.findPossibleCells();
        return possibleLenght.length === 0 ? true : false
    }
}