import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  AsyncStorage,
  BackHandler,
} from "react-native";

export const HeaderLeft = (navigation) => {
  return (
    <View style={styles.headerLeft}>
      <TouchableOpacity
        onPress={() => {
          navigation.toggleDrawer();
        }}
      >
        <Image source={require("../assets/menu.png")} />
      </TouchableOpacity>
    </View>
  );
};

export const HeaderRight = (navigation) => {
  return (
    <View style={styles.headerRight}>
     
      <TouchableOpacity
        onPress={() => {
          Alert.alert(null, "Are you sure you want to exit?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "YES",
              onPress: () => {
                navigation.navigate("Login",{resetUsrNmePwd: true});
                // BackHandler.exitApp();
              },
            },
          ]);
        }}
      >
        <Image source={require("../assets/logout.png")} />
      </TouchableOpacity>
    </View>
  );
};

export const HeaderTitle = (navigation) => (
  <>
    <Image style={{ marginLeft:10 }} source={require("../assets/myawaaz_logo.png")} />
  </>
);

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
  },
});
