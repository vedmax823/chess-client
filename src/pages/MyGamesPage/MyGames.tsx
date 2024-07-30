import React from "react";
import { useMyGames } from "./hooks/useMyGames";
import MyGame from "./components/MyGame";

const MyGames = () => {
  const [games, isMore, addGames] = useMyGames();

  if (!games) return <>You have not played yet!</>;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">White Player</th>
              <th className="py-3 px-6 text-left">Black Player</th>
              <th className="py-3 px-6 text-left">Result</th>
              <th className="py-3 px-6 text-left">Time Control</th>
              <th className="py-3 px-6 text-left">Review</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {games
              .filter((game) => game.gameDetails)
              .map((game) => (
                <MyGame key={game.id} game={game} />
              ))}
          </tbody>
        </table>
        <div className="w-full flex justify-center p-2">
        {
            isMore && <button onClick={addGames} className="px-4 py-2 bg-chessGreen hover:bg-chessDark rounded-lg text-chessLight" > Upload More </button>
        }
        </div>
      </div>
    </div>
  );
};

export default MyGames;
