import React, { useState, useEffect } from "react";
// import { Picker } from "@react-native-picker/picker";
import { View, Picker } from "react-native";
import Card from "./card";

const Select = (props) => {
  const {
    items = [],
    value,
    onChange,
    itemKey,
    itemLabel,
    placeHolder,
    style,
  } = props;
  const [selectedValue, setValue] = useState(value || {});

  useEffect(() => {
    //console.log(value);
    setValue(value);
  }, [value]);

  const handleChange = (itemValue) => {
    //console.log(itemValue);
    setValue(itemValue);
    onChange ? onChange(itemValue) : null;
  };

  return (
    <Picker
      selectedValue={selectedValue}
      style={{
        color: "grey",
        fontSize: 18,
        lineHeight: 24,
        width: "100%",
        ...style,
      }}
      onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
    >
      {items.length > 0
        ? items.map((item, index) => {
            return (
              <Picker.Item
                value={item[itemKey]}
                key={item[itemKey]}
                label={item[itemLabel]}
              />
            );
          })
        : null}
    </Picker>
  );
};

export default Select;
