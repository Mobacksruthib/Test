import { DASHBOARD_DETAILS, USER_DETAILS, CART_DETAILS } from "../actionTypes";

export const setDashboardDetails = (details) => ({
  type: DASHBOARD_DETAILS,
  payload: details,
});

export const setUser = (user) => ({
  type: USER_DETAILS,
  payload: user,
});

export const setCart = (cart) => ({
  type: CART_DETAILS,
  payload: cart,
});
