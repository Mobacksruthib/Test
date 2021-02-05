import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  View,
} from "react-native";
import { data } from "../../mock-data";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component";
import { connect } from "react-redux";
import api from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";

const topBannerData = [
  [
    { key: "currentStatus", label: "Order Status" },
    { key: "orderDate", label: "Order Date" },
  ],
  [
    { key: "invoiceNumber", label: "Invoice No" },
    { key: "invoiceDate", label: "Invoice Date" },
  ],
];

const tableHeaders = ["Material/Desc.", "Order Quantity", "Invoice Quantity"];

const statusMapper = (input) => {
  const formattedInput = input.replace(/\s/g, "").toLowerCase().trim();
  //console.log(formattedInput);
  switch (formattedInput) {
    case "orderplaced":
    case "pendingforpickup":
    case "atdispatchbay":
      return "Order Placed";
    case "outfordelivery":
    case "delivered":
      return "Dispatched";
    case "invoiced":
      return "Invoiced";
    default:
      return "Order Placed";
  }
};

class MyOrderDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // orderDetails: data.myOrderDetails,
      loading: false,
      orderDetails: [],
      tableHead: null,
      tableData: [],
      orderDate: null,
      invoiceDate: null,
      invoiceNumber: null,
      currentStatus: null,
    };
  }

  formatTableData = (orderDetails) => {
    const formatted = orderDetails.map(
      ({ material, orderQuantity, invoiceQuantity }) => {
        const desc = (
          <View style={{ flexDirection: "row" }}>
            <Text /* style={{ width: "50%" }} */ numberOfLines={1}>
              {material.description}
            </Text>
            {/* <Text>{`${material.litres}LT`}</Text> */}
          </View>
        );
        return [desc, orderQuantity, invoiceQuantity];
      }
    );
    return { tableHead: tableHeaders, tableData: formatted };
  };

  componentDidMount() {
    const { access_token: authValue, userName: dealerCode } = this.props.user;
    const { navigation } = this.props;
    const orderNo = navigation.getParam("orderNo", "");
    let objParams = { dealerCode, salesOrderNumber: orderNo };
    let tParams = [];
    Object.keys(objParams).map((key) => {
      tParams.push(`${key}=${objParams[key]}`);
    });
    this.setState({
      loading: true,
    });
    Promise.all([api.fetchData("ORDERDETAIL", tParams, authValue)])
      .then((result) => {
        try {
          //console.log("ORDERDETAIL", result);
          const [response] = result;
          const { statusCode, dealerOrderItem } = response;

          if (statusCode === "200") {
            let topBannerStateData = {};
            const orderDetails = dealerOrderItem.map(
              ({
                billedQuantity,
                orderQuantity,
                materialDescription,
                currentStatus,
                orderDate,
                invoiceDate,
                invoiceNumber,
              }) => {
                topBannerStateData = {
                  orderDate,
                  invoiceDate,
                  invoiceNumber,
                  currentStatus: statusMapper(currentStatus),
                };
                return {
                  orderQuantity,
                  invoiceQuantity: billedQuantity,
                  material: { description: materialDescription },
                };
              }
            );
            const { tableHead, tableData } = this.formatTableData(orderDetails);
            this.setState({
              tableHead,
              tableData,
              ...topBannerStateData,
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
  }

  renderTopBanner = () => {
    return (
      <View style={styles.topBanner}>
        {topBannerData.map((arr) => {
          return (
            <View style={{ flexDirection: "column" }}>
              {arr.map(({ key, label }) => {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.topBannerText}>{`${label}:`}</Text>
                    <Text style={styles.topBannerText}>{this.state[key]}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  renderTableHeader = () => {
    const { tableHeaders } = this.state;
    return (
      <>
        <View style={styles.tableHeader} key="table-header">
          {(tableHeaders || defaultData).map((label) => (
            <Text key={`text-${label}`} style={styles.tableHeaderText}>
              {label}
            </Text>
          ))}
        </View>
      </>
    );
  };

  renderTable = () => {
    const { tableHead, tableData, tableTitle } = this.state;
    return (
      <View style={styles.tableContainer}>
        <Table borderStyle={{}}>
          <Row
            data={tableHead}
            flexArr={[4, 1, 1]}
            style={styles.head}
            textStyle={styles.tableHeaderText}
          />          
            <Col
              data={tableTitle}
              style={styles.title}
              heightArr={[28, 28]}
              textStyle={styles.text}
            />
            <TableWrapper style={styles.wrapper}>
            <ImageBackground
              resizeMode={'stretch'} // or cover
              style={{flex: 1}} 
              source={require('../../assets/grad-bg.png')}
            >
            <Rows
              data={tableData}
              flexArr={[4, 1, 1]}
              style={styles.row}
              textStyle={styles.text}
            />
            </ImageBackground>
          </TableWrapper>
        </Table>
        
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} color="#17CFAD" />
        {this.renderTopBanner()}
        <ScrollView style={styles.scrollView}>
          {/* <View style={{ alignItems: "center" }}>{this.renderTable()}</View> */}
          {this.renderTable()}
        </ScrollView>
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
  },
  topBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#502B85",
    alignItems: "center",
    height: 90,
  },
  topBannerText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "OpenSans-Bold",
  },
  tableHeaderText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "OpenSans-Bold",
  },
  tableContainer: {
    flex: 1,
    // padding: 16,
    // paddingTop: 30,
    // backgroundColor: "#fff",
  },
  head: {
    height: 60,
    padding: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
  },
  wrapper: { flexDirection: "row" },
  title: {
    flex: 1,
    backgroundColor: "#f6f8fa",
    padding: 5,
  },
  row: {
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: "#A5A5A5",
    padding: 5,
  },
  rowText: { textAlign: "center" },
});

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(MyOrderDetails);
