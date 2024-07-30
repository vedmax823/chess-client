import axios from 'axios';
import {create} from 'zustand';

interface StoreState {
    user: User | null;
    fetchUser: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }
  
  const useStore = create<StoreState>((set) => ({
    user: null,
    fetchUser: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/profile`, {withCredentials: true});
        // console.log(response.data);
        set({ user: response.data });
      } catch (error) {

        // console.error('Failed to fetch user profile:', error);
        set({ user: null });
      }
    },
    login: async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, {withCredentials: true});
        } catch (error) {
            console.error('Failed to login:', error);
        }
    },
    logout: async () => {
      set({ user: null });
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {withCredentials: true});
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    },
  }));
  
  export default useStore;