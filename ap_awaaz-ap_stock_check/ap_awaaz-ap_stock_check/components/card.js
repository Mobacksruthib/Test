import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

const Card = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }} >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  card: {
    display: "flex",
    minHeight: 48,
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    justifyContent: "space-evenly",
    padding: 10,
  },
});

export default Card;
