import axios from "axios";

export const createGame = async (gameType: string) => {
    try {
        const newGame = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/game`, {data : gameType}, {withCredentials: true});
        return newGame.data;
    }
    catch (error) {
        console.error("Failed to create game:", error);
    }
};


export const getOpenCalls = async () => {
    try {
        const openCalls = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/game/calls`, {withCredentials: true});
        return openCalls.data;
    }
    catch (error) {
        console.error("Failed to get open calls:", error);
    }
}

export const getActiveGame = async () => {
    try{
        const activeGame = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/game/active`, {withCredentials: true});
        return activeGame.data;
    }
    catch(e){
        console.log("Failed to get active games", e)
    }
}

