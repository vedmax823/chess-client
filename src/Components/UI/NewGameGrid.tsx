
import { createGame } from "../../services/socket";


import socketService from "../../services/socket-service";



const NewGameGrid = () => {
  
  const handleClick = (gameType: string) => {
    // console.log(`New game of type: ${gameType} created!`);
    try{
        // createGame(gameType);
        // console.log("Creating game of type:", gameType);
        socketService.emit<string>('createGame', gameType);
    }
    catch(error){
        console.error("Failed to create game:", error);
    }

  };

  const gameRows = [
    { title: "Bullet", types: ["1 min", "1 | 1", "2 | 1"] },
    { title: "Blitz", types: ["3 min", "3 | 2", "5 min"] },
    { title: "Rapid", types: ["10 min", "15 | 10", "30 min"] },
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg m-2 border border-chessGreen">
      {gameRows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-4">
          <h2 className="text-lg font-bold mb-1 text-chessGreen">{row.title}</h2>
          <div className="grid grid-cols-3 gap-4">
            {row.types.map((type, index) => (
              <button
                key={index}
                className="bg-gray-200 border border-gray-300 rounded-lg p-2 text-center text-lg hover:bg-gray-300"
                onClick={() => handleClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewGameGrid;
