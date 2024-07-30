interface ChessPlayerProps {
    displayName: string;
    imageUrl: string;
  }
  
  const ChessPlayer: React.FC<ChessPlayerProps> = ({ displayName, imageUrl }) => {
    return (
        <div className="flex items-center p-2 bg-white rounded-lg">
        <img
          src={imageUrl}
          alt={displayName}
          className="w-6 h-6 rounded-full mr-2"
        />
        <div className="text-sm font-semibold">{displayName}</div>
      </div>
    );
  };
  
  export default ChessPlayer;