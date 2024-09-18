import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SectionHeader from "../ui/layout/SectionHeader";
import FavoriteMarketCard from "../ui/cards/FavoriteMarketCard";
import FavoriteADCard from "../ui/cards/FavoriteADCard";
import DataLoader from "../ui/DataLoader";
import EmptyData from "../ui/EmptyData";
import useFavoriteAds from "./../hooks/ads/useFavoriteAds";
import useFavoriteMarkets from "./../hooks/markets/useFavoriteMarkets";

function Favorites() {
  const { t } = useTranslation();
  const { isLoading: adsLoading, data: ads } = useFavoriteAds();
  const { isLoading: marketsLoading, data: markets } = useFavoriteMarkets();

  console.log(markets);

  return (
    <>
      <SectionHeader />
      <section className="favorites-section tabs-section container col-lg-10 col-12">
        <Tabs defaultActiveKey="ads" id="uncontrolled-tab-example">
          {/* ADs */}
          <Tab eventKey="ads" title={t("favorites.ads")} className="tab_item">
            <div className="content-wrapper">
              {adsLoading ? (
                <DataLoader minHeight="400px" />
              ) : ads?.data && ads?.data?.length > 0 ? (
                ads?.data?.map((ad) => (
                  <div className="col-lg-6 col-12 p-3" key={ad?.id}>
                    <FavoriteADCard type="favorite" ad={ad} />
                  </div>
                ))
              ) : (
                <EmptyData minHeight={"300px"}>{t("ads.noFavAds")}</EmptyData>
              )}
            </div>
          </Tab>

          {/* Markets */}
          <Tab
            eventKey="markets"
            title={t("favorites.markets")}
            className="tab_item"
          >
            <div className="content-wrapper">
              {marketsLoading ? (
                <DataLoader minHeight="400px" />
              ) : markets?.data && markets?.data?.length > 0 ? (
                markets?.data?.map((market) => (
                  <div
                    className="col-lg-4 col-md-6 col-12 p-3"
                    key={market?.id}
                  >
                    <FavoriteMarketCard type="favorite" market={market} />
                  </div>
                ))
              ) : (
                <EmptyData minHeight={"300px"}>
                  {t("ads.noFavMarkets")}
                </EmptyData>
              )}
            </div>
          </Tab>
        </Tabs>
      </section>
    </>
  );
}

export default Favorites;
