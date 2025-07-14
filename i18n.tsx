import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zhTW from "./locales/zh-TW.json";
import hiIN from "./locales/hi-IN.json";

const resources = {
  en,
  "zh-TW": zhTW,
  "hi-IN": hiIN,
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
});

export default i18n;
