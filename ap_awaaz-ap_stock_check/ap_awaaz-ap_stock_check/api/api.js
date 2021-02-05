const baseURL = "https://myawaazdev.asianpaints.com/";

const tailUrls = {
  BEARER: "authorizationserver/oauth/token",
  ACCESS: "authorizationserver/oauth/token",
  DEALER: "aemintegration/v2/apc/dpservice/DealerDetails",
  ACCOUNT: "aemintegration/v2/apc/myreports/getAccountStatementFrom",
  allDuePayments: "aemintegration/v2/apc/myreports/outstandingPaymentsDetail",
  SKULIST: "aemintegration/v2/cops/getFabricProducts",
  SKUAVAILABLITY: "aemintegration/v2/dp/appsordering/checkProductStock",
  SKUCUTRATE: "aemintegration/v2/apc/myreports/getPriceDetails",
  GETCART: "aemintegration/v2/cops/dpservice/dpGetCartID",
  CREATECART: "aemintegration/v2/cops/users",
  MODIFYCART: "aemintegration/v2/cops/dpUpdateCartForFabric",
  GETCARTITEMS: "aemintegration/v2/cops/users",
  CARTSUBMIT: "aemintegration/v2/cops/dpplaceorderForFabric",
  MYORDERS: "aemintegration/v2/apc/myreports/orderList",
  // dealerCode=0000111801"&startDate=07-12-2020&endDate=15-12-2020
  ORDERDETAIL: "aemintegration/v2/apc/myreports/orderDetail",
  // dealerCode=0000111801&salesOrderNumber=0056980948
  GENERATEOTP: "aemintegration/v2/apc/dpservice/checkDealer",
  //?dealerCode=0000281409&mobileNumber=9699266298
  RESETPASSWORD: "aemintegration/v2/apc/dpservice/resetPassword",
  PRODDISCNT: "aemintegration/v2/apc/myreports/getPriceDetails",
  STAFFCHECK: "aemintegration/v2/apc/dpservice/sendDealerOTP",
  STAFFCHECKVALID: "aemintegration/v2/apc/dpservice/validateOTP",
};

const apiCall = (url, config) => {
  return new Promise((resolve, reject) => {
     console.log("url--", url);
     console.log("config--", config);
    fetch(url, config)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        //console.log(err);
        reject(err);
      });
  });
};

class api {
  static fetchData = (type, params = [], authValue) => {
    let url = baseURL;
    tURL = tailUrls[type];
    paramsURL = "";

    if (type == "GETCARTITEMS") {
      paramsURL = params;
    } else {
      paramsURL = params.length > 0 ? "?" + params.join("&") : "";
    }

    url += tURL + paramsURL;

    let headersObj = {
      Authorization: `Bearer ${authValue}`,
    };
    if ((type === "GENERATEOTP") || (type === 'STAFFCHECK')) {
      headersObj = {};
    }
    //console.log(url, headersObj);
    return apiCall(url, { headers: headersObj, method: "GET" });
  };

  static postData = (type, params = [], authValue) => {
    let url = baseURL;
    tURL = tailUrls[type];
    if ((type === "RESETPASSWORD")) {
      url += tURL;
      let headersObj = {
        "Content-Type": "application/json",
      };
      let bodyParam = params;
      //console.log(url, headersObj, bodyParam);
      return apiCall(url, {
        method: "POST",
        headers: headersObj,
        body: JSON.stringify(bodyParam),
        redirect: "follow",
      });
    } else if  (type == "STAFFCHECKVALID") {
      url += tURL;
      let headersObj = {
        "Content-Type": "application/json",
      };
      let bodyParam = params;
      //console.log(url, headersObj, bodyParam);
      return apiCall(url, {
        method: "POST",
        headers: headersObj,
        // body: bodyParam,
        body: JSON.stringify(bodyParam),
        redirect: "follow",
      });
    } else if (type != "MODIFYCART" && type != "CARTSUBMIT") {
      paramsURL = "";
      if (type == "CREATECART") {
        paramsURL = params.length > 0 ? "/" + params.join("&") : "";
      } else {
        paramsURL = params.length > 0 ? "?" + params.join("&") : "";
      }

      url += tURL + paramsURL;
      let headersObj = {};

      if (type == "BEARER") {
        headersObj = {
          Contenttype: "application/x-www-form-urlencoded",
        };
      } else {
        headersObj = {
          Contenttype: "application/x-www-form-urlencoded",
          Authorization: `Bearer ${authValue}`,
        };
      }
      //console.log(url, headersObj);
      return apiCall(url, { headers: headersObj, method: "POST" });
    } else {
      url += tURL;
      let headersObj = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authValue}`,
      };
      let bodyParam = params;
      //console.log(url, headersObj, bodyParam);
      return apiCall(url, {
        method: "POST",
        headers: headersObj,
        body: bodyParam,
        redirect: "follow",
      });
    }
  };
}

export default api;
