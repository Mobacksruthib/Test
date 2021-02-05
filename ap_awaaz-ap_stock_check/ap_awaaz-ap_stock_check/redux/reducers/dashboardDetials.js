import { DASHBOARD_DETAILS } from "../actionTypes";

const initialState = {};

const dashboardDetails = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_DETAILS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default dashboardDetails;
