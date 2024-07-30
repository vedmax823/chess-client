import { create } from "zustand";
import { Figure } from "../models/Figure";

interface FigureStore {
    figure : Figure | null;
    grabFigure : (figure: Figure) => void;
    dropFigure : () => void;
}

const useFigure = create<FigureStore>((set) => ({
    figure : null,
    grabFigure : (figure) => {
        set({figure});
    },
    dropFigure : () => {
        set({figure : null});
    }
}));


export default useFigure;