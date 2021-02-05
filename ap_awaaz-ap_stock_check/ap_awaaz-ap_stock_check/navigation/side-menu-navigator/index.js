import { Dimensions } from "react-native";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";

import SideMenu from "../../screens/sideMenu";
import Navigator from "../app-navigator";

const DrawerNavigator = createDrawerNavigator(
  {
    Item1: {
      screen: Navigator,
    },
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get("window").width - 110,

  }
);

export default createAppContainer(DrawerNavigator);
