import * as React from "react";
import {
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
  FlatListProps,
} from "react-native";
import {
  Header,
  LargeHeader,
  ScalingView,
  FlatListWithHeaders,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { runOnJS, useDerivedValue } from "react-native-reanimated";

function NavigationFlatListView({
  title,
  contentContainerStyle,
  children,
  left,
  right,
  ...props
}: {
  title: String;
  children?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
} & FlatListProps<any>) {
  const HeaderComponent = ({ showNavBar }: ScrollHeaderProps) => {
    const [navBarVisible, setNavBarVisible] = React.useState(showNavBar.value);

    useDerivedValue(() => {
      runOnJS(setNavBarVisible)(showNavBar.value);
    });

    return (
      <Header
        showNavBar={showNavBar}
        noBottomBorder={navBarVisible == 0}
        headerCenter={<Text style={styles.title}>{title}</Text>}
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
    <FlatListWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      data={props.data}
      renderItem={props.renderItem}
      windowSize={10}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
      keyExtractor={(_, i) => `text-row-${i}`}
      {...props}
    />
  )
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

export default NavigationFlatListView;
