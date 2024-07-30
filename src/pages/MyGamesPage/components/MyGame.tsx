import React, {FC} from 'react';
import useStore from '../../../store/useUser';
import { useNavigate } from 'react-router-dom';

interface MyGameProps{
    game : Game
}

const MyGame:FC<MyGameProps> = ({game}) => {
    const user = useStore(state => state.user)
    const navigate = useNavigate()
    if (!user) return <></>
    const whitePlayer = game.gameDetails.whiteUserId === game.playerOne.id ? game.playerOne : game.playerTwo;
    const blackPlayer = game.gameDetails.whiteUserId === game.playerOne.id ? game.playerTwo : game.playerOne;
    const resultColor = getResultColor(game, user);
    const result = makeResult(game)
    const timeControl = game.timeControl.replace( '| 0', 'min');
    function handleClick(id : string){
        navigate(`/live/${id}`)
    }
    return (

        <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{whitePlayer.displayName}</td>
              <td className="py-3 px-6 text-left whitespace-nowrap">{blackPlayer.displayName}</td>
              <td className="py-3 px-6 text-left">
                <span className={`p-2 ${resultColor} rounded-lg text-chessLight`}>{result}</span>
              </td>
              <td className="py-3 px-6 text-left">{timeControl}</td>
              <td className="py-3 px-6 text-left">
                <button 
                    className="bg-chessGreen text-white px-4 py-2 rounded-lg hover:bg-chessDark"
                    onClick={() => handleClick(game.id)}
                >
                    Review
                </button>
              </td>
            </tr>

    );
};

function makeResult(game : Game){
    if (!game.ifFinished) return 'is playing';

    return `${game.gameDetails.pointsWhite} - ${game.gameDetails.pointsBlack}`
}

function getResultColor(game : Game, user : User){
    if (!game.ifFinished) return 'bg-yellow-100';
    if (game.gameDetails.pointsBlack === game.gameDetails.pointsWhite) return 'bg-gray-500';
    if (game.gameDetails.pointsWhite === 1 && user.id === game.gameDetails.whiteUserId) return 'bg-green-500';
    if (game.gameDetails.pointsBlack === 1 && user.id === game.gameDetails.blackUserId) return 'bg-green-500';
    return 'bg-red-500';
}

export default MyGame;