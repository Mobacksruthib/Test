import React, { PureComponent } from "react";
import {
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import CustomButton from "./customButton";

const INCREMENT = "increment";
const DECREMENT = "decrement";

class Quantity extends PureComponent {
  constructor(props) {
    super(props);
    let { value } = props;
    value = value ? value.toString() : "1";
    this.state = {
      quantity: value,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value.toString() !== state.quantity.toString()) {
      return {
        quantity: state.quantity.toString(),
      };
    }
    return null;
  }

  renderTitle = () => {
    const { title } = this.props;
    return title ? <Text style={styles.compTitle}>{title}</Text> : null;
  };

  changeQuantityBy = (type) => {
    let _q = Number(this.state.quantity);
    _q = type === INCREMENT ? _q + 1 : _q <= 1 ? 1 : _q - 1;
    this.setState(
      {
        quantity: _q.toString(),
      },
      () => {
        const { onChange } = this.props;
        onChange ? onChange(this.state.quantity) : null;
      }
    );
  };

  render() {
    const { quantity } = this.state;
    return (
      <View
        style={{
          // alignItems: "center",
          // justifyContent: "center",
          flex: 1,
          //   flexDirection: "column",
          //   minWidth: 120,
          // width: "100%",
        }}
      >
        {this.renderTitle()}
        <View style={{ width: 50, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              this.changeQuantityBy(DECREMENT);
            }}
          >
            <Image
              source={require("../assets/minus.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            onChangeText={(v) => {
              if (isNaN(Number(v))) return;
              this.setState({ quantity: v });
            }}
            keyboardType="numeric"
            value={quantity}
            defaultValue={quantity}
            maxLength={3}
          />
          <TouchableOpacity
            onPress={() => {
              this.changeQuantityBy(INCREMENT);
            }}
          >
            <Image source={require("../assets/plus.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: 50,
    color: "#000000",
    textAlign: "center",
    borderWidth: 0.5,
    margin: 10,
  },
  button: {
    width: 60,
    height: 24,
    margin: 5,
    backgroundColor: "#502B85",
    borderRadius: 7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  compTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Quantity;
