import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import sampleData from "@/data/sampleData.json";

interface Figure {
  id: number;
  name: string;
  price: number;
  image: { uri: string };
}

interface FiguresState {
  figures: Figure[];
}

const initialState: FiguresState = {
  figures: sampleData,
};

const figuresSlice = createSlice({
  name: "figures",
  initialState,
  reducers: {
    addFigure: (state, action: PayloadAction<Figure>) => {
      state.figures.push(action.payload);
    },
    deleteFigure: (state, action: PayloadAction<number>) => {
      state.figures = state.figures.filter(
        figure => figure.id !== action.payload
      );
    },
  },
});

export const { addFigure, deleteFigure } = figuresSlice.actions;
export default figuresSlice.reducer;
