import { Link, useNavigate } from "react-router-dom";
import useAddToFavorite from "../../hooks/useAddToFavorite";
import useRemoveFromFavorite from "../../hooks/useRemoveFromFavorite";
import { useSelector } from "react-redux";
import { useState } from "react";

function FavoriteMarketCard({ market, showFav = false }) {
  const [bannerError, setBannerError] = useState(false);
  const { addToFavorite, isLoading: addingLoading } = useAddToFavorite();
  const { removeFromFavorite, isLoading: removingLoading } =
    useRemoveFromFavorite();
  const isLogged = useSelector((state) => state.authedUser.isLogged);

  const navigate = useNavigate();

  function handleToggleFavorite(e) {
    e.stopPropagation();
    e.preventDefault();
    if (isLogged) {
      if (market?.is_favorite) {
        removeFromFavorite({ id: market?.id, type: "market_id" });
      } else {
        addToFavorite({
          id: market?.id,
          type: "market_id",
        });
      }
    } else {
      navigate("/login");
    }
  }

  function handleLinkClick(e) {
    e.stopPropagation();
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("favorite")
    ) {
      e.preventDefault();
    }
  }

  return (
    <Link
      to={`/${market?.type === "coupon" ? "coupon" : "market"}-details/${
        market?.id
      }`}
      className="fav-market-card"
      onClick={handleLinkClick}
    >
      <div className="card-header">
        <div className="cover-wrapper">
          {!market?.banner || bannerError ? null : (
            <img
              src={market?.banner}
              alt="market cover image"
              onError={() => setBannerError(true)}
            />
          )}
        </div>

        <div className="card_header__content">
          <div className="logo-wrapper">
            <img src={market?.logo} alt="market logo image" />
          </div>

          <div className="category_like">
            {market?.category ? (
              <div className="category_wrapper">
                <div className="category">
                  <img src={market?.category?.image} alt="" />
                  {market?.category?.name}
                </div>
              </div>
            ) : null}

            {showFav && (
              <div className="action-boxes">
                <span
                  className={`action-btn favorite ${
                    market?.is_favorite ? "liked" : ""
                  }`}
                  onClick={handleToggleFavorite}
                  disabled={addingLoading || removingLoading}
                >
                  <i className="fa-solid fa-heart"></i>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-details">
        <p className="description one-line-wrap">
          {market?.bio || market?.name}
        </p>
        <div className="card-statistics">
          {market?.views_count || market?.views_count === 0 ? (
            <div className="statistic">
              <i className="fa-regular fa-eye"></i>
              <span className="value">{market?.views_count}</span>
            </div>
          ) : null}
          {market?.follow_count || market?.follow_count === 0 ? (
            <div className="statistic">
              <i className={`fa-regular fa-user-plus`}></i>
              <span className="value">{market?.follow_count}</span>
            </div>
          ) : null}
          {market?.rate || market?.rate === 0 ? (
            <div className="statistic">
              <i className="fa-regular fa-star"></i>
              <span className="value">{market?.rate}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default FavoriteMarketCard;
