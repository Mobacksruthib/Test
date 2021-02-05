import React, { PureComponent } from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import Navigator from "./navigation/app-navigator";
import DrawerNavigator from "./navigation/side-menu-navigator";
import store from "./redux/store";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
  "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
  "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
  "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
  "DoHyeon-Regular": require("./assets/fonts/DoHyeon-Regular.ttf"),
  "Audiowide-Regular": require("./assets/fonts/Audiowide-Regular.ttf"),
  "RobotoSlab-ExtraBold": require("./assets/fonts/RobotoSlab-ExtraBold.ttf"),
  "RobotoSlab-Bold": require("./assets/fonts/RobotoSlab-Bold.ttf"),
  SegoeUI: require("./assets/fonts/segoeui.ttf"),
};

export default class App extends PureComponent {
  state = {
    firstLaunch: null,
    fontsLoaded: false,
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        this.setState({ firstLaunch: true });
      } else {
        this.setState({ firstLaunch: false });
      }
    });
  }

  render() {
    const { firstLaunch, fontsLoaded } = this.state;

    if (!fontsLoaded) {
      return <AppLoading />;
    }

    switch (firstLaunch) {
      case null:
        return null;
      case true:
        return <></>;
      case false:
        return (
          <Provider store={store}>
            {/* <Navigator /> */}
            <DrawerNavigator />
          </Provider>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
