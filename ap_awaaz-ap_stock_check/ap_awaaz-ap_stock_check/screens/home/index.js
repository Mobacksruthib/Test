import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/customButton";
import moment from "moment";
import { data } from "../../mock-data";
import Select from "../../components/select";
import api from "../../api/api";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, {DURATION} from 'react-native-easy-toast';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  }

  componentDidMount() {
    const { access_token, dealerData } = this.props.userDetails;
    const { dealerCode } = dealerData;
    let maxDate = moment(new Date()).format("DD-MM-YYYY");
    let minDate = new Date();
    minDate = moment(minDate).subtract(1, "months").format("DD-MM-YYYY");

    let params = [
      "dealerCode=" + dealerCode,
      "lowDate=" + minDate,
      "highDate=" + maxDate,
    ];

    this.setState({ loading: true });

    Promise.all([api.fetchData("ACCOUNT", params, access_token)])
      .then((result) => {
        try {
          let [data] = result;
          //console.log("result123", data);
          if (data.balanceDataTab.creditLimit !== undefined) {
            this.setState({
              data: [
                ...this.state.data,
                { key: "Credit Limit", value: data.balanceDataTab.creditLimit },
              ],
            });

            let tparams = ["dealerCode=" + dealerCode];

            Promise.all([
              api.fetchData("allDuePayments", tparams, access_token),
            ])
              .then((result1) => {
                try {
                  let [data1] = result1;
                  let findLastData = data1.allDuePayments.pop();
                  // consol.log(data1)
                  if (dealerCode) {
                    let calorieTotal = 0;
                    let findData = data1.allDuePayments.filter(
                      (item) =>
                        item.dueDate == moment(new Date()).format("DD/MM/YYYY")
                    );
                    calorieTotal = findData.reduce(
                      (totalCalories, meal) => totalCalories + meal.totalAmount,
                      0
                    );

                    //console.log(data1.overDuePaymentsTotalAmount);
                    //console.log(findLastData.totalAmount, calorieTotal);

                    this.setState({
                      data: [
                        ...this.state.data,
                        {
                          key: "Net Outstanding",
                          value: findLastData.totalAmount,
                        },
                      ],
                    });
                    this.setState({
                      data: [
                        ...this.state.data,
                        {
                          key: "Overdue Amount",
                          value: data1.overDuePaymentsTotalAmount,
                        },
                      ],
                    });
                    this.setState({
                      data: [
                        ...this.state.data,
                        { key: "Today's amount due", value: calorieTotal },
                      ],
                    });
                  } else {
                    this.toast.show("Dealer Details Not available");
                  }
                } catch (err) {
                  //console.log(err);
                  this.toast.show("Dealer Details Not available");
                }
              })
              .catch((err) => {
                //console.log("err", err);
                this.toast.show("Dealer Details Not available");
              });
          } else {
            this.toast.show("Dealer Details Not available");
          }
        } catch (err) {
          //console.log(err);
          this.toast.show("Dealer Details Not available");
        }
      })
      .catch((err) => {
        //console.log("err", err);
        this.toast.show("Dealer Details Not available");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  handlePlaceOrder = () => {};

  renderTopBanner = () => {
    const { dealerData } = this.props.userDetails;
    const { dealerName, dealerCode } = dealerData;
    return (
      <View style={styles.topBanner}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            justifyContent: "space-around",
            borderRadius: 5,
            height: 40,
          }}
        >
          <Text style={{ fontSize: 18 }}>{dealerName}</Text>
          <Text style={{ fontSize: 18 }}>{dealerCode}</Text>
        </View>
      </View>
    );
  };

  footerContent = () => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PlaceOrder");
        }}
        style={styles.imageContainer}
      >
        <Image
          source={require("../../assets/place_order_dashboard.png")}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  renderTable = () => {
    const { data } = this.state;
    return data.map(({ key, value }) => {
      return (
        <>
          <View style={styles.row} key={key}>
            <Text key={`text-${key}`} style={styles.text}>
              {key}
            </Text>
            <Text key={`text-${value}`} style={styles.text}>
              {Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
          </View>
          <View style={styles.divider}></View>
        </>
      );
    });
  };

  render() {
    const { navigation } = this.props;
    return (
      <>
        <View style={styles.container}>
          <Spinner visible={this.state.loading} color="#17CFAD" />
          {this.renderTopBanner()}          
          <View style={styles.divider}></View>
          <View style={styles.tableContainer}>{this.renderTable()}</View>
          {this.footerContent()}
          <Toast ref={(toast) => this.toast = toast}
                style={{backgroundColor:'#502B85'}}
                position='center'
                positionValue={600}
                fadeInDuration={3000}
                fadeOutDuration={4000}
                opacity={0.8}
                textStyle={{color:'#FFFFFF', padding: 10, fontSize:14, fontWeight:"bold"}}
                />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  image: {
    // flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  button: {
    display: "flex",
    height: 30,
    width: 120,
    backgroundColor: "#17CFAD",
  },
  topBanner: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#502B85",
    // alignItems: "center",
    // width: "100%",
  },
  buttonsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    display: "flex",
    padding: 10,
  },
  text: {
    color: "#000000",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "200",
  },
  textInput: {
    color: "#000000",
    fontSize: 18,
    lineHeight: 24,
    borderBottomColor: "#A5A5A5",
    borderBottomWidth: 2,
    textAlign: "right",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
    marginHorizontal: 10,
    marginBottom: 20,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 48,
  },

  footer: {
    backgroundColor: "#17CFAD",
    alignItems: "center",
    overflow: "hidden",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
  },
});

const mapStateToProps = (state) => {
  return { userDetails: state.user };
};

export default connect(mapStateToProps)(Home);
