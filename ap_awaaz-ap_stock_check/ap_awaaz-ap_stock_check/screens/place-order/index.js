import React, { PureComponent, Fragment } from "react";
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
  Clipboard,
} from "react-native";
import Constants from "expo-constants";
import Quantity from "../../components/quantity";
import CustomButton from "../../components/customButton";
import Select from "../../components/select";
import SearchableDropdown from "react-native-searchable-dropdown";
import NumericInput from "react-native-numeric-input";
import api from "../../api/api";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import RNPickerSelect from "react-native-picker-select";
import { setCart } from "../../redux/actions/actions";
import { bindActionCreators } from "redux";


var items = [];
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class PlaceOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantity: "1",
      newItems: [],
      selectedSKU: "",
      selectedName: "",
      selectedYear: "",
      selectedBook: "",
      selectedQty: 0,
      selectedItems: [],
      statusColortext: "",
      statusColor: "",
      colorStyles: {},
      cartId: "",
      productAvailable: false,
      cutRate: "",
      discount: "",
      prdquantity: "",
      loading: false,
      screentypes: [
        { label: "SKU  ", value: 0 },
        { label: "BookValue", value: 1 },
      ],
      screenTypeVal: 0,
      skuYears : [],
      skuBooks : [],
      skuBooksSku : [],
      selectedBookYear:0,
      selectedBook:'',
      selectedBookSku:'',
      opacityblock1:100,
      opacityblock2:0,
    };
    this.inputRef = React.createRef();
    this.getDataArray = this.getDataArray.bind(this)
  }

  getDataArray(a){
    var b = this.state.newItems;
     var arrLength = b.length;
      if(a=='year'){
        for(var i=0; i<arrLength; i++){
           if( (b[i].year !== undefined ) && (!isNaN(b[i].year)) && (!this.state.skuYears.some(o => o.value === b[i].year))){
              this.state.skuYears.push({label:b[i].year, value:b[i].year})
           }         
        }
        this.state.skuYears.sort((a,b) => a.value - b.value);
        console.log('abc:',this.state.skuYears)
      }
      if((a =='books') && (this.state.selectedBookYear!='')){
        let bookNameTemp = []
        for(var i=0; i<arrLength; i++){
          if( (b[i].bookName!== undefined ) && (this.state.selectedBookYear == b[i].year ) && (!bookNameTemp.some(o => o.value === b[i].bookName)) ){
            bookNameTemp.push({label:b[i].bookName, value:b[i].bookName})            
          }
        }
        bookNameTemp.sort((a,b) => a.value - b.value);        
        this.setState({skuBooks: bookNameTemp});
        console.log('abc2:',this.state.skuBooks)
      }
      // console.log(this.state.selectedBookYear, '--', this.state.selectedBook)        
      if((a=='bookssku') && (this.state.selectedBook!='')){
        let bookYearTemp = []
        for(var i=0; i<arrLength; i++){
          if((this.state.selectedBookYear == b[i].year ) && (this.state.selectedBook == b[i].bookName )  && (!bookYearTemp.some(o => o.value === b[i].code)) ){
            bookYearTemp.push({label:b[i].code, value:b[i].code})
          }          
        }    

        bookYearTemp.sort((a,b) => a.value - b.value);
        this.setState({skuBooksSku: bookYearTemp});
        console.log('abc3:',this.state.skuBooksSku)    
      }
      
  }

  componentDidMount() {
    let params = [];
    const { access_token } = this.props.userDetails;

    Promise.all([api.fetchData("SKULIST", params, access_token)])
      .then((result) => {
        try {
          let [data] = result;
          //console.log('skulist:', data);
          var newItems4 = data.autoCompleteDTO.map((item) => {
            return { ...item, value: item.code };
          });
          var newItems3 = newItems4.map((item) => {
            return { ...item, label: item.name + "\n" + item.code };
          });
          var newItems2 = newItems3.map((item) => {
            return { ...item, id: item.code };
          });
          var newItems1 = newItems2.map((item) => {
            return { ...item, name: item.name + "\n" + item.code };
          });
          this.setState({
            newItems: [...this.state.newItems, ...newItems1],
            //adding the new data in Data Source of the SearchableDropdown
          });

          this.getDataArray('year');          
          //console.log("abc-1", this.state.newItems);
        } catch (err) {
          //console.log(err);
        }
      })
      .catch((err) => {
        //console.log("err", err);
      });

    this.getScanner();
  }

  copyToClipboard = (data) => {
    Clipboard.setString(data);
    this.state.selectedSKU = data;
  };

  async getScanner() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      CameraPermissionGranted: status === "granted" ? true : false,
    });
  }

  handleBarCodeScanned = ({ data }) => {
    //console.log(`${data}`);
    //this.setState({ selectedSKU : `${data}` } );
    this.state.selectedSKU = `${data}`;
    this.setState({
      qrdisplay: !this.state.qrdisplay,
    });
    // this.toast.show(`Bar code data ${data} has been scanned!`);
    this.toast.show(null, data, [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Copy text",
        onPress: () => {
          this.copyToClipboard(data);
        },
      },
    ]);
  };

  toggleStatus() {
    this.setState({
      qrdisplay: !this.state.qrdisplay,
    });
    //console.log("toggle button handler: " + this.state.qrdisplay);
  }

  addItemtoCart = () => {
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode } = dealerData;
    if (this.state.selectedSKU == "") {
      this.toast.show("Please Select the product");
    } else {
      let params = ["dealerCode=" + dealerCode + "_01"];
      this.setState({ loading: true });
      Promise.all([api.fetchData("GETCART", params, access_token)])
        .then((result) => {
          try {
            let [data] = result;
            //console.log(data);
            let [findData] = data.carts.filter(
              (item) => item.salesType == "RETAIL_SALES"
            );
            if (findData.cartID) {
              this.setState({ cartId: findData.cartID });
              this.props.setCart({
                cartId: findData.cartID,
              });
            } else {
              let tparams = [dealerCode + "/carts"];
              Promise.all([api.postData("CREATECART", tparams, access_token)])
                .then((result2) => {
                  try {
                    let [data2] = result2;
                    this.setState({ cartId: data2.code });
                    this.props.setCart({
                      cartId: data2.code,
                    });
                    //console.log(data2.code);
                  } catch (err) {
                    //console.log(err);
                  }
                })
                .catch((err) => {
                  //console.log("err", err);
                });
            }
            //console.log('cartid:',this.state.cartId);

            if (this.state.cartId != "") {
              var raw = JSON.stringify({
                dealerCode: dealerCode + "_01",
                cartID: this.state.cartId,
                stockInd: "green",
                EmptyCartFlag: "false",
                items: [
                  {
                    skuCode: this.state.selectedSKU,
                    quantity: this.state.selectedQty,
                    action: "ADD",
                  },
                ],
              });

              Promise.all([api.postData("MODIFYCART", raw, access_token)])
                .then((result2) => {
                  try {
                    let [data2] = result2;
                    //console.log('result4', data2);
                    if (data2.errors) {
                      this.toast.show(data2.errors[0].message);
                    } else {
                      if (data2.entries.length == 0) {
                        this.toast.show("Product is empty");
                      } else {
                        this.toast.show("Product Added to Cart");
                        this.handleClear();
                      }
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
          } catch (err) {
            //console.log(err);
          }
        })
        .catch((err) => {
          //console.log("err", err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  };

changeView = () => {
  if(this.state.screenTypeVal){
    this.setState({
      opacityblock1:0,
      opacityblock2:100,
      selectedSKU: "",
      selectedQty: 0,
      statusColortext:"",      
      selectedName: "",
      selectedYear: "",
      selectedBook: "",
      productAvailable: false,
      });
  }else{
    this.setState({
      opacityblock1:100,
      opacityblock2:0,
      selectedSKU: "",
      selectedQty: 0,
      statusColortext:"",
      selectedName: "",
      selectedYear: "",
      selectedBook: "",
      productAvailable: false,
      });
  }
  
}

  handleClear = () => {
    const { navigation } = this.props;
    this.setState({
      quantity: "1",
      selectedSKU: "",
      selectedQty: 0,
      selectedName: "",
      selectedYear: "",
      selectedBook: "",
      selectedBookYear:0,
      selectedBook:'',
      selectedBookSku:'',
      statusColortext: "",
      statusColor: "",
      colorStyles: {},
      productAvailable: false,
    });
    if(!this.state.screenTypeVal){
      this.inputRef.current.input.clear();
    }
  };

  handleSubmit = () => {
    const { dealerData, access_token } = this.props.userDetails;
    const { dealerCode, plantCode } = dealerData;
    if (this.state.selectedSKU === undefined || this.state.selectedSKU == "") {
      this.toast.show("Please Select SKU");
      return;
    }
    let findData = this.state.newItems.filter(
      (item) => item.code == this.state.selectedSKU
    );
    //console.log('fdata',findData)
    if (findData.length) {
      this.setState({
        selectedName: findData[0].name,
        selectedYear: findData[0].year,
        selectedBook: findData[0].bookName,
      });
    }
    this.setState({ productAvailable: false });
    let tparams = [
      "plantCode=" + plantCode,
      "materialCode=" + this.state.selectedSKU,
    ];
    this.setState({
      cutRate: "",
      discount: "",
      prdquantity: "",
    });
    this.setState({ loading: true });
    Promise.all([api.fetchData("PRODDISCNT", tparams, access_token)])
      .then((result1) => {
        try {
          let [data1] = result1;
          //console.log('result3',data1)
          if (data1.fabricList.length) {
            this.setState({
              cutRate: data1.fabricList[0].price,
              discount: data1.fabricList[0].discount,
              prdquantity: parseFloat(data1.fabricList[0].quantity),
            });
            this.setState({ productAvailable: true });
          } else {
            this.toast.show(data1.statusMessage);
          }
          //console.log(this.state.selectedSKU, "--", this.state.selectedQty);          
        } catch (err) {
          //console.log(err);
        }
      })
      .catch((err) => {
        //console.log("err", err);
        this.toast.show("Product Not Found");
      })
      .finally(() => {
        this.setState({ loading: false });
      });

      let params = [
            "id=" + this.state.selectedSKU,
            "plantCode=" + plantCode,
            "quantity=" + this.state.selectedQty,
          ];
          Promise.all([api.fetchData("SKUAVAILABLITY", params, access_token)])
            .then((result) => {
              try {
                let [data] = result;
                //console.log('result5',data)
                if (data.status) {
                  this.setState({ statusColor: data.result });
                  if (data.result == "green") {
                    this.setState({ statusColortext: "Available" });
                  } else if (data.result == "red") {
                    this.setState({ statusColortext: "Not Available" });
                  } else if (data.result == "ammer") {
                    this.setState({ statusColortext: "Pending" });
                  }
                  this.setState({
                    colorStyles: {
                      backgroundColor: data.result,
                    },
                  });
                } else {
                  this.setState({ statusColortext: "" });
                  this.setState({ statusColor: "" });
                  this.toast.show(data.message[0]);
                }
                //console.log(data);
              } catch (err) {
                //console.log(err);
              }
            })
            .catch((err) => {
              //console.log("err", err);
              this.toast.show("Product Not Found");
            });
  };

  renderTopBanner = () => {
    return (
      <View style={styles.topBanner}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
          Place Orders
        </Text>
        <Image
          source={require("../../assets/filter.png")}
          style={{ width: 25, height: 20, resizeMode: "contain" }}
        />
      </View>
    );
  };

  renderRadioButton = () => {
    return (
      <View>
        <RadioForm
          radio_props={this.state.screentypes}
          initial={0}
          formHorizontal={true}
          labelHorizontal={true}
          buttonColor={'#502B85'}
          selectedButtonColor={'#502B85'}          
          animation={true}
          onPress={(value1) => {
            this.state.screenTypeVal = value1;
            this.changeView()
          }}
        />
      </View>
    );
  };

  renderStatusColor = () => {
    if (this.state.statusColortext != "") {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={[styles.circle, this.state.colorStyles]}>
            <Text style={styles.textab}>{this.state.statusColortext}</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  renderPicker = () => {
    
    if (this.state.screenTypeVal!='0'){


          return (
            <> 
            <View style={{ flexDirection: "row", padding:4  }}>  
                  <Select
                    items={
                      this.state.skuYears 
                    }
                    value={this.state.selectedBookYear}
                    style={{ width: "75%", opacity:this.state.opacityblock2 }}
                    itemKey="value"
                    itemLabel="label"
                    onChange={(changedValue) => {
                      this.state.selectedBookYear= changedValue; 
                      this.state.skuBooks =[];
                      this.state.skuBooksSku =[];
                      this.state.selectedBook='';
                      this.state.selectedBookSku='';
                      this.getDataArray('books');                      
                    }}
                  />
                </View>

                <View style={{ flexDirection: "row", padding:4  }}>  
                  <Select
                    items={
                      this.state.skuBooks 
                    }
                    value={this.state.selectedBook}
                    style={{ width: "75%", opacity:this.state.opacityblock2  }}
                    itemKey="value"
                    itemLabel="label"
                    onChange={(changedValue) => {
                      this.state.selectedBook= changedValue
                      this.getDataArray('bookssku');
                    }}
                  />
                </View> 

                <View style={{ flexDirection: "row", padding:4  }}>  
                  <Select
                    items={
                      this.state.skuBooksSku
                    }
                    value={this.state.selectedBookSku}
                    style={{ width: "75%", opacity:this.state.opacityblock2  }}
                    itemKey="value"
                    itemLabel="label"
                    onChange={(changedValue) => {
                      this.state.selectedBookSku= changedValue;
                      this.state.selectedSKU= changedValue;
                    }}
                  />
                </View> 
                </> 
          );

    }else{
      return (
      <>            
        <View style={{ flexDirection: "row", padding:4  }}>  
          <Fragment>
            {/* Single */}
            <SearchableDropdown
                  onItemSelect={(item) => {
                    this.setState({ selectedSKU: item.id });
                    this.setState({ qrdisplay: false });
                    this.setState({ productAvailable: false,
                                    selectedName: "",
                                    selectedYear: "",
                                    selectedBook: "",
                                    statusColortext: "",
                     });   
                    
          
                  }}
                  ref={this.inputRef}
                  containerStyle={{ padding: 5 }}
                  onRemoveItem={(item, index) => {
                    const items = this.state.selectedItems.filter(
                      (sitem) => sitem.id !== item.id
                    );
                    this.setState({ selectedItems: items });
                    this.setState({ selectedSKU: item.id });
                  }}
                  itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: "#ddd",
                    borderColor: "#bbb",
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  itemTextStyle={{ color: "#222" }}
                  itemsContainerStyle={{ maxHeight: 140 }}
                  items={this.state.newItems}
                  defaultIndex={
                    this.state.newItems.length
                      ? this.state.newItems.findIndex(
                          (obj) => obj.id === this.state.selectedSKU
                        )
                      : 0
                  }
                  resetValue={false}
                  textInputProps={{
                    placeholder: "Enter SKU Code                                                       ",
                    underlineColorAndroid: "transparent",
                    style: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#000",
                      borderRadius: 5,
                      height:55,
                      opacity:this.state.opacityblock1 
                    },
                    // onTextChange: text => alert(text)
                  }}
                  listProps={{
                    nestedScrollEnabled: true,
                  }}
                />
          </Fragment>
        </View>
      </>
      );
    }
          
  };


  renderControls = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", padding: 4 }}>
          {this.renderRadioButton()}
        </View>
          {this.renderPicker()}
        <View style={{ flexDirection: "row", padding: 8 }}>
          <Text style={styles.titleLabel}>Quantity (Mts)</Text>
          <NumericInput
            initValue={this.state.selectedQty}
            onChange={(selectedQty) => {
              this.setState({ selectedQty });
            }}
            onLimitReached={(isMax, msg) => console.log(isMax, msg)}
            totalWidth={100}
            totalHeight={50}
            iconSize={25}
            step={1}
            minValue={0}
            valueType="real"
            textColor="#B0228C"
            iconStyle={{ color: "white" }}
            rightButtonBackgroundColor="#502B85"
            leftButtonBackgroundColor="#502B85"
            containerStyle={{
              padding: 10,
              margin: 5,
            }}
          />
          {(!this.state.screenTypeVal) ? <TouchableOpacity
            onPress={() => this.toggleStatus()}
            style={styles.imageContainer}
          >
            <Image
              source={require("../../assets/qr-code-scan.png")}
              style={styles.Scanimage}
            />
          </TouchableOpacity> : null }
        </View>
        <View style={{ flexDirection: "row", padding: 8 }}>
          <CustomButton
            title="SUBMIT"
            style={styles.button}
            onPress={this.handleSubmit}
            textStyle={styles.buttonText}
          />
          <CustomButton
            title="CLEAR"
            style={styles.button}
            onPress={this.handleClear}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    );
  };
  
    renderProductDetails = () => {
    console.log('abd: ', this.state.selectedBook)
    var label2cnt = ((this.state.selectedBook !== undefined) && (this.state.selectedBook !== '') ?   this.state.selectedBook+', '+this.state.selectedYear : null ) ;
    if (
      this.state.selectedSKU != "" &&
      !this.state.qrdisplay
    ) {
      return (
        <View>
          { this.state.productAvailable ? (<>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={styles.headerControlButtonLabel}
              textStyle={styles.headerControlButtonLabelText}
            >
              Basic Cut Rate (Rs/mt)
            </Text>
            <Text
              style={styles.headerControlButtonLabel}
              textStyle={styles.headerControlButtonLabelText}
            >
              Bulk Discount*
            </Text>
          </View>
          <View style={{ flexDirection: "row", padding: '3%' }}>
            <CustomButton
              title={this.state.cutRate}
              style={styles.headerControlButton}
              textStyle={styles.headerControlButtonText}
            />
            <CustomButton
              title={this.state.discount}
              style={styles.headerControlButton}
              textStyle={styles.headerControlButtonText}
            />
            <Text style={{ padding: 2 }}>*(on or above</Text>
            <Text style={{ padding: 2 }}>{this.state.prdquantity}</Text>
            <Text style={{ padding: 2 }}>meter)</Text>
          </View>
          </>
          ): null }          
          { (this.state.statusColortext != "") ? this.renderStatusColor(): null}
          <View style={{ width: '75%', padding: '3%' }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{fontWeight:'bold'}}>{(this.state.selectedName !== undefined) && (this.state.selectedName !== '') ? 'SKU Details: ' :null}</Text>
              <Text>{this.state.selectedName}</Text>
            </View>
            <View>  
              <Text style={{fontWeight:'bold'}}>{(this.state.selectedBook !== undefined) && (this.state.selectedBook !== '') ? 'Collection & Year: ' : null}</Text>
              <Text>{label2cnt}</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  renderScanner() {
    const { CameraPermissionGranted, qrdisplay } = this.state;
    if (qrdisplay) {
      if (CameraPermissionGranted === null) {
        return (
          <View style={styles.container}>
            <Text>Please Grant Camera Permission</Text>
          </View>
        );
      }
      if (CameraPermissionGranted === false) {
        return (
          <View style={styles.container}>
            <Text>Camera Permission Denied</Text>
          </View>
        );
      }
      if (CameraPermissionGranted === true) {
        return (
          <View style={styles.container}>
            <BarCodeScanner
              onBarCodeScanned={this.handleBarCodeScanned}
              style={{
                height: DEVICE_HEIGHT / 1.1,
                width: DEVICE_WIDTH,
              }}
            />
            <Text style={styles.textab}>{this.state.selectedSKU}</Text>
          </View>
        );
      }
    }
  }

  renderFooter = () => {
    const { navigation } = this.props;
    if (!this.state.qrdisplay) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MyCart", {
                access_token: this.state.accessToken,
                dealerData: this.state.dealerData,
                cartId: this.state.cartId,
              });
            }}
            style={styles.imageContainer}
          >
            <Image
              source={require("../../assets/view_cart.png")}
              style={styles.image}
            />
            <Text style={styles.footerText}>View Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.addItemtoCart}
            style={styles.imageContainer}
          >
            <Image
              source={require("../../assets/add_to_cart.png")}
              style={styles.image}
            />
            <Text style={styles.footerText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} color="#17CFAD" />
        {this.renderTopBanner()}
        {this.renderControls()}
        {this.renderScanner()}
        <ScrollView style={styles.scrollView}>
          <View style={{ alignItems: "center" }}>
            {this.renderProductDetails()}
          </View>
        </ScrollView>
        {this.renderFooter()}
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: "#502B85" }}
          position="center"
          positionValue={600}
          fadeInDuration={1500}
          fadeOutDuration={2000}
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {},
  scrollView: {
    margin: 10,
  },
  text: {
    fontSize: 42,
  },
  textab: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 19,
  },
  Scanimage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    padding: 20,
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  topBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#502B85",
    alignItems: "center",
  },
  titleLabel: {
    fontSize: 16,
    padding: 10,
    marginTop: 6,
    fontWeight: "bold",
  },
  titleLabe2: {
   fontSize: 12,
   fontWeight: "bold",
  },
  
  product: {
    minWidth: 150,
    maxWidth: "80%",
    maxHeight: 275,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.2,
    borderColor: "#000000",
    borderRadius: 20,
    marginVertical: 20,
  },
  productImage: {
    resizeMode: "contain",
    width: "90%",
    height: "80%",
  },
  detailsContianer: {
    maxWidth: "90%",
  },
  headerControlButtonLabel: {
    width: 100,
    height: 15,
    margin: 4,
  },
  headerControlButtonLabelText: {
    color: "#B2B2B2",
    fontSize: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerControlButton: {
    height: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#000000",
    margin: 5,
    padding: 3,
  },
  headerControlButtonText: {
    color: "#B2B2B2",
    fontSize: 14,
  },
  button: {
    width: 80,
    height: 24,
    margin: 5,
    backgroundColor: "#502B85",
    borderRadius: 7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

const mapStateToProps = (state) => {
  return { userDetails: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setCart }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder);