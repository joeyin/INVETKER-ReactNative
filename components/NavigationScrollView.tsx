import * as React from "react";
import {
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
} from "react-native";
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
  FlatListWithHeaders,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { runOnJS, useDerivedValue } from "react-native-reanimated";

function NavigationScrollView({
  title,
  contentContainerStyle,
  children,
  center,
  left,
  right,
  ...props
}: {
  title: String;
  children?: React.ReactNode;
  center?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
}) {
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
      contentContainerStyle={Object.assign({}, contentContainerStyle)}
      {...props}
    >
      {children}
    </ScrollViewWithHeaders>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  largeTitle: {
    fontSize: 35,
    fontWeight: "bold",
  },
});

export default NavigationScrollView;
