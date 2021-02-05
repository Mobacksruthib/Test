import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TextInput, Alert } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import Select from "../../../components/select";
import CustomButton from "../../../components/customButton";
import api from "../../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, {DURATION} from 'react-native-easy-toast';

const data = [
  { label: "Enter OTP", value: "", key: "otp" },
  { label: "Enter Password", value: "", key: "pwd" },
  { label: "Re-Enter Password", value: "", key: "confirmPwd" },
];

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

class ResetPassword extends PureComponent {
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

  handleResetPassword = () => {
    
    const { navigation } = this.props;
    const dealerCode = navigation.getParam("dealerCode", "");
    const { form } = this.state;
  
    var pw = this.state.form['pwd'] 
    if(!strongRegex.test(pw)) {
      this.toast.show('Password must be eight characters \nincluding one uppercase letter, \none special character  @$#^!%*?& \none alphanumeric characters')
      return;
    }   

    let empty = false;
    Object.keys(form).map((key) => {
      if (!form[key]) {
        empty = true;
      }
    });
    if (empty){
      this.toast.show("OTP / Password Can't be empty")
      return;
    } 

    if(this.state.form['confirmPwd'] != this.state.form['pwd']){
      this.toast.show('Confirm Password Not matching')
      return;
    }
    this.setState({ loading: true });
    const postBody = {
      ...form,
      dealerCode,
    };
    Promise.all([api.postData("RESETPASSWORD", postBody)])
      .then((response) => {
        try {
          let [data] = response;
          //console.log("RESETPASSWORD", response, data);
          const { message, status, errors } = response;
          if (errors) {
            this.toast.show("Password Reset Not Successfully");
            return;
          }
          if (data.status === "true") {
            // display success message
            this.toast.show("Password Reset Successfully");
            this.props.navigation.navigate("Login");
          }
        } catch (err) {
          //console.log("err", err);
          this.props.navigation.navigate("Login");
        }
      })
      .catch((err) => {
        //console.log("err", err);
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
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={this.handleResetPassword}
          style={styles.imageContainer}
        >
          <CustomButton
            title="RESET PASSWORD"
            style={styles.resetButton}
            textStyle={styles.buttonText}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
              navigation.navigate("GenerateOtp");
            }} 
            style={styles.imageContainer}>
          <CustomButton
            title="CANCEL"
            style={styles.cancelButton}
            textStyle={styles.buttonText}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderTable = () => {
    return data.map(({ key, label }) => {
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
                //console.log(this.state, key);
                // if (isNaN(Number(v))) return;
                this.setState((prevState) => {
                  return { form: { ...prevState.form, [key]: v } };
                });
              }}
              // placeholder="Enter"
              maxLength={20}
            />
          </View>
          {/* <View style={styles.divider}></View> */}
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
                position='top'
                positionValue={100}
                fadeInDuration={500}
                fadeOutDuration={3000}
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
  cancelButton: {
    display: "flex",
    height: 30,
    width: 80,
    backgroundColor: "#502B85",
  },
  resetButton: {
    display: "flex",
    height: 30,
    width: 160,
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
    width: "100%",
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
  tableContainer: {
    marginTop: 40,
  },
});

export default ResetPassword;
