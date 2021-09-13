import { useRouter } from "next/router";
import { JaTexts } from "../locales/ja";
import { EnTexts } from "../locales/en";

const useTranlate = () => {
  const { locale } = useRouter();
  return locale === "ja" ? JaTexts : EnTexts;
};

export default useTranlate;
