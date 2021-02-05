import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
  const { onPress, title, style, textStyle } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ ...styles.button, ...style }}>
        <Text style={{ ...styles.buttonText, ...textStyle }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    height: 40,
    paddingVertical: 2,
    // paddingHorizontal: 5,
    borderRadius: 15,
    alignContent: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
  },
});

export default CustomButton;
