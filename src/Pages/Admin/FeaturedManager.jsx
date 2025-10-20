// Assumes you have `campaigns` (all campaigns) and `featured` (singleton doc)
// and the API helper `updateFeaturedCampaigns(featuredIds, token)` available.

import React, { useMemo, useState, useEffect } from "react";
import {
  updateFeaturedCampaigns,
  getFeaturedCampaigns,
} from "./featuredCampaignsApi"; // adjust path
import {
  Grid2 as Grid,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { BtnStyle, TextFieldStyle } from "../../MUIStyles";

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
    <>
      <h1> Featured Campaigns</h1>

<p>Chose which campaigns will feature on the home page:</p>

      <Box
        sx={{
          maxWidth: 420,
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          m: 2,
          borderRadius: 2,
        }}
      >
        <List dense sx={{ mt: 1 }}>
          {featuredObjects.map((camp) => {
            const id = getId(camp);
            const primary = camp?.campaignId || camp?.title || id;
            return (
              <ListItem
                key={id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => handleRemove(id)}
                    size="small"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={primary} />
              </ListItem>
            );
          })}
          {featuredObjects.length === 0 && (
            <ListItem>
              <ListItemText primary="(none yet)" />
            </ListItem>
          )}
        </List>

        <Grid container spacing={1} alignItems="center">
          <Grid size={{ xs: 12, sm: 8 }}>
            <FormControl fullWidth size="small">
              <Select
                labelId="add-campaign-label"
                id="add-campaign"
                value={addingId}
                sx={TextFieldStyle}
                label="Add a campaign"
                onChange={(e) => setAddingId(e.target.value)}
                displayEmpty
                renderValue={(val) =>
                  val ? (
                    addableCampaigns.find((c) => getId(c) === val)?.title ??
                    addableCampaigns.find((c) => getId(c) === val)
                      ?.campaignId ??
                    val
                  ) : (
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>
                      — Select a campaign to add —
                    </span>
                  )
                }
              >
                <MenuItem value="">
                  <em>— Select a campaign to add —</em>
                </MenuItem>
                {addableCampaigns.map((c) => {
                  const id = getId(c);
                  const label = c.campaignId || c.title || id;
                  return (
                    <MenuItem key={id} value={id}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAdd}
              disabled={!addingId}
              sx={{
                ...BtnStyle,
                color: addingId ? "white" : "grey !important",
              }}
            >
              Add to featured
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
