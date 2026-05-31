import React from "react";
import { Box, Card, CardContent } from "@mui/material";

import img1 from "./imgs/img1.jpeg";
import img2 from "./imgs/img2.jpeg";
import img3 from "./imgs/img3.jpeg";
import img4 from "./imgs/img4.jpeg";
import GreenOverlayImage from "../../Components/ImgOverlay";

const features = [
  {
    text: "Pressure councillors to vote for a key motion",
    image: img1,
  },
  {
    text: "Respond en masse to a consultation or survey",
    image: img2,
  },
  {
    text: "Pile pressure on a member defence target",
    image: img3,
  },
  {
    text: "Shower politicians with personalised member stories",
    image: img4,
  },
];

export default function FeatureCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2.5,
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        width: "100%",
      }}
    >
      {features.map((feature) => (
        <Card
          key={feature.text}
          sx={{
            borderRadius: 1,
            boxShadow: "0 10px 22px rgba(0, 0, 0, 0.14)",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box sx={{ aspectRatio: "4 / 3", overflow: "hidden", width: "100%" }}>
            <GreenOverlayImage
              src={feature.image}
              alt={feature.text}
              border_radius="0"
              height="100%"
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, px: 2, py: 2.25 }}>
            <p
              style={{
                lineHeight: 1.45,
                margin: 0,
                overflowWrap: "break-word",
                textAlign: "center",
              }}
            >
              {feature.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
