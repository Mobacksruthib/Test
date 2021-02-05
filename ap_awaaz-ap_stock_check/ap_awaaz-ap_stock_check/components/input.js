import React, { Component } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

class Input extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { placeholder, type, onChange, value } = this.props;
    return (
      <View
        style={{ alignItems: "center", justifyContent: "center", padding: 15 }}
      >
        <TextInput
          secureTextEntry={type === "password"}
          style={styles.text}
          placeholder={placeholder || "Enter"}
          onChangeText={(text) => {
            onChange(text);
          }}
          value={value}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "grey",
    fontSize: 18,
    lineHeight: 24,
    width: "80%",
    height: 48,
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
  },
});

export default Input;
