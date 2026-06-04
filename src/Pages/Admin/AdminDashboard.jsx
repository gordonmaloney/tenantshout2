import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import { useCampaigns } from "../../CampaignContext";
import DeleteCampaignButton from "./DeleteCampaignButton";
import FeaturedManager from "./FeaturedManager";

const navItems = [
  { text: "New campaign", href: "#new" },
  { text: "Featured", href: "#featured" },
  { text: "Campaigns", href: "#campaigns" },
];

const formatDate = (isoString) => {
  if (!isoString) return "Not recorded";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Not recorded";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getCampaign = (item) => item?.campaign ?? item ?? {};
const getCampaignId = (item) =>
  getCampaign(item)?.id ?? getCampaign(item)?.campaignId ?? item?._id ?? item?.id;
const getCampaignTimestamp = (item) => {
  const value = item?.updatedAt || item?.createdAt;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
};

const CAMPAIGNS_PER_PAGE = 8;

const AdminDashboard = () => {
  const { campaigns = [], loading, fetchCampaigns } = useCampaigns();
  const [page, setPage] = useState(1);

  const sortedCampaigns = useMemo(
    () =>
      [...campaigns].sort(
        (a, b) => getCampaignTimestamp(b) - getCampaignTimestamp(a)
      ),
    [campaigns]
  );

  const pageCount = Math.max(
    1,
    Math.ceil(sortedCampaigns.length / CAMPAIGNS_PER_PAGE)
  );
  const visibleCampaigns = sortedCampaigns.slice(
    (page - 1) * CAMPAIGNS_PER_PAGE,
    page * CAMPAIGNS_PER_PAGE
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, var(--surface-color) 0%, #ffffff 42%, var(--surface-soft) 100%)",
        color: "var(--text-color)",
        minHeight: "calc(100vh - 60px)",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "220px minmax(0, 1fr)" },
          gap: { xs: 2.5, lg: 4 },
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 2.5, md: 4 },
        }}
      >
        <Box
          component="aside"
          sx={{
            alignSelf: "start",
            display: { xs: "none", lg: "block" },
            position: "sticky",
            top: 84,
          }}
        >
          <Typography
            component="p"
            sx={{
              color: "var(--muted-text)",
              fontSize: "0.78rem",
              fontWeight: 700,
              mb: 1,
              textTransform: "uppercase",
            }}
          >
            Admin
          </Typography>
          <Stack component="nav" spacing={0.5}>
            {navItems.map((item) => (
              <Box
                key={item.href}
                component="a"
                href={item.href}
                sx={{
                  borderRadius: 1,
                  color: "var(--text-color)",
                  fontSize: "0.95rem",
                  px: 1.25,
                  py: 1,
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "rgba(9, 124, 53, 0.08)",
                    color: "var(--primary-color)",
                  },
                }}
              >
                {item.text}
              </Box>
            ))}
          </Stack>
        </Box>

        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                component="h1"
                sx={{
                  color: "var(--primary-color)",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: { xs: "2.6rem", sm: "3.4rem" },
                  lineHeight: 0.95,
                  m: 0,
                }}
              >
                Campaign admin
              </Typography>
              <Typography sx={{ color: "var(--muted-text)", mt: 0.75 }}>
                Create, feature and update TenantShout campaigns from one place.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="../create"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                ...primaryAdminButtonSx,
                alignSelf: { xs: "stretch", sm: "auto" },
                justifyContent: "center",
              }}
            >
              New campaign
            </Button>
          </Box>

          <Paper id="new" elevation={0} sx={sectionSx}>
            <Box
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography component="h2" sx={sectionTitleSx}>
                  Start a campaign
                </Typography>
                <Typography sx={sectionCopySx}>
                  Set up a new action, message template and targeting flow.
                </Typography>
              </Box>
              <Button
                component={Link}
                to="../create"
                startIcon={<AddCircleOutlineIcon />}
                sx={{ ...secondaryAdminButtonSx, whiteSpace: "nowrap" }}
              >
                Create
              </Button>
            </Box>
          </Paper>

          <Paper id="featured" elevation={0} sx={sectionSx}>
            <FeaturedManager campaigns={campaigns} />
          </Paper>

          <Paper id="campaigns" elevation={0} sx={{ ...sectionSx, p: 0 }}>
            <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2.25 }}>
              <Typography component="h2" sx={sectionTitleSx}>
                Campaigns
              </Typography>
              <Typography sx={sectionCopySx}>
                Newest campaigns appear first. Review live actions, open public pages and edit campaign details.
              </Typography>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ display: "grid", minHeight: 220, placeItems: "center" }}>
                <CircularProgress sx={{ color: "var(--primary-color)" }} />
              </Box>
            ) : campaigns.length === 0 ? (
              <Box sx={{ px: 2.5, py: 4 }}>
                <Typography sx={{ color: "var(--muted-text)" }}>
                  No campaigns found.
                </Typography>
              </Box>
            ) : (
              <Stack>
                {visibleCampaigns.map((item, index) => {
                  const campaign = getCampaign(item);
                  const id = getCampaignId(item);
                  const updatedAt = item?.updatedAt || item?.createdAt;

                  return (
                    <Box key={id ?? index}>
                      <Box
                        sx={{
                          alignItems: { xs: "flex-start", md: "center" },
                          display: "grid",
                          gap: { xs: 1.5, md: 2 },
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "minmax(0, 1fr) auto",
                          },
                          px: { xs: 2, md: 2.5 },
                          py: 2,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: "center", flexWrap: "wrap", mb: 0.75 }}
                          >
                            <Typography component="h3" sx={campaignTitleSx}>
                              {campaign?.title || "Untitled campaign"}
                            </Typography>
                            {id && (
                              <Chip
                                label={id}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(9, 124, 53, 0.08)",
                                  borderRadius: 1,
                                  color: "var(--primary-color)",
                                  fontFamily: "monospace",
                                  maxWidth: "100%",
                                }}
                              />
                            )}
                          </Stack>
                          <Typography sx={campaignCopySx}>
                            {campaign?.blurb || "No campaign blurb added yet."}
                          </Typography>
                          <Typography sx={campaignMetaSx}>
                            Last updated: {formatDate(updatedAt)}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                          <Button
                            component={Link}
                            to={`/act/${id}`}
                            startIcon={<OpenInNewIcon />}
                            sx={rowButtonSx}
                          >
                            View
                          </Button>
                          <Button
                            component={Link}
                            to={`/edit/${id}`}
                            startIcon={<EditOutlinedIcon />}
                            sx={rowButtonSx}
                          >
                            Edit
                          </Button>
                          <DeleteCampaignButton
                            campaignId={id}
                            onDeleted={fetchCampaigns}
                            buttonSx={compactDangerButtonSx}
                          />
                        </Stack>
                      </Box>
                      {index < visibleCampaigns.length - 1 && <Divider />}
                    </Box>
                  );
                })}
                {pageCount > 1 && (
                  <>
                    <Divider />
                    <Box
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        justifyContent: "space-between",
                        px: { xs: 2, md: 2.5 },
                        py: 1.75,
                      }}
                    >
                      <Typography sx={{ color: "var(--muted-text)", fontSize: "0.88rem" }}>
                        Showing {(page - 1) * CAMPAIGNS_PER_PAGE + 1}-
                        {Math.min(page * CAMPAIGNS_PER_PAGE, sortedCampaigns.length)} of{" "}
                        {sortedCampaigns.length}
                      </Typography>
                      <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        size="small"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 1,
                            color: "var(--text-color)",
                          },
                          "& .Mui-selected": {
                            backgroundColor: "var(--primary-color) !important",
                            color: "white",
                          },
                        }}
                      />
                    </Box>
                  </>
                )}
              </Stack>
            )}
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

