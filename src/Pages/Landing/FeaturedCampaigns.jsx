// src/components/FeaturedCampaigns.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  MobileStepper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { getFeaturedCampaigns } from "../Admin/featuredCampaignsApi";

import SwipeableViews from "react-swipeable-views-react-18-fix";
import { useCampaigns } from "../../CampaignContext";
import {
  BtnStyleSmall,
  MobileStepperStyle,
  StepperStyle,
} from "../../MUIStyles";
import { BarLoader } from "react-spinners";

const FEATURED_IDS = ["renthikes", "regcttee"];

const StyledMobileStepper = styled(MobileStepper)(({ theme }) => ({
  backgroundColor: "white",
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
  const { campaigns, loading } = useCampaigns();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  };
  const handleBack = () => {
    setActiveStep((prev) => (prev + maxSteps - 1) % maxSteps);
  };

  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedCampaigns().then(setFeatured).catch(console.error);
  }, []);


    console.log(featured);


  const maxSteps = featured?.featuredCampaigns?.length;

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, mx: "auto", maxWidth: "500px" }}>
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


  return (
    <Box sx={{ flexGrow: 1, mx: "auto", maxWidth: "500px" }}>
      <h2 style={{ padding: "0 10px", margin: "0" }}>Featured campaigns:</h2>
      <SwipeableViews
        index={activeStep}
        onChangeIndex={setActiveStep}
        enableMouseEvents
      >
        {featured?.featuredCampaigns?.map((c, idx) => (
          <Box key={c.campaignId} sx={{ p: 2 }}>
            <Card
              className="featuredCard"
              sx={{ maxWidth: "350px", margin: "0 auto" }}
            >
              <CardContent>
                <Typography gutterBottom>
                  <center>
                    <h3 style={{ margin: "0 auto" }}> {c.campaign.title}</h3>
                  </center>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 6, // 👈 max 5 lines
                  }}
                >
                  {c.campaign.blurb}
                </Typography>

                <center>
                  <Link
                    to={`/act/${c.campaign.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Button sx={BtnStyleSmall}>Take action</Button>
                  </Link>
                </center>
              </CardContent>
            </Card>
          </Box>
        ))}
      </SwipeableViews>

      <StyledMobileStepper
        variant="dots"
        steps={maxSteps}
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
