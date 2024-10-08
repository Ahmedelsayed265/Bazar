import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReportModal from "../modals/ReportModal";
import { useState } from "react";
import CreateReplayModal from "../modals/CreateReplayModal";
import CommentReplays from "../../components/replays/CommentReplays";

function CommentCard({ comment }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showReplayModal, setShowReplayModal] = useState(false);

  return (
    <div className="rate-card">
      <div className="info-wrapper">
        <Link to={`/profile/${comment?.user?.id}`} className="image-wrapper">
          <img src={comment?.user?.image} alt="user" />
        </Link>
        <div className="info-rate-wrapper">
          <div className="user-info">
            <Link to={`/profile/${comment?.user?.id}`} className="name">
              {comment?.user?.name}
            </Link>
            <span>{`${new Date(comment?.created_at).toDateString()}, ${new Date(
              comment?.created_at
            ).toLocaleTimeString()}`}</span>
          </div>
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
              <Dropdown.Item onClick={() => setShowReplayModal(true)}>
                {t("replay")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <p className="comment">{comment?.comment}</p>

      <CommentReplays comment={comment} />

      <ReportModal
        id={comment?.id}
        type={"comment"}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <CreateReplayModal
        id={comment?.id}
        showModal={showReplayModal}
        setShowModal={setShowReplayModal}
        targetComment={comment}
      />
    </div>
  );
}

export default CommentCard;
