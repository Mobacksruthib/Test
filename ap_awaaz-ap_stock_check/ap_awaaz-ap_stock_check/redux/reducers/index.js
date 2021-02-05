import { combineReducers } from "redux";
import dashboardDetials from "./dashboardDetials";
import user from "./user";
import cartDetails from "./cartDetails";
export default combineReducers({ user, dashboardDetials, cartDetails });
