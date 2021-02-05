import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TextInput, Alert } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import Select from "../../../components/select";
import CustomButton from "../../../components/customButton";
import api from "../../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, {DURATION} from 'react-native-easy-toast';

const data = [
  { key: "dealerCode", value: "", label: "Dealer Code" },
  { key: "mobileNumber", value: "", label: "Mobile Number" },
];

class GenerateOtp extends PureComponent {
  constructor(props) {
    super(props);
    const initialState = this.getInitialState();
    this.state = {
      form: {
        ...initialState,
      },
      loading: false,
    };
  }

  getInitialState = () => {
    const obj = {};
    data.map(({ key, value }) => {
      obj[key] = value;
    });
    return obj;
  };

  componentDidMount() {}

  handleGenerateOtp = () => {
    const { form } = this.state;
    let tParams = [];
    let empty = false;
    Object.keys(form).map((key) => {
      if (!form[key]) {
        empty = true;
      }
      tParams.push(`${key}=${form[key]}`);
    });
    if (empty){
      this.toast.show("DealerCode / Mobile Can't be empty")
      return;
    } 
    this.setState({ loading: true });
    Promise.all([api.fetchData("GENERATEOTP", tParams)])
      .then((response) => {
        try {
          //console.log("GENERATEOTP", response);
          const { message, status, errors } = response[0];
          if (errors) {
            //console.log("error");
            this.toast.show('Something Went Wrong');
            // display error message
            return;
          }
          if (status === "true") {
            // display success message
            //console.log("success");
            this.toast.show('OTP Generated');
            this.props.navigation.navigate("ResetPassword", {
              dealerCode: this.state.form.dealerCode,
            });
          }else{
            this.toast.show('Something Went Wrong');
          }
        } catch (err) {
          //console.log("err", err);
          this.toast.show('Something Went Wrong');
        }
      })
      .catch((err) => {
        //console.log("err", err);
        this.toast.show('Something Went Wrong');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  renderTopBanner = () => {
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
          <Text style={{ fontSize: 18 }}>Dealer Name</Text>
          <Select style={{ width: "60%" }} />
        </View>
      </View>
    );
  };

  footerContent = () => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={this.handleGenerateOtp}
        style={styles.imageContainer}
      >
        <CustomButton
          title="GENERATE OTP"
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </TouchableOpacity>
    );
  };

  renderTable = () => {
    return data.map(({ key, label, value }) => {
      return (
        <>
          <View style={styles.row} key={key}>
            <Text key={`text-${key}`} style={styles.text}>
              {label}
            </Text>
            <TextInput
              style={styles.textInput}
              value={this.state.form[key]}
              onChangeText={(v) => {
                if (isNaN(Number(v))) return;
                this.setState((prevState) => {
                  return { form: { ...prevState.form, [key]: v } };
                });
              }}
              // placeholder="enter"
              keyboardType="numeric"
              maxLength={20}
              onBlur={(v) =>{ 
                if((key=='dealerCode')){
                  let a = this.state.form[key];
                  let b = 0;
                  if(a.length<10){
                    b = a.toString().padStart(10, "0")
                    this.setState((prevState) => {
                      return { form: { ...prevState.form, [key]: b } };
                    });
                  }                  
                }
              }}
              
            />
          </View>
        </>
      );
    });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Spinner visible={this.state.loading} color="#17CFAD" />
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
    width: 140,
    backgroundColor: "#502B85",
  },
  buttonText: {
    color: "#FFFFFF",
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
    justifyContent: "center",
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
    width: "100%",
    // textAlign: "right",
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
    flexDirection: "column",
    padding: 10,
    marginVertical: 10,
    minHeight: 60,
  },
});

export default GenerateOtp;
