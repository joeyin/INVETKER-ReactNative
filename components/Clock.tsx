import { Flex } from "@ant-design/react-native";
import { useTheme } from "@react-navigation/native";
import moment from "moment";
import { StyleProp, TextStyle, StyleSheet, ViewStyle } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from "./Text";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

type Props = {
  style?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
  time: moment.Moment;
};

export const Clock = ({ time, style = {}, textStyle = {}, ...props }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Flex style={style}>
      <AntDesign name="clockcircleo" size={13} color={colors.text} style={styles.text} />
      <Text style={[textStyle, styles.text, { marginLeft: 5 }]}>
        {t("last updated", {
          time: moment(time).locale(i18n.language).format("HH:mm:ss"),
        })}
      </Text>
    </Flex>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 13,
  },
  holdings: {
    flex: 1,
    marginBottom: 13,
  },
  text: {
    opacity: .4,
    fontSize: 12,
  },
});
