import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { calcDeliveryPrice } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import TextField from "../ui/form-elements/TextField";
import InputField from "../ui/form-elements/InputField";
import SectionHeader from "../ui/layout/SectionHeader";
import useGetCart from "./../features/cart/useGetCart";
import useGetAddresses from "../features/addresses/useGetAddresses";
import AddAddress from "../features/addresses/AddAddress";
import useGetSettings from "../hooks/useGetSettings";
import DataLoader from "../ui/DataLoader";
import SubmitButton from "../ui/form-elements/SubmitButton";
import axios from "./../utils/axios";

function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: cart } = useGetCart();
  const { data: addresses, addressLoading } = useGetAddresses();
  const { data: settings, settingsLoading } = useGetSettings();

  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    address_id: "",
    notes: "",
    sub_total: 0,
    taxes: 0,
    discount: 0,
    total: 0,
    coupon: "",
    payment_method: "cash",
    delivery_price: ""
  });

  useEffect(() => {
    const clientLocation = addresses?.data?.find(
      (address) => address?.id === Number(formData?.address_id)
    );

    const clientLat = clientLocation?.lat;
    const clientLng = clientLocation?.lng;

    const marketLat = cart ? cart[0]?.market?.lat : 0;
    const marketLng = cart ? cart[0]?.market?.lng : 0;

    setFormData((prev) => ({
      ...prev,
      sub_total: cart?.reduce(
        (count, item) =>
          count +
          item.quantity *
            (item?.product?.offer_price
              ? item?.product?.offer_price
              : item?.product?.price),
        0
      ),

      taxes:
        cart?.reduce(
          (count, item) =>
            count +
            item.quantity *
              (item?.product?.offer_price
                ? item?.product?.offer_price
                : item?.product?.price),
          0
        ) * 0.15,

      delivery_price: formData?.address_id
        ? calcDeliveryPrice(
            clientLat,
            clientLng,
            marketLat,
            marketLng,
            settings?.km_price
          )
        : 0
    }));
  }, [addresses, cart, settings, formData?.address_id]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total:
        Number(formData.sub_total) +
        Number(formData.taxes) +
        Number(formData.delivery_price)
    }));
  }, [formData.sub_total, formData.taxes, formData.delivery_price]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    try {
      const res = await axios.post("/user/get_coupon_user", {
        coupon: formData.coupon
      });
      if (res?.data?.code === 200) {
        setFormData({
          ...formData,
          discount: res?.data?.data?.discount
        });
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/user/create_order", formData);
      if (res?.data?.code === 200) {
        navigate(`/order-details/${res?.data?.id}`);
        toast.success("تم انشاء الطلب بنجاح");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "حدث خطأ ما");
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return settingsLoading || addressLoading ? (
    <DataLoader />
  ) : (
    <>
      <SectionHeader />

      <section className="checkout_section">
        <div className="container">
          <div className="row m-0">
            {/* cart products */}
            <div className="col-lg-6 col-12 p-2">
              <div className="products">
                {cart?.map((c) => (
                  <div className="product" key={c.id}>
                    <div className="pro_img">
                      <img src={c?.product?.image} alt="product" />
                    </div>
                    <div className="info">
                      <h6>{c?.product?.title}</h6>
                      <div className="count_price">
                        <p>
                          الكمية : <span>X{c?.quantity}</span>
                        </p>
                        <p>
                          الاجمالي :{" "}
                          <span>
                            {(c?.product?.offer_price
                              ? c?.product?.offer_price
                              : c?.product?.price) * c?.quantity}
                          </span>{" "}
                          ريال
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 col-12 p-2">
              <div className="d-flex flex-column gap-3">
                {/* checkout price details */}
                <div className="checkout-details">
                  <ul>
                    <li>
                      <div className="title">{t("orders.orderPrice")}</div>
                      <div className="value">{formData?.sub_total} ريال</div>
                    </li>
                    <li>
                      <div className="title">{t("orders.taxes")}</div>
                      <div className="value ">{formData?.taxes} ريال</div>
                    </li>
                    <li className="discount">
                      <div className="title">{t("orders.discount")}</div>
                      <div className="value ">{formData?.discount} ريال</div>
                    </li>
                    <li className="bigger">
                      <div className="title">{t("orders.deliveryCost")}</div>
                      <div className="value ">
                        {formData?.delivery_price} ريال
                      </div>
                    </li>
                    <li className="bigger">
                      <div className="title">{t("orders.total")}</div>
                      <div className="value ">{formData?.total} ريال</div>
                    </li>
                  </ul>
                </div>

                {/* checkout form */}
                <form
                  className="form d-flex flex-column gap-3 p-0"
                  onSubmit={handleSubmit}
                >
                  <TextField
                    name="notes"
                    id="notes"
                    value={formData?.notes}
                    onChange={(e) => handleChange(e)}
                    placeholder={t("writeHere")}
                    label={t("cart.orderDetails")}
                  />

                  {/* addresses */}
                  <div className="address-wrapper">
                    <h6>{t("cart.orderAddress")}</h6>
                    {addresses?.data?.length > 0 && (
                      <div className="radios">
                        {addresses?.data?.map((address) => (
                          <label htmlFor={address?.id} key={address?.id}>
                            <input
                              type="radio"
                              name="address_id"
                              id={address?.id}
                              value={address?.id}
                              onChange={(e) => handleChange(e)}
                              checked={
                                Number(formData.address_id) === address?.id
                              }
                            />
                            <span className="address">
                              {address?.address_title}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-location-plus "></i>
                      <span onClick={() => setShowModal(true)}>
                        {t("cart.addAddress")}
                      </span>
                    </div>
                  </div>

                  {/* payment method */}
                  <div className="paymentMethod-wrapper">
                    <h6>{t("cart.paymentMethod")}</h6>
                    <div className="radios">
                      <label htmlFor="cash">
                        <input
                          type="radio"
                          name="payment_method"
                          id="cash"
                          value="cash"
                          checked={formData?.payment_method === "cash"}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="address">{t("cart.cash")}</span>
                      </label>

                      <label htmlFor="wallet">
                        <input
                          type="radio"
                          name="payment_method"
                          id="wallet"
                          value="wallet"
                          checked={formData?.payment_method === "wallet"}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="address">{t("cart.wallet")}</span>
                      </label>
                    </div>
                  </div>

                  <div className="coupon_form">
                    <div className="coupon_input">
                      <h6 className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-receipt "></i>
                        {t("cart.addCoupon")}
                      </h6>
                      <InputField
                        type="text"
                        id="coupon"
                        name="coupon"
                        placeholder={t("writeHere")}
                        value={formData?.coupon}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <SubmitButton
                      onClick={applyCoupon}
                      loading={couponLoading}
                      name={t("cart.apply")}
                    />
                  </div>

                  {/* <div className="coupon-card">
                    <div className="header">
                      <i className="fa-solid fa-receipt"></i>
                      <h3>TAWFFER50%</h3>
                    </div>
                    <button className="discard_coupon">
                      <i className="fa-regular fa-trash delete"></i>
                    </button>
                    <div className="details">
                      <span className="details-box">الحد الادني ٢٠٠ ريال</span>
                      <span className="details-box">الحد الاقصي ٢٠٠٠ ريال</span>
                    </div>
                  </div> */}

                  <SubmitButton
                    className={"mt-4"}
                    name={t("cart.sendOrder")}
                    loading={loading}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        <AddAddress showModal={showModal} setShowModal={setShowModal} />
      </section>
    </>
  );
}

export default Checkout;
