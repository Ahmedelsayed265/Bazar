import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SectionHeader from "../ui/layout/SectionHeader";
import FavoriteMarketCard from "../ui/cards/FavoriteMarketCard";
import DataLoader from "../ui/DataLoader";
import EmptyData from "../ui/EmptyData";
import useFavoriteAds from "./../hooks/ads/useFavoriteAds";
import useFavoriteMarkets from "./../hooks/markets/useFavoriteMarkets";
import Post from "../ui/cards/Post";
import { useSearchParams } from "react-router-dom";

function Favorites() {
  const { t } = useTranslation();
  const { isLoading: adsLoading, data: ads } = useFavoriteAds();
  const { isLoading: marketsLoading, data: markets } = useFavoriteMarkets();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "ads";

  function handleTabChange(tab) {
    setSearchParams({ tab });
  }

  return (
    <>
      <SectionHeader />
      <section className="favorites-section tabs-section">
        <div className="container">
          <Tabs
            activeKey={activeTab}
            id="uncontrolled-tab-example"
            onSelect={(tab) => handleTabChange(tab)}
          >
            {/* ADs */}
            <Tab eventKey="ads" title={t("favorites.ads")} className="tab_item">
              <div className="content-wrapper">
                {adsLoading ? (
                  <DataLoader minHeight="400px" />
                ) : ads?.data && ads?.data?.length > 0 ? (
                  ads?.data?.map((ad) => (
                    <div className="col-lg-3 col-md-6 col-12 p-2" key={ad?.id}>
                      <Post post={ad} showFav={true} />
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
                      className="col-lg-3 col-md-6 col-12 p-2"
                      key={market?.id}
                    >
                      <FavoriteMarketCard
                        type="favorite"
                        market={market}
                        showFav={true}
                      />
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
        </div>
      </section>
    </>
  );
}

export default Favorites;