const sectionSx = {
  backgroundColor: "rgba(255, 255, 255, 0.78)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 1,
  boxShadow: "0 12px 32px rgba(8, 21, 13, 0.07)",
  overflow: "hidden",
  p: { xs: 2, md: 2.5 },
};

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

const campaignTitleSx = {
  color: "var(--text-color)",
  fontSize: "1.05rem",
  fontWeight: 800,
  lineHeight: 1.25,
  minWidth: 0,
};

const campaignCopySx = {
  color: "var(--text-color)",
  display: "-webkit-box",
  lineHeight: 1.45,
  maxWidth: "76ch",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
};

const campaignMetaSx = {
  color: "var(--muted-text)",
  fontSize: "0.84rem",
  mt: 0.85,
};

const baseAdminButtonSx = {
  borderRadius: 1,
  boxShadow: "none",
  fontFamily: "inherit",
  fontSize: "0.84rem",
  fontWeight: 800,
  letterSpacing: 0,
  minHeight: 34,
  textTransform: "none",
  "& .MuiButton-startIcon": {
    mr: 0.65,
  },
};

const primaryAdminButtonSx = {
  ...baseAdminButtonSx,
  backgroundColor: "var(--primary-color)",
  border: "1px solid var(--primary-color)",
  color: "white",
  px: 1.55,
  py: 0.75,
  "&:hover": {
    backgroundColor: "rgb(3, 55, 27)",
    borderColor: "rgb(3, 55, 27)",
    boxShadow: "none",
  },
};

const secondaryAdminButtonSx = {
  ...baseAdminButtonSx,
  backgroundColor: "transparent",
  border: "1px solid var(--border-subtle)",
  color: "var(--primary-color)",
  px: 1.45,
  py: 0.65,
  "&:hover": {
    backgroundColor: "rgba(9, 124, 53, 0.08)",
    borderColor: "rgba(9, 124, 53, 0.28)",
  },
};

const rowButtonSx = {
  ...baseAdminButtonSx,
  backgroundColor: "transparent",
  border: "1px solid var(--border-subtle)",
  color: "var(--text-color)",
  px: 1.1,
  py: 0.45,
  "&:hover": {
    backgroundColor: "rgba(9, 124, 53, 0.07)",
    borderColor: "rgba(9, 124, 53, 0.24)",
    color: "var(--primary-color)",
  },
};

const compactDangerButtonSx = {
  ...baseAdminButtonSx,
  backgroundColor: "transparent",
  border: "1px solid rgba(120, 0, 0, 0.24)",
  borderRadius: 1,
  color: "var(--alert-color)",
  px: 1.1,
  py: 0.45,
  "&:hover": {
    backgroundColor: "rgba(120, 0, 0, 0.06)",
    borderColor: "rgba(120, 0, 0, 0.38)",
    color: "var(--alert-color)",
  },
};

export default AdminDashboard;
