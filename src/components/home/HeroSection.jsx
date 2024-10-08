import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "swiper/swiper-bundle.css";
import useGetHomeBanners from "../../hooks/settings/useGetHomeBanners";

function HeroSection() {
  const { t } = useTranslation();
  const { isLoading, data: banners } = useGetHomeBanners();

  return (
    <section className="hero-section">
      <div className="container p-0">
        <div className="row m-0 h-100">
          <div className="col-lg-7 col-12 p-2">
            {isLoading ? (
              <div className="skeleton-item"></div>
            ) : (
              <div className="swiper_adds">
                <Swiper
                  slidesPerView={1}
                  speed={1000}
                  loop={true}
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="hero_slider"
                >
                  {banners?.data?.map((banner, index) => (
                    <SwiperSlide key={index}>
                      <div className="slide">
                        <img src={banner?.image} alt="slide1" />
                        {/* <div className="layer">
                          <h4>استكشف قطع غيار وإكسسواراتنا</h4>
                          <p>اكتشف أحدث القطع والإكسسوارات لتحسين سيارتك.</p>
                          <Link to="/ads?ad_type=sell">تسوق الآن</Link>
                        </div> */}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <div className="col-lg-5 col-12 p-2">
            <div className="categories">
              <Link
                to="/markets"
                className="category"
                style={{ backgroundColor: "#DE010121" }}
              >
                <h2>{t("home.markets")}</h2>
                <div className="img">
                  <img src="/images/stores.png" alt="stores" />
                </div>
              </Link>

              <Link
                to="/markets?type=online"
                className="category"
                style={{ backgroundColor: "#23c98c4a" }}
              >
                <h2>{t("home.onlineMarkets")}</h2>
                <div className="img">
                  <img src="/images/onlineStore.png" alt="stores" />
                </div>
              </Link>

              <Link
                to="/markets?type=coupon"
                className="category"
                style={{ backgroundColor: "#3FA21821" }}
              >
                <h2>{t("home.coupons")}</h2>
                <div className="img">
                  <img src="/images/copoun.png" alt="stores" />
                </div>
              </Link>

              <Link
                to="/wanted-ads"
                className="category"
                style={{ backgroundColor: "#dd4bf829" }}
              >
                <h2>{t("home.wantedAds")}</h2>
                <div className="img">
                  <img src="/images/storeWanted.png" alt="stores" />
                </div>
              </Link>

              <Link
                to="/markets?type=online"
                className="category"
                style={{ backgroundColor: "#4B82F829" }}
              >
                <h2>{t("home.centers")}</h2>
                <div className="img">
                  <img src="/images/categories.png" alt="stores" />
                </div>
              </Link>

              <Link
                to="/ads?ad_type=sell"
                className="category"
                style={{ backgroundColor: "#F8CF734A" }}
              >
                <h2>{t("home.ads")}</h2>
                <div className="img">
                  <img src="/images/ads.png" alt="stores" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
