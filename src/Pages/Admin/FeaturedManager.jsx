// Assumes you have `campaigns` (all campaigns) and `featured` (singleton doc)
// and the API helper `updateFeaturedCampaigns(featuredIds, token)` available.

import React, { useMemo, useState, useEffect } from "react";
import {
  updateFeaturedCampaigns,
  getFeaturedCampaigns,
} from "./featuredCampaignsApi"; // adjust path

// helper: safely extract an ID from various shapes
const getId = (x) => String(x?._id ?? x?.id ?? x?.campaignId ?? x);

export default function FeaturedManager({ campaigns = [] }) {
  const [addingId, setAddingId] = useState("");

  //fetch featured
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedCampaigns().then(setFeatured).catch(console.error);
  }, []);

  // Normalize the list of featured IDs
  const featuredIds = useMemo(() => {
    const arr = featured?.featuredCampaigns ?? [];
    return arr.map(getId);
  }, [featured]);

  // Build full featured campaign objects (works whether `featuredCampaigns` is populated or just IDs)
  const featuredObjects = useMemo(() => {
    const arr = featured?.featuredCampaigns ?? [];
    // If populated, items already look like campaigns
    const maybePopulated = arr.map((item) =>
      item?.title || item?.campaignId ? item : null
    );
    const isPopulated = maybePopulated.every(Boolean);

    if (isPopulated) return maybePopulated;

    // Not populated → map IDs to full campaign objects from `campaigns`
    const byId = new Map(campaigns.map((c) => [getId(c), c]));
    return featuredIds.map((id) => byId.get(id)).filter(Boolean);
  }, [featured, campaigns, featuredIds]);

  // All non-featured campaigns for the dropdown
  const addableCampaigns = useMemo(() => {
    const set = new Set(featuredIds);
    return campaigns.filter((c) => !set.has(getId(c)));
  }, [campaigns, featuredIds]);

  const persist = async (newIds) => {
    const token = localStorage.getItem("token");
    const updated = await updateFeaturedCampaigns(newIds, token);
    // `updated.featuredCampaigns` may be populated (objects) or IDs depending on backend populate()
    setFeatured(updated);
  };

  const handleRemove = async (id) => {
    try {
      const newIds = featuredIds.filter((fid) => fid !== id);
      await persist(newIds);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdd = async () => {
    if (!addingId) return;
    if (featuredIds.includes(addingId)) return; // guard
    try {
      const newIds = [...featuredIds, addingId];
      await persist(newIds);
      setAddingId("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, textAlign: "center" }}>Featured Campaigns:</h1>

      <ul>
        {featuredObjects.map((camp) => {
          const id = getId(camp);
          return (
            <li
              key={id}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span>{camp?.campaignId || camp?.title || id}</span>
              <button
                onClick={() => handleRemove(id)}
                style={{ marginLeft: "auto" }}
              >
                Remove
              </button>
            </li>
          );
        })}
        {featuredObjects.length === 0 && <li>(none yet)</li>}
      </ul>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select value={addingId} onChange={(e) => setAddingId(e.target.value)}>
          <option value="">— Select a campaign to add —</option>
          {addableCampaigns.map((c) => (
            <option key={getId(c)} value={getId(c)}>
              {c.campaignId || c.title || getId(c)}
            </option>
          ))}
        </select>
        <button onClick={handleAdd} disabled={!addingId}>
          Add to featured
        </button>
      </div>
    </div>
  );
}
