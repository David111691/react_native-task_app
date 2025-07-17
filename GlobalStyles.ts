import { Platform, StatusBar, StyleSheet } from "react-native";

export default StyleSheet.create({
  SafeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#F6F8FA",
  },
  ContentWrapper: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 36,
  },
});
