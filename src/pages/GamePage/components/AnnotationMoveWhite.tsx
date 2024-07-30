import React, {FC} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessBishop, faChessKing, faChessKnight, faChessQueen, faChessRook } from "@fortawesome/free-regular-svg-icons";
import { FigureNames } from '../../../models/Figure';

interface AnnotationMoveProps {
    move : string;
}



const AnnotationMoveWhite: FC<AnnotationMoveProps> = ({ move }) => {
    if (move.includes(FigureNames.KNIGHT)) {
      const parts = move.split(/(knight)/);
      return (
        <div>
          {parts.map((part, index) =>
            part === FigureNames.KNIGHT ? (
              <FontAwesomeIcon key={index} icon={faChessKnight} />
            ) : (
              part
            )
          )}
        </div>
      );
    }
    if (move.includes(FigureNames.BISHOP)) {
      const parts = move.split(/(bishop)/);
      return (
        <div>
          {parts.map((part, index) =>
            part === FigureNames.BISHOP ? (
              <FontAwesomeIcon key={index} icon={faChessBishop} />
            ) : (
              part
            )
          )}
        </div>
      );
    }
    if (move.includes(FigureNames.QUEEN)) {
      const parts = move.split(/(queen)/);
      return (
          <div>
            {parts.map((part, index) =>
              part === FigureNames.QUEEN ? (
                <FontAwesomeIcon key={index} icon={faChessQueen} />
              ) : (
                part
              )
            )}
          </div>
        );
    }
    if (move.includes(FigureNames.KING)) {
      const parts = move.split(/(king)/);
      return (
          <div>
            {parts.map((part, index) =>
              part === FigureNames.KING ? (
                <FontAwesomeIcon key={index} icon={faChessKing} />
              ) : (
                part
              )
            )}
          </div>
        );
    }
    if (move.includes(FigureNames.ROOK)) {
      const parts = move.split(/(rook)/);
      return (
          <div>
            {parts.map((part, index) =>
              part === FigureNames.ROOK ? (
                <FontAwesomeIcon key={index} icon={faChessRook} />
              ) : (
                part
              )
            )}
          </div>
        );
    }
  
    return <div>{move}</div>;
  };

export default AnnotationMoveWhite;