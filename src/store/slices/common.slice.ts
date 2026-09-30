import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface CommonState {
  counter?: number;
}

const initialState: CommonState = {
  counter: 0,
};

export const commonSlice = createSlice({
  name: "common",
  reducers: {
    incrementCounter: (state) => {
      state.counter = (state.counter || 0) + 1;
    },
    decrementCounter: (state) => {
      state.counter = (state.counter || 0) - 1;
    },
  },
  initialState,
});

export const selectCounter = (state: RootState) => {
  return state.common.counter;
};

export default commonSlice.reducer;
