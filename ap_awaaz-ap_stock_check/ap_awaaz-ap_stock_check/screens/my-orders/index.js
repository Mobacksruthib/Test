import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  ImageBackground,
  Alert,
} from "react-native";
import CustomButton from "../../components/customButton";
import Picker from "../../components/picker";
import { data } from "../../mock-data";
import api from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import moment from "moment";
import Toast, {DURATION} from 'react-native-easy-toast';

class MyOrders extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // orders: data.myOrders,
      orders: [],
      startDate: null,
      endDate: null,
      loading: false,
      orderStatus: [
        { id: "Order Placed", label: "Order Placed" },
        { id: "Pending for pickup", label: "Order Placed" },
        { id: "At Dispatch Bay", label: "Cutting Completed" },
        { id: "Invoiced", label: "Invoiced" },
        { id: "Out for Delivery", label: "Dispatched" },
        { id: "Delivered", label: "Dispatched" },
      ],
    };
  }

  componentDidMount() {
    let maxDate = moment(new Date()).format("DD-MM-YYYY");
    this.state.startDate= maxDate;
    this.state.endDate= maxDate;
    this.fetchMyOrders();
  }

  statusMapper = (input) => {
    const formattedInput = input.replace(/\s/g, "").toLowerCase().trim();
    //console.log(formattedInput);
    switch (formattedInput) {
      case "orderplaced":
      case "pendingforpickup":
        return "Order Placed";
      case "atdispatchbay":
        return "Cutting Completed";
      case "outfordelivery":
      case "delivered":
        return "Dispatched";
      case "invoiced":
        return "Invoiced";
      default:
        return "Order Placed";
    }
  };

  getlabel(status) {
    var finddate = this.state.orderStatus.filter(data => (data.id === status))
    //console.log('abc',finddata)
    return finddata.label
  }

  fetchMyOrders = () => {
    const { access_token: authValue, userName: dealerCode } = this.props.user;
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) {
      this.toast.show('Please Select the Date')
      return;
    }else{
      var d1 = moment(startDate, 'DD-MM-YYYY')  //firstDate
      var d2 = moment(endDate, 'DD-MM-YYYY') //SecondDate
      //console.log(startDate, endDate, d1, d2)
      const range = moment(d2).diff(d1, 'days');    
      // //console.log('diffday:',range)
      if(range > 45){
        this.setState({
              orders: [],
            });
        this.toast.show('Max Allowed Date Difference 45 days');
        return;
      }  
      if(range < 0){
        this.setState({
              orders: [],
            });
        this.toast.show('Start Date Should Be Less Than End Date');
        return;
      }  


    }
    this.setState({
      loading: true,
    });
    let objParams = { dealerCode, startDate, endDate };
    let tParams = [];
    Object.keys(objParams).map((key) => {
      tParams.push(`${key}=${objParams[key]}`);
    });
    Promise.all([api.fetchData("MYORDERS", tParams, authValue)])
      .then((result) => {
        try {
          // //console.log("myorders", result);
          const [response] = result;
          const { statusCode, orderList } = response;
          const formattedData = orderList.map(
            ({ ordDate, orderNo, detailStatus }) => {
              return {
                ordDate,
                orderNo,
                status: this.statusMapper(detailStatus),
              };
            }
          );
          if (statusCode === "200") {
            this.setState({
              orders: formattedData,
            });
          }
        } catch (err) {
          //console.log("err", err);
        }
      })
      .catch((err) => {
        //console.log("err", err);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  renderTopBanner = () => {
    return (
      <View style={styles.topBanner}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
          My Orders
        </Text>
        <Image
          source={require("../../assets/filter.png")}
          style={{ width: 25, height: 20, resizeMode: "contain" }}
        />
      </View>
    );
  };

  renderControls = () => {
    return (
      <View style={{ marginTop: 5 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={{ alignItems: "center" }}>
            <Text>From Date</Text>
            <Picker
              onChange={(value) => {
                this.setState(
                  {
                    startDate: value,
                  },
                );
              }}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>To Date</Text>
            <Picker
              onChange={(value) => {
                this.setState(
                  {
                    endDate: value,
                  },
                );
              }}
            />
          </View>
           <View style={{ alignItems: "center" }}>
           <CustomButton
            onPress={this.fetchMyOrders}           
            title="Submit"
            style={styles.sbutton}
            textStyle={styles.buttonText}
            />            
          </View>
        </View>
      </View>
    );
  };

  renderOrderList = () => {
    const { orders } = this.state;
    return (
      <ScrollView style={styles.scrollView}>
        <View>{orders.map((item) => this.renderOrder(item))}</View>
      </ScrollView>
    );
  };

  renderOrder = ({ ordDate, orderNo, status }) => {
    return (
      <>
        <View style={styles.divider}></View>
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} 
          source={require('../../assets/grad-bg.png')}
        >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 70,
            backgroundColor: "",
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text} numberOfLines={1}>
              Order Date
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {ordDate}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text} numberOfLines={1}>
              Order No.
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {orderNo}
            </Text>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text} numberOfLines={1}>
              Order Status
            </Text>
            <Text style={styles.text} numberOfLines={1}>
              {status}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <CustomButton
            onPress={() => {
              this.props.navigation.navigate("MyOrderDetails", {
                orderNo,
              });
            }}
            title="VIEW ORDER DETAILS"
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        </ImageBackground>
      </>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} color="#17CFAD" />
        {this.renderTopBanner()}
        {this.renderControls()}
        <ScrollView style={styles.scrollView}>
          <View style={{ alignItems: "center" }}>{this.renderOrderList()}</View>
        </ScrollView>
        <Toast ref={(toast) => this.toast = toast}
                style={{backgroundColor:'#502B85'}}
                position='center'
                positionValue={600}
                fadeInDuration={1500}
                fadeOutDuration={2000}
                opacity={0.8}
                textStyle={{color:'#FFFFFF', padding: 10, fontSize:14, fontWeight:"bold"}}
                />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginTop: 10,
    width: "100%",
  },
  text: {
    fontSize: 14,
    lineHeight: 19,
    textAlign:'right'
  },
  footerText: {
    fontSize: 14,
    lineHeight: 19,
  },
  topBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#502B85",
    alignItems: "center",
  },
  button: {
    width: 145,
    height: 24,
    margin: 5,
    backgroundColor: "#502B85",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
  },
  sbutton: {
    width: 60,
    height: 30,
    marginTop: 25,
    backgroundColor: "#502B85",
    borderRadius: 5,
    paddingHorizontal: 5,
  }
});

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(MyOrders);
