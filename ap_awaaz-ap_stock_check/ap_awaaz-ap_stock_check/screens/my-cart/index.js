import React, { PureComponent, Fragment } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  View,
  Alert,
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import Select from "../../components/select";
import Quantity from "../../components/quantity";
import { data } from "../../mock-data";
import api from "../../api/api";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import NumericInput from "react-native-numeric-input";
import Toast, { DURATION } from "react-native-easy-toast";
import RNPickerSelect from "react-native-picker-select";
import { setCart } from "../../redux/actions/actions";
import { bindActionCreators } from "redux";

class MyCart extends PureComponent {
  constructor(props) {
    super(props);

    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, paymentTerms, paymentTermCode } = dealerData;
    //console.log('dealerCode:',dealerData)
    console.log(this.props.cartDetails.cartId);
    this.state = {
      cartId: this.props.cartDetails.cartId,
      paymentCode: paymentTermCode,
      newItems: [],
      selectedPayment: paymentTermCode,
      cartItems: [],
      newItems: [],
      loading: true,
      dropdownValue: paymentTermCode,
    };
  }

  componentDidMount() {
    console.log("in component did mount", this.state);
    if (this.state.cartId) {
      this.getCart();
    }
  }

  getCart() {
    this.setState({
      loading: true,
    });
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, paymentTerms, paymentTermCode } = dealerData;

    let params = ["/" + dealerCode + "_01/getcart/" + this.state.cartId];
    var newItems1 = paymentTerms.map((item) => {
      return { ...item, id: item.pmntTermCode };
    });
    var newItems2 = newItems1.map((item) => {
      return { ...item, name: item.pmntTermDesc };
    });
    var newItems3 = newItems2.map((item) => {
      return { ...item, label: item.pmntTermDesc };
    });
    var newItems4 = newItems3.map((item) => {
      return { ...item, value: item.pmntTermCode };
    });
    //console.log(newItems2)
    this.setState({
      loading: true,
    });
    this.state.newItems = newItems4;
    // if (this.state.newItems.length == 1) {
    //   this.state.newItems.unshift({ value: null, label: "Select a Payment Term" });
    // }
    var l = this.state.newItems.findIndex(
      (obj) => obj.id == this.state.paymentCode
    );
    //console.log('sl:',l)
    //console.log('newItems2',this.state.newItems)
    Promise.all([api.fetchData("GETCARTITEMS", params, access_token)])
      .then((result) => {
        try {
          let [data] = result;
          console.log("GETCARTITEMS", data);
          this.setState({ cartItems: data.entries });
        } catch (err) {
          //console.log("eer-c", err);
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
  }

  /*   componentDidMount() {
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, paymentTerms } = dealerData;
  } */

  changeqty(a, b) {
    //console.log(a, b)
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, paymentTerms } = dealerData;
    if (this.state.cartId != "") {
      //console.log('Cart Id22:',this.state.cartId,'qty:',b );

      var maction = "UPDATE";
      if (b == 0) {
        maction = "REMOVE";
      }

      var raw = JSON.stringify({
        dealerCode: dealerCode + "_01",
        cartID: this.state.cartId,
        stockInd: "green",
        EmptyCartFlag: "false",
        items: [
          {
            skuCode: a,
            quantity: b,
            action: maction,
          },
        ],
      });

      // console.log("raw", raw); 
      Promise.all([api.postData("MODIFYCART", raw, access_token)])
        .then((result2) => {
          try {
            let [data2] = result2;
             console.log("MODIFYCART", data2);
            if(!data2.isCartInValidOrExpired){
              if (data2.entries !== undefined) {
                if (data2.entries.length == 0) {
                  this.setState({ cartItems:[] });             
                  this.toast.show("Product is empty");   
                  // console.log('empty');
                } else if (maction == "REMOVE") {
                  this.removeItem(a);
                  // this.toast.show("Product "+maction+" to Cart");
                  // this.getCart().bind;
                }
              }else if(data2.errors[0].message){
                  this.removeItem(a);
                  this.toast.show(data2.errors[0].message)
              }
            }else {
              this.setState({ cartItems:[] }); 
              this.toast.show(data2.cartMessageIfExpired)
            }
            
          } catch (err) {
            //console.log(err);
          }
        })
        .catch((err) => {
          //console.log("err-abc", err);
        });
    } else {
      this.toast.show("Cart Not Found");
    }
  }

  removeItem(sku) {
    //console.log('sku-delete', sku)
    var array = [...this.state.cartItems]; // make a separate copy of the array
    if(array.length==1){
      this.setState({ cartItems:[] });
      return;
    }
    var index = array.findIndex((obj) => obj.productCode === sku);
    if (index !== -1) {
      array.splice(index, 1);      
      this.setState({ cartItems: array });
      this.toast.show("Product " + sku + " Deleted From Cart");
    }
  }

  submitOrder = () => {
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, plantCode } = dealerData;
    const { selectedPayment, cartId } = this.state;
    const { navigation } = this.props;
    var raw = JSON.stringify({
      dealerCode: dealerCode + "_01",
      cartID: cartId,
      paymentTerm: selectedPayment,
      plantCode: plantCode,
      items: [],
    });

    if (
      this.state.selectedPayment == "" ||
      this.state.selectedPayment == null
    ) {
      this.toast.show("Please Select The Payment");
      return;
    }
    this.setState({
      loading: true,
    });

    Promise.all([api.postData("CARTSUBMIT", raw, access_token)])
      .then((result2) => {
        try {
          let [data2] = result2;
          console.log(data2);
          // "isCartInValidOrExpired": "false",
          if (data2.isCartInValidOrExpired === "true") {
            this.toast.show("The Cart is Invalid");
            this.props.setCart({});
            return;
          }
          if (data2.erpOrderId !== undefined) {
            this.toast.show(
              "Order Id : " +
                data2.erpOrderId +
                "\nOrder Amount:" +
                data2.erpOrderTotal +
                "\nSuccessFull",
              4500,
              () => {
                navigation.navigate("MyOrders");
              }
            );
          } else {
            this.toast.show("Order Not SuccessFull");
          }
        } catch (err) {
          //console.log(err);
        }
      })
      .catch((err) => {
        //console.log("err-abc", err);
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
        <Text style={styles.topBannerText}>PAYMENT TERM</Text>
      </View>
    );
  };

  renderFooter = () => {
    const { navigation } = this.props;
    if (this.state.cartItems.length) {
      return (
        <>
          <TouchableOpacity onPress={this.submitOrder}>
            <View
              style={{
                backgroundColor: "#502B85",
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 18 }}>
                SUBMIT ORDER
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
    }
  };

  renderCartItem = ({ productCode, productName, quantity }) => {
    return (
      <>
        <View style={styles.divider}></View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            minHeight: 90,
            backgroundColor: "",
          }}
        >
          <View>
            <Text numberOfLines={1}>{productCode}</Text>
            <Text style={{ width: 200 }} numberOfLines={1}>
              {productName}
            </Text>
          </View>
          <View style={{ paddingLeft: 10 }}>
            <NumericInput
              initValue={quantity}
              onChange={(quantity) => {
                this.changeqty(productCode, quantity);
              }}
              onLimitReached={(isMax, msg) => console.log(isMax, msg)}
              totalWidth={90}
              totalHeight={40}
              iconSize={25}
              step={1}
              minValue={1}
              maxValue={99999}
              valueType="integer"
              rounded
              textColor="#B0228C"
              iconStyle={{ color: "white" }}
              rightButtonBackgroundColor="#502B85"
              leftButtonBackgroundColor="#502B85"
              containerStyle={{
                padding: 10,
                marginTop: 5,
              }}
            />
          </View>
          <View style={{ paddingLeft: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.changeqty(productCode, 0);
              }}
            >
              <Image source={require("../../assets/delete.png")} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };
  renderCart = () => {
    const { cartItems } = this.state;
    return (
      <ScrollView style={styles.scrollView}>
        <View>{cartItems.map((item) => this.renderCartItem(item))}</View>
      </ScrollView>
    );
  };
  render() {
    
    if (this.state.cartItems.length) {
      return (
        <SafeAreaView style={styles.container}>
          <Spinner visible={this.state.loading} color="#17CFAD" />

          {this.renderTopBanner()}
          <RNPickerSelect
            value={this.state.selectedPayment}
            items={this.state.newItems}
            onValueChange={(val) => {
              this.setState({ selectedPayment: val });
            }}
            style={{ headlessAndroidContainer: { flex: 1 },  inputIOS: {
        color: '#502B85',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
      },
      inputAndroid: {
        color: '#502B85',
      }, }}
            placeholder={{
              label: "Select a Payment Term",
              value: null,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>My Cart</Text>
            <Image
              source={require("../../assets/my_cart_screen_cart.png")}
              style={{ width: 30, height: 30, resizeMode: "contain" }}
            />
          </View>

          {(this.state.cartItems.length) ? this.renderCart() : null}
          {this.renderFooter()}
          <Toast
            ref={(toast) => (this.toast = toast)}
            style={{ backgroundColor: "#502B85", width: "75%" }}
            position="center"
            positionValue={600}
            fadeInDuration={1500}
            fadeOutDuration={4500}
            opacity={0.8}
            textStyle={{
              color: "#FFFFFF",
              padding: 10,
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <Spinner visible={this.state.loading} color="#17CFAD" />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#502B85" }}
            >
              Cart is Empty
            </Text>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    margin: 5,
  },
  topBanner: {
    padding: 10,
    backgroundColor: "#502B85",
  },
  topBannerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingBottom: 5,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
  },
  footerText: {
    padding: 10,
  },
});

const mapStateToProps = (state) => {
  return { userDetails: state.user, cartDetails: state.cartDetails };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setCart }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCart);
