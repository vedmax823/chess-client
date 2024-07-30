import React, { FC, useEffect, useRef } from "react";

import AnnotationMoveBlack from "./AnnotationMoveBlack";
import AnnotationMoveWhite from "./AnnotationMoveWhite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBackward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";

interface MovesComponentProps {
  moves: MoveFromBack[];
  changeWatchedPosition: (index: number) => void;
  currentMove: number;
}

const MovesComponent: FC<MovesComponentProps> = ({
  moves,
  changeWatchedPosition,
  currentMove,
}) => {
  const movesContainerRef = useRef<HTMLDivElement>(null);
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToDiv = (index: number) => {
    if (window.matchMedia("(min-width: 1280px)").matches) {
      if (divRefs.current[index]) {
        divRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const goToFirstMove = () => {
    changeWatchedPosition(0);
    scrollToDiv(0);
  };
  const goToPreviousMove = () => {
    const index = currentMove - 1 >= 0 ? currentMove - 1 : currentMove;
    changeWatchedPosition(index || 0);
    index && scrollToDiv(index);
  };

  const goToNextMove = () => {
    const index =
      currentMove + 1 < moves.length ? currentMove + 1 : currentMove;
    changeWatchedPosition(index);
    index && scrollToDiv(index);
  };
  const goToLastMove = () => {
    changeWatchedPosition(moves.length - 1);
    scrollToDiv(moves.length - 2);
  };

  useEffect(() => {
    scrollToDiv(moves.length - 2);
  }, [moves]);

  return (
    <div className="">
      <div className="p-2">
        <div className="flex justify-between w-full mb-1">
          <button className="w-1/4 p-1 border rounded" onClick={goToFirstMove}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button
            className="w-1/4 p-1 border rounded"
            onClick={goToPreviousMove}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className="w-1/4 p-1 border rounded" onClick={goToNextMove}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button className="w-1/4 p-1 border rounded" onClick={goToLastMove}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
        <div className="h-96 overflow-y-scroll">
          <div
            className="flex flex-wrap overflow-y-auto"
            ref={movesContainerRef}
          >
            {moves
              .filter((move) => move.move)
              .map((move, index) => {
                if (index % 2 === 0) {
                  const moveNumber = Math.floor(index / 2) + 1;
                  return (
                    <React.Fragment key={index}>
                      <div className="w-2/12 border rounded cursor-pointer flex justify-center items-center bg-slate-300 max-h-8">
                        {moveNumber}
                      </div>
                      <div
                        ref={(el) => (divRefs.current[index] = el)}
                        key={index}
                        className={`w-5/12 p-1 border rounded cursor-pointer max-h-8 ${
                          index + 1 === currentMove ? "bg-blue-200" : ""
                        }`}
                        onClick={() => changeWatchedPosition(index + 1)}
                      >
                        <AnnotationMoveWhite move={move.annotation} />
                      </div>
                    </React.Fragment>
                  );
                } else
                  return (
                    <div
                      ref={(el) => (divRefs.current[index] = el)}
                      key={index}
                      className={`w-5/12 p-1 border rounded cursor-pointer max-h-8 ${
                        index + 1 === currentMove ? "bg-blue-200" : ""
                      }`}
                      onClick={() => changeWatchedPosition(index + 1)}
                    >
                      <AnnotationMoveBlack move={move.annotation} />
                    </div>
                  );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovesComponent;
