type User = {
  displayName: string;
  id: string;
  socialId: string;
  provider: string;
  email: string;
  image: string;
};

type Message = {
  content: string;
  user: User;
  createdAt: string;
};

type MySocketError = {
  message: string;
  code: number;
};

type Game = {
  id: string;
  timeControl: string;
  playerOne: User;
  playerTwo: User;
  ifFinished: boolean;
  gameDetails: GameDetails;
};

interface OpenCall {
  id: string;
  playerOne: User;
  timeControl: string;
}

type GameDetails = {
  blackStartedAt: string | null;
  blackUserId: string;
  createdAt: string;
  currentPosition: string[][];
  gameId: string;
  id: string;
  lastMove: string | null;
  moves: MoveFromBack[];
  timeLeftBlack: number;
  timeLeftWhite: number;
  turn: "white" | "black";
  whiteStartedAt: string | null;
  whiteUserId: string;
  pointsBlack : number;
  pointsWhite : number;

  drawProposed : string | null;
  blackUserDisconnectedAt : string | null;
  whiteUserDisconnectedAt : string | null;
  
  timeLeftWhiteToReconnect : number;
  timeLeftBlackToReconnect : number;
};

type DisconnectionType = {
  blackUserDisconnectedAt : string | null;
  whiteUserDisconnectedAt : string | null;
  timeLeftWhiteToReconnect : number;
  timeLeftBlackToReconnect : number;
}

type Move = {
  from: Cell;
  to: Cell;
};

type MoveFromBack = {
  move: string;
  annotation: string;
  position: string[][];
  gameId: string;
};

type GameResult = {
  isFinished : boolean;
  pointsWhite : number;
  pointsBlack : number;
  
}


type CurrentPositionType = {
  currentPosition: string[][] | null;
  lastMove: string | null;
};

type ShowedMove = {
  index: number;
  isPossitionBlocked: boolean;
};