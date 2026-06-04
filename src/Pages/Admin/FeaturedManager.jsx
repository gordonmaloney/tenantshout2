import React, { useMemo, useState, useEffect } from "react";
import {
  updateFeaturedCampaigns,
  getFeaturedCampaigns,
} from "./featuredCampaignsApi";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const getCampaign = (item) => item?.campaign ?? item ?? {};
const getId = (item) => {
  const campaign = getCampaign(item);
  return String(
    campaign?._id ??
      campaign?.id ??
      campaign?.campaignId ??
      item?._id ??
      item?.id ??
      item?.campaignId ??
      item
  );
};
const getLabel = (item) => {
  const campaign = getCampaign(item);
  return campaign?.title ?? campaign?.campaignId ?? getId(item);
};

export default function FeaturedManager({ campaigns = [] }) {
  const [addingId, setAddingId] = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedCampaigns()
      .then(setFeatured)
      .catch(() => setFeatured({ featuredCampaigns: [] }));
  }, []);

  const featuredIds = useMemo(() => {
    const arr = featured?.featuredCampaigns ?? [];
    return arr.map(getId);
  }, [featured]);

  const featuredObjects = useMemo(() => {
    const arr = featured?.featuredCampaigns ?? [];
    const byId = new Map(campaigns.map((campaign) => [getId(campaign), campaign]));

    return arr.map((item) => byId.get(getId(item)) ?? item).filter(Boolean);
  }, [featured, campaigns]);

  const addableCampaigns = useMemo(() => {
    const set = new Set(featuredIds);
    return campaigns.filter((campaign) => !set.has(getId(campaign)));
  }, [campaigns, featuredIds]);

  const persist = async (newIds) => {
    const token = localStorage.getItem("token");
    const updated = await updateFeaturedCampaigns(newIds, token);
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
    if (!addingId || featuredIds.includes(addingId)) return;

    try {
      await persist([...featuredIds, addingId]);
      setAddingId("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          maxWidth: "70ch",
        }}
      >
        <Typography component="h2" sx={sectionTitleSx}>
          Featured campaigns
        </Typography>
        <Typography sx={sectionCopySx}>
          Choose which campaigns appear on the TenantShout homepage.
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(9, 124, 53, 0.065)",
          border: "1px solid rgba(9, 124, 53, 0.18)",
          borderRadius: 1,
          mt: 2,
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          component="h3"
          sx={{
            color: "var(--text-color)",
            fontSize: "0.98rem",
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 1.25,
          }}
        >
          Add a campaign to the homepage
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
          <FormControl fullWidth size="small">
            <Typography
              component="label"
              htmlFor="add-campaign"
              sx={{
                color: "var(--muted-text)",
                display: "block",
                fontSize: "0.78rem",
                fontWeight: 800,
                mb: 0.5,
                textTransform: "uppercase",
              }}
            >
              Campaign
            </Typography>
            <Select
              id="add-campaign"
              value={addingId}
              onChange={(event) => setAddingId(event.target.value)}
              displayEmpty
              renderValue={(value) =>
                value
                  ? getLabel(addableCampaigns.find((campaign) => getId(campaign) === value))
                  : "Select a campaign to feature"
              }
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                minHeight: 40,
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border-subtle)",
                },
              }}
            >
              <MenuItem value="">
                <em>Select a campaign</em>
              </MenuItem>
              {addableCampaigns.map((campaign) => {
                const id = getId(campaign);
                return (
                  <MenuItem key={id} value={id}>
                    {getLabel(campaign)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button
            onClick={handleAdd}
            disabled={!addingId}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "var(--primary-color)",
              border: "1px solid var(--primary-color)",
              borderRadius: 1,
              boxShadow: "none",
              color: "white",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              fontWeight: 800,
              minHeight: 40,
              opacity: addingId ? 1 : 0.56,
              px: 1.75,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "rgb(3, 55, 27)",
                borderColor: "rgb(3, 55, 27)",
                boxShadow: "none",
              },
            }}
          >
            Add featured
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(9, 124, 53, 0.045)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 1,
          mt: 2,
          overflow: "hidden",
        }}
      >
        <List dense disablePadding>
          {featuredObjects.length === 0 ? (
            <ListItem sx={{ px: 2, py: 1.5 }}>
              <ListItemText
                primary="No featured campaigns selected"
                primaryTypographyProps={{ sx: { color: "var(--muted-text)" } }}
              />
            </ListItem>
          ) : (
            featuredObjects.map((campaign, index) => {
              const id = getId(campaign);
              return (
                <React.Fragment key={id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        aria-label={`Remove ${getLabel(campaign)} from featured campaigns`}
                        onClick={() => handleRemove(id)}
                        size="small"
                        sx={{ color: "var(--muted-text)" }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                    sx={{ px: 2, py: 1.15 }}
                  >
                    <StarBorderIcon
                      sx={{
                        color: "var(--primary-color)",
                        flex: "0 0 auto",
                        mr: 1.25,
                      }}
                    />
                    <ListItemText
                      primary={getLabel(campaign)}
                      secondary={id}
                      primaryTypographyProps={{
                        sx: {
                          color: "var(--text-color)",
                          fontWeight: 800,
                          lineHeight: 1.25,
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          color: "var(--muted-text)",
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                        },
                      }}
                    />
                  </ListItem>
                  {index < featuredObjects.length - 1 && <Divider />}
                </React.Fragment>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}

const sectionTitleSx = {
  color: "var(--text-color)",
  fontSize: "1.25rem",
  fontWeight: 800,
  lineHeight: 1.15,
  m: 0,
};

const sectionCopySx = {
  color: "var(--muted-text)",
  lineHeight: 1.5,
  mt: 0.5,
};
