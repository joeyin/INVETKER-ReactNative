import React from "react";
import { TouchableOpacity, TextStyle } from "react-native";
import {
  DatePicker as AntDatePicker,
  DatePickerProps,
  PickerValueExtend,
} from "@ant-design/react-native";
import Colors from "@/constants/Colors";
import moment from "moment";
import { PickerStyle } from "@ant-design/react-native/lib/picker/style";
import { Text } from "../Text";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

interface Props extends DatePickerProps {
  styles?: Partial<PickerStyle> & { textStyle?: TextStyle };
}

export const DatePicker = ({
  precision = "day",
  format = "YYYY-MM-DD",
  maxDate = new Date(),
  onOk,
  styles = {},
  ...props
}: Props) => {
  const { colors } = useTheme();
  const [date, setDate] = React.useState(new Date());
  const { t } = useTranslation();

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
      dismissText={t("cancel")}
      okText={t("ok")}
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
          backgroundColor: colors.background,
          alignSelf: "flex-end",
          borderRadius: 6,
          height: 35,
          justifyContent: "center",
          paddingHorizontal: 13,
        }}
      >
        <Text style={[{ fontSize: 17 }, styles.textStyle]}>
          {moment(date).locale("en").format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>
    </AntDatePicker>
  );
};

export default DatePicker;
