import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { formatTimeDifference, getTimeDifference } from "../../utils/helpers";
import StarsList from "../StarsList";
import ReportModal from "../modals/ReportModal";
import { useState } from "react";

function RateCard({ rate }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const timeDifference = getTimeDifference(rate?.created_at);
  const creationTime = formatTimeDifference(
    timeDifference.years,
    timeDifference.months,
    timeDifference.days,
    timeDifference.hours,
    timeDifference.minutes,
    t
  );

  return (
    <div className="rate-card">
      <div className="info-wrapper">
        <Link to={`/profile/${rate?.user?.id}`} className="image-wrapper">
          <img src={rate?.user?.image} alt="user" />
        </Link>
        <div className="info-rate-wrapper">
          <div className="user-info">
            <Link to={`/profile/${rate?.user?.id}`} className="name">
              {rate?.user?.name}
            </Link>
            <span>{creationTime}</span>
          </div>
          {rate?.rate ? (
            <div className="rate">
              <StarsList rate={rate?.rate} />
              <span>{rate?.rate}</span>
            </div>
          ) : null}
        </div>
        <div className="btns-wrapper">
          <Dropdown>
            <Dropdown.Toggle className="butn" id="dropdown-basic">
              <i className="fa-regular fa-ellipsis-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowModal(true)}>
                {t("report")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <p className="comment">{rate?.comment}</p>
      <ReportModal
        id={rate?.id}
        type="rate"
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}

export default RateCard;
