import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Button,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import Login from "../../screens/login";
import { LinearGradient } from "react-native-linear-gradient";
import Home from "../../screens/home";
import { HeaderLeft, HeaderRight, HeaderTitle } from "../../components/header";
import PlaceOrder from "../../screens/place-order";
import MyCart from "../../screens/my-cart";
import Search from "../../screens/search";
import GenerateOtp from "../../screens/forgot-password/generate-otp";
import ResetPassword from "../../screens/forgot-password/reset-password";
import MyOrders from "../../screens/my-orders";
import MyOrderDetails from "../../screens/my-order-details";
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;


const Navigator = createStackNavigator({
  Login,
  MyOrders: {
    screen: MyOrders,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92
      },
      android: {
        height:80
      },
    }),}} />
    }),
  },
  MyOrderDetails: {
    screen: MyOrderDetails,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  GenerateOtp: {
    screen: GenerateOtp,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle(navigation),
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),      
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  PlaceOrder: {
    screen: PlaceOrder,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  Search: {
    screen: Search,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
  MyCart: {
    screen: MyCart,
    navigationOptions: ({ navigation }) => ({
      headerTitle: HeaderTitle,
      headerLeft: () => HeaderLeft(navigation),
      headerRight: () => HeaderRight(navigation),
      headerBackground:<Image source={require("../../assets/grad-bg.png")} style={{resizeMode:"cover", ...Platform.select({
      ios: {
        height:92,
        width:DEVICE_WIDTH
      },
      android: {
        height:80,
        width:DEVICE_WIDTH
      },
    }),}} />
    }),
  },
});
export default createAppContainer(Navigator);
