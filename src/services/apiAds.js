import axios from "../utils/axios";

export async function getAdsByFilter(requestBody) {
  try {
    const req = await axios.post("/get_ads", requestBody);

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}

export async function getuserAds(id) {
  const requestBody = {};

  if (id) {
    requestBody.user_id = +id;
  }

  requestBody.ad_type = "sell";

  try {
    const req = await axios.post("/get_user_ads", requestBody);

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}
export async function getFavoriteAds() {
  try {
    const req = await axios.get("/user/get_ad_favorites");

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}
export async function getMostPopularAds() {
  try {
    const req = await axios.get("/get_most_popular_ads");

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}

export async function getAdById(id) {
  const requestBody = {};

  if (id) {
    requestBody.id = +id;
  }

  try {
    const req = await axios.post("/get_ad_details", requestBody);

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}

export async function getAdsVideos() {
  try {
    const req = await axios.post("/get_ads");

    return req.data;
  } catch (err) {
    throw new Error(`Error fetching ads: ${err.message}`);
  }
}
