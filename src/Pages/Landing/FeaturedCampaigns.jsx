// src/components/FeaturedCampaigns.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  MobileStepper,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { getFeaturedCampaigns } from "../Admin/featuredCampaignsApi";

import { BtnStyleSmall } from "../../MUIStyles";
import { BarLoader } from "react-spinners";

const StyledMobileStepper = styled(MobileStepper)(({ theme }) => ({
  backgroundColor: "var(--surface-color)",
  padding: 0,

  // Dots container
  "& .MuiMobileStepper-dots": {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(1),
  },

  // Inactive dots
  "& .MuiMobileStepper-dot": {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    margin: "0 4px",
    opacity: 1, // override default semi-transparent
  },
  // Active dot
  "& .MuiMobileStepper-dotActive": {
    backgroundColor: "var(--textfield-outline)",
    opacity: 1, // make sure it’s fully opaque
  },
}));

export default function FeaturedCampaigns() {
  const [activeStep, setActiveStep] = useState(0);
  const [featured, setFeatured] = useState({ featuredCampaigns: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedCampaigns()
      .then((data) => setFeatured(data || { featuredCampaigns: [] }))
      .catch(() => setFeatured({ featuredCampaigns: [] }))
      .finally(() => setLoading(false));
  }, []);

  const featuredCampaigns = featured?.featuredCampaigns || [];
  const maxSteps = featuredCampaigns.length;

  const handleNext = () => {
    if (!maxSteps) return;
    setActiveStep((prev) => (prev + 1) % maxSteps);
  };
  const handleBack = () => {
    if (!maxSteps) return;
    setActiveStep((prev) => (prev + maxSteps - 1) % maxSteps);
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, mx: { xs: 0, sm: "auto" }, maxWidth: { xs: "358px", sm: "520px" }, width: "100%", py: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <BarLoader />
        </div>
      </Box>
    );
  }

  if (!maxSteps) {
    return (
      <Box sx={{ flexGrow: 1, mx: { xs: 0, sm: "auto" }, maxWidth: { xs: "358px", sm: "520px" }, width: "100%" }}>
        <h2 style={{ margin: "0 0 14px" }}>Current actions</h2>
        <Card className="featuredCard" sx={{ borderRadius: 1 }}>
          <CardContent>
            <Typography>No featured campaigns are live right now.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const activeCampaign = featuredCampaigns[activeStep]?.campaign;

  return (
    <Box sx={{ flexGrow: 1, mx: { xs: 0, sm: "auto" }, maxWidth: { xs: "358px", sm: "520px" }, width: "100%" }}>
      <h2 style={{ margin: "0 0 14px" }}>Current actions</h2>
      <Card
        className="featuredCard"
        sx={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 1,
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.52)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, sm: 3 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
            <h3 style={{ margin: 0 }}>{activeCampaign.title}</h3>
            {activeCampaign.channel && (
              <Chip
                label={activeCampaign.channel}
                size="small"
                sx={{
                  borderRadius: "4px",
                  color: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                  textTransform: "capitalize",
                }}
                variant="outlined"
              />
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 5,
              lineHeight: 1.55,
            }}
          >
            {activeCampaign.blurb}
          </Typography>

          <Box sx={{ mt: 2.25 }}>
            <Link
              to={`/act/${activeCampaign.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button sx={BtnStyleSmall}>Take action</Button>
            </Link>
          </Box>
        </CardContent>
      </Card>

      <StyledMobileStepper
        variant="dots"
        steps={Math.max(maxSteps, 1)}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={maxSteps === 0}
            sx={{ color: "var(--textfield-outline)" }} // force green
          >
            Next
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={maxSteps === 0}
            sx={{ color: "var(--textfield-outline)" }} // force green
          >
            Back
          </Button>
        }
      />
    </Box>
  );
}
