import axios from "axios";
import { useEffect, useState, useRef } from "react";
import socketService from "../../../services/socket-service";
import useStore from "../../../store/useUser";
import { useNavigate } from "react-router-dom";

export const useMyGames = () : [Game[], boolean, () => void] => {
  const [games, setGames] = useState<Game[]>([]);
  const [skip, setSkip] = useState<number>(0)
  const [isMore, setIsmore] = useState<boolean>(true)
  const initialMount = useRef(true); 
  const fetchUser = useStore(state => state.fetchUser);
  const navigate = useNavigate();

  const addGames = () => setSkip(prev => prev + 1);

  useEffect(() => {
    socketService.connect()

    socketService.on("disconnect", () => {
      fetchUser();
    });
    if (initialMount.current) {
        initialMount.current = false; // Set the ref to false after the initial mount
        return;
    }

    socketService.on("gameStarted", (game: Game) => {
      const newPath = `/live/${game.id}`;
      navigate(newPath);
    });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/game/mygames?skip=${skip}`, {
        withCredentials: true,
      })
      .then((data) => {
        if (data.data.length < 50) setIsmore(() => false);
        setGames(prev => [...prev, ...data.data]);
        
      })
      .catch((err) => console.log(err));
    return () => socketService.disconnect()
  }, [skip, navigate, fetchUser]);

  return [games, isMore, addGames]
};
