import { CART_DETAILS } from "../actionTypes";

const initialState = {};

const cartDetails = (state = initialState, action) => {
  switch (action.type) {
    case CART_DETAILS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default cartDetails;
