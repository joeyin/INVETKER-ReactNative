import React from "react";
import { TouchableOpacity, Text, TextStyle } from "react-native";
import {
  DatePicker as AntDatePicker,
  DatePickerProps,
  PickerValueExtend,
} from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import moment from "moment";
import { PickerStyle } from "@ant-design/react-native/lib/picker/style";

interface Props extends DatePickerProps {
  styles?: Partial<PickerStyle> & { textStyle?: TextStyle }
}

export const DatePicker = ({
  precision = "day",
  format = "YYYY-MM-DD",
  maxDate = new Date(),
  onOk,
  styles = {},
  ...props
}: Props) => {
  const [date, setDate] = React.useState(new Date());

  const handleOnOk = React.useCallback(
    (value: Date, extend: PickerValueExtend) => {
      setDate(value);
      onOk && onOk(value, extend);
    },
    []
  );

  return (
    <AntDatePicker
      precision={precision}
      maxDate={maxDate}
      format={format}
      onOk={handleOnOk}
      styles={Object.assign(
        {
          okText: { color: Colors.primary },
          dismissText: { color: Colors.primary },
        },
        styles
      )}
      {...props}
    >
      <TouchableOpacity
        style={{
          backgroundColor: Colors.lightGray200,
          alignSelf: "flex-end",
          borderRadius: 6,
          height: 35,
          justifyContent: "center",
          paddingHorizontal: 13,
        }}
      >
        <Text style={[{ fontSize: 17 }, styles.textStyle]}>
          {moment(date).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
    </AntDatePicker>
  );
};

export default DatePicker;
