
import { ENDPOINT } from "../../Endpoints";

// GET the current featured campaigns
export async function getFeaturedCampaigns() {
  try {
    const res = await fetch(`${ENDPOINT}featured-campaigns`);
    if (!res.ok) {
      throw new Error(`Error fetching featured campaigns: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// UPDATE the list of featured campaigns
// expects: array of campaign IDs
export async function updateFeaturedCampaigns(featuredCampaigns, token) {
  try {
    const res = await fetch(`${ENDPOINT}featured-campaigns`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // token from your auth flow
      },
      body: JSON.stringify({ featuredCampaigns }),
    });

    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(errBody.error || "Error updating featured campaigns");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
