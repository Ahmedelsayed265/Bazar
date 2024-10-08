import { useState } from "react";
import { useTranslation } from "react-i18next";
import SubmitButton from "../ui/form-elements/SubmitButton";
import SectionHeader from "../ui/layout/SectionHeader";
import DataLoader from "../ui/DataLoader";
import EmptyData from "../ui/EmptyData";
import usePackagesList from "./../hooks/settings/usePackagesList";
import axios from "./../utils/axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import OrderModal from "../ui/modals/OrderModal";
import ChargeModal from "../ui/modals/ChargeModal";
import { useSelector } from "react-redux";

function CommercialVerification() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState("");
  const { isLoading: packagesLoading, data: packages } = usePackagesList();
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const [showConfirmPayModel, setShowConfirmPayModel] = useState(false);
  const [showChargeModel, setShowChargeModel] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useSelector((state) => state.authedUser.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedPlan) {
      toast.error(t("profile.selectPackage"));
      setLoading(false);
      return;
    }

    if (user?.wallet >= selectedPlan?.price) {
      setShowConfirmPayModel(true);
    } else {
      setShowChargeModel(true);
    }
    setLoading(false);
  };

  const handlePayCommission = async (e) => {
    e.preventDefault();
    setPayLoading(true);

    const requestBody = {
      payment_method: "wallet",
    };

    if (selectedPlan) {
      requestBody.package_id = +selectedPlan?.id;
    } else {
      return;
    }

    try {
      const res = await axios.post("/user/subscribe_package", requestBody);
      if (res.data.code === 200) {
        toast.success(t("subscripedSuccessfully"));
        setSelectedPlan("");
        queryClient.invalidateQueries(["profile"]);
        navigate("/profile");
      }
    } catch (error) {
      toast.error(t("someThingWentWrong"));
      throw new Error(error.message);
    } finally {
      setPayLoading(false);
      setLoading(false);
    }
  };

  return packagesLoading ? (
    <DataLoader minHeight="400px" />
  ) : (
    <div className="verification-page">
      <SectionHeader />
      {packages?.data && packages?.data?.length > 0 ? (
        <form
          className="content-wrapper container col-lg-10 col-12"
          onSubmit={handleSubmit}
        >
          <div className="form-header-image">
            <img src="/images/verification-3.svg" alt="verification" />
          </div>
          <ul className="hint-wrapper">
            <h5>{t("profile.verificationBenifints")}:</h5>
            <li>{t("profile.verififcationHint1")}</li>
            <li>{t("profile.verififcationHint2")}</li>
            <li>{t("profile.verififcationHint3")}</li>
          </ul>
          <div className="col-12 plan-wrapper d-flex flex-column gap-2">
            <h6>{t("profile.planMethod")}</h6>
            <div className="inputs-wrapper">
              {packages?.data?.map((plan) => (
                <div className="radio-group" key={plan.id}>
                  <input
                    type="radio"
                    name="plan"
                    id={plan.id}
                    checked={selectedPlan?.id === plan?.id}
                    value={plan.id}
                    onChange={() => setSelectedPlan(plan)}
                  />
                  <label
                    htmlFor={plan.id}
                    className="d-flex align-items-center flex-column gap-4 py-3"
                  >
                    <div className="icon d-flex">
                      <i
                        className="fa-solid fa-gem"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between w-100"
                      style={{ gap: "24px" }}
                    >
                      <span className="d-flex align-items-center gap-1">
                        <i className="fa-regular fa-calendar-days"></i>
                        {plan.days}{" "}
                        {t(
                          `${
                            plan?.days > 1 && plan?.days < 11 ? "days" : "day"
                          }`
                        )}
                      </span>

                      <span className="d-flex align-items-center gap-1">
                        <i className="fa-regular fa-money-check-dollar"></i>
                        {plan?.price}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          {selectedPlan && (
            <>
              <div className="col-12 price-wrapper">
                <h6>{t("profile.planPrice")}</h6>
                <div className="content d-flex gap-3 align-items-center justify-content-between">
                  <span className="title">
                    {selectedPlan.days}{" "}
                    {t(
                      `${
                        selectedPlan?.days > 1 && selectedPlan?.days < 11
                          ? "days"
                          : "day"
                      }`
                    )}
                  </span>
                  <span className="price d-flex align-items-center gap-1">
                    <i className="fa-regular fa-money-check-dollar"></i>
                    {selectedPlan?.price}
                  </span>
                </div>
              </div>
            </>
          )}
          <div className="submit-wrapper col-12">
            <SubmitButton
              name={t("payNow")}
              className="custom-btn filled"
              loading={loading}
            />
          </div>
        </form>
      ) : (
        <EmptyData minHeight={"300px"}>{t("profile.noPackages")}</EmptyData>
      )}
      <ChargeModal
        cartTotalPrice={selectedPlan?.price}
        showModal={showChargeModel}
        setShowModal={setShowChargeModel}
        title={t("cart.charge")}
      />
      <OrderModal
        setShowModal={setShowConfirmPayModel}
        showModal={showConfirmPayModel}
        ballance={user?.wallet}
        cartTotalPrice={selectedPlan?.price}
        eventFunction={handlePayCommission}
        loading={payLoading}
        buttonTitle={t("payNow")}
      />
    </div>
  );
}

export default CommercialVerification;
