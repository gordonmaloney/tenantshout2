import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { BtnStyle, BtnStyleSecondary } from "../../MUIStyles";
import FeatureCards from "./FeatureCards";
import FeaturedCampaigns from "./FeaturedCampaigns";
import img6 from "./imgs/img6.jpeg";
import GreenOverlayImage from "../../Components/ImgOverlay";

const Landing = () => {
  return (
    <Box
      component="div"
      sx={{
        backgroundColor: "rgb(3, 55, 27)",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden",
      }}
    >
      <Box
        component="section"
        sx={{
          minHeight: { xs: "520px", md: "560px" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          px: { xs: 2.5, sm: 4, md: 8 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3, 55, 27, 0.92) 0%, rgba(9, 124, 53, 0.78) 52%, rgba(9, 124, 53, 0.55) 100%)",
            zIndex: 1,
          }}
        />
        <Box
          component="img"
          src={img6}
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(25%) contrast(110%)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: { xs: "340px", sm: "680px" },
            minWidth: 0,
            color: "white",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "clamp(3.4rem, 8vw, 6.8rem)",
              lineHeight: 0.92,
              margin: "0 0 20px",
              overflowWrap: "break-word",
            }}
          >
            TenantShout
          </h1>
          <h2
            style={{
              color: "white",
              fontSize: "clamp(1.55rem, 3vw, 2.4rem)",
              lineHeight: 1,
              margin: "0 0 18px",
              maxWidth: "100%",
              overflowWrap: "break-word",
            }}
          >
            Campaign tools for tenant power
          </h2>
          <p style={{ fontSize: "1.12rem", lineHeight: 1.55, maxWidth: 570, margin: "0 0 28px", overflowWrap: "break-word" }}>
            Mobilise members to email, tweet and call key targets together.
          </p>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <a href="#featured" style={{ textDecoration: "none" }}>
              <Button sx={{ ...BtnStyle, backgroundColor: "var(--surface-color)", color: "var(--primary-color)" }}>
                Take action
              </Button>
            </a>
            <Link to="./login" style={{ textDecoration: "none" }}>
              <Button sx={{ ...BtnStyleSecondary, backgroundColor: "transparent", color: "white", borderColor: "white" }}>
                Admin login
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      <Box
        id="featured"
        component="section"
        sx={{
          backgroundColor: "var(--surface-color)",
          width: "100%",
          boxSizing: "border-box",
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Box
          sx={{
            maxWidth: "1120px",
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 7 },
            width: "100%",
            minWidth: 0,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "42%" }, minWidth: 0 }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <GreenOverlayImage
                src={img6}
                alt="Living Rent members at a demonstration"
                border_radius="8px"
                height="340px"
              />
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" }, width: "100%", maxWidth: "358px", minWidth: 0 }}>
              <h2 style={{ margin: "0 0 8px" }}>Tenant power, one action at a time</h2>
              <p style={{ margin: 0, lineHeight: 1.55, overflowWrap: "break-word" }}>
                Fast, focused campaign tools for moments when members move together.
              </p>
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "58%" }, minWidth: 0 }}>
            <FeaturedCampaigns />
          </Box>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 5, md: 7 },
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: "rgb(3, 55, 27)",
          flexGrow: 1,
        }}
      >
        <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
          <FeatureCards />
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
