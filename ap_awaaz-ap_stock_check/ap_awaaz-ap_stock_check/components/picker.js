import React, { useState } from "react";
import { View, Button, Platform, StyleSheet, Text, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const Picker = (props) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const { onChange } = props;
      onChange ? onChange(formatDate(currentDate)) : null;
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const formatDate = (inputDate) => {
    const formattedDate = moment(inputDate).format("DD-MM-YYYY");
    return formattedDate;
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker}>
        <View style={styles.picker}>
          <Text style={{ color: "#000000", width: "80%" }}>
            {date ? formatDate(date) : ""}
          </Text>
          <Image source={require("../assets/calendar.png")} />
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: 130,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    borderColor: "#000000",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});

export default Picker;
