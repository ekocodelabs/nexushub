import AboutLayout from "@/myComponents/AboutLayout";
import BannerLayout from "@/myComponents/BannerLayout";
import EarningsCalculatorLayout from "@/myComponents/EarningsCalculatorLayout";
import FAQLayout from "@/myComponents/FAQLayout";
import FeatureGridLayout from "@/myComponents/FeaturedGridLayout";
import FooterLayout from "@/myComponents/FooterLayout";
import NavBarLayout from "@/myComponents/NavBarLayout";
import PricingLayout from "@/myComponents/PricingLayout";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <NavBarLayout />
      <BannerLayout />
      <EarningsCalculatorLayout />
      <AboutLayout />
      <FeatureGridLayout />
      <PricingLayout />
      <FAQLayout />
      <FooterLayout />
    </>
  );
}
