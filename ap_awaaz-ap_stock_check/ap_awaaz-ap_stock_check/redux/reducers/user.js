import { USER_DETAILS } from "../actionTypes";

const initialState = {};

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_DETAILS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default user;
