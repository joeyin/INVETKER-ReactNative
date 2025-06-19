import Colors from "@/constants/Colors";
import { formatLocalizedCapitalized } from "@/helpers/formatHelpers";
import React from "react";
import {
  View,
  StyleSheet,
  Image as RNImage,
  ImageProps,
  Text,
} from "react-native";

interface Props extends ImageProps {
  type?: "normal" | "avatar" | "logo";
  displayName?: string | React.ReactNode;
}

const Image = ({ type = "normal", displayName, style, ...props }: Props) => {
  const [imgLoadFailed, setImgLoadFailed] = React.useState(false);

  return imgLoadFailed || !isValidUri(props.source) ? (
    <View style={[styles.wrapper, style]}>
      {type === "avatar" ? (
        <RNImage
          resizeMode="contain"
          source={{
            uri: `https://ui-avatars.com/api/?name=${displayName}&size=256`,
          }}
          style={styles.avatar}
        />
      ) : type === "logo" ? (
        <View style={styles.logo}>
          {displayName &&
            (typeof displayName === "string" ? (
              <Text style={styles.logoText}>
                {formatLocalizedCapitalized(displayName.at(0))}
              </Text>
            ) : (
              displayName
            ))}
        </View>
      ) : (
        <RNImage
          resizeMode="contain"
          source={require("@/assets/brand.png")}
          style={styles.brand}
        />
      )}
    </View>
  ) : (
    <RNImage
      style={[styles.image, style]}
      {...props}
      onError={() => setImgLoadFailed(true)}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 5,
  },
  brand: {
    width: "100%",
    padding: 15,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 15,
    fontWeight: 600,
    color: Colors.secondary,
  },
});

const isValidUri = (source: any) => {
  return (
    source &&
    typeof source === "object" &&
    typeof source.uri === "string" &&
    source.uri.trim() !== ""
  );
};

export default Image;
