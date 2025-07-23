import * as React from "react";
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  ScrollViewProps,
} from "react-native";
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { runOnJS, useDerivedValue } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { Text } from "../Text";

interface Props extends Omit<ScrollViewProps, "title | center"> {
  title: String;
  children?: React.ReactNode;
  center?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  style?: StyleProp<ViewStyle>;
}

function ScrollView({
  title,
  contentContainerStyle,
  children,
  center,
  left,
  right,
  style,
  ...props
}: Props) {
  const { colors } = useTheme();

  const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => {
    const [navBarVisible, setNavBarVisible] = React.useState(showNavBar.value);

    useDerivedValue(() => {
      runOnJS(setNavBarVisible)(showNavBar.value);
    });

    return (
      <Header
        showNavBar={showNavBar}
        noBottomBorder={navBarVisible == 0}
        headerCenter={<Text style={styles.title}>{center ?? title}</Text>}
        headerLeft={left}
        headerRight={right}
        initialBorderColor={colors.border}
        borderColor={colors.border}
      />
    );
  };

  const LargeHeaderComponent = ({ scrollY }: ScrollLargeHeaderProps) => (
    <LargeHeader>
      <ScalingView scrollY={scrollY}>
        <Text style={styles.largeTitle}>{title}</Text>
      </ScalingView>
    </LargeHeader>
  );

  return (
    <ScrollViewWithHeaders
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      containerStyle={{
        backgroundColor: colors.background,
      }}
      contentContainerStyle={[contentContainerStyle]}
      largeHeaderContainerStyle={{
        borderBlockColor: "red",
        borderColor: "red"
      }}
      style={style}
      {...props}
    >
      {children}
    </ScrollViewWithHeaders>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 6,
  },
  largeTitle: {
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default ScrollView;
