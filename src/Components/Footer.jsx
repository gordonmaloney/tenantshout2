import React from "react";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import livingRentLogo from "../assets/living-rent-logo.png";

const socialLinks = [
  {
    href: "https://www.instagram.com/living_rent/",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://x.com/Living_Rent",
    label: "X",
    icon: faXTwitter,
  },
  {
    href: "https://www.facebook.com/livingrentscotland/",
    label: "Facebook",
    icon: faFacebookF,
  },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--surface-color)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-color)",
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          display: "grid",
          gap: { xs: 2, md: 4 },
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          maxWidth: "1120px",
          mx: "auto",
          px: { xs: 2, sm: 4, md: 8 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        <a
          href="https://www.livingrent.org/"
          target="_blank"
          rel="noreferrer"
          style={{
            alignItems: "flex-start",
            color: "var(--muted-text)",
            display: "inline-flex",
            flexDirection: "column",
            gap: "0.45rem",
            textDecoration: "none",
          }}
        >
          <img
            src={livingRentLogo}
            alt="Living Rent logo"
            style={{ height: "22px", objectFit: "contain", width: "22px" }}
          />
          <span style={{ fontSize: "0.9rem", lineHeight: 1.35, maxWidth: "40ch" }}>
            Built by members of Living Rent, Scotland&apos;s tenants&apos; and
            community union
          </span>
        </a>

        <Box
          sx={{
            alignItems: { xs: "flex-start", md: "flex-end" },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "left", md: "right" },
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.75 }}>
            <a
              href="https://www.livingrent.org/join"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--muted-text)",
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Join Living Rent
            </a>
          </Box>

          <Box
            component="ul"
            sx={{
              alignItems: "center",
              display: "flex",
              gap: 1.4,
              listStyle: "none",
              m: 0,
              p: 0,
            }}
          >
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  style={{
                    alignItems: "center",
                    color: "var(--muted-text)",
                    display: "inline-flex",
                    fontSize: "1rem",
                    height: "24px",
                    justifyContent: "center",
                    textDecoration: "none",
                    width: "24px",
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </a>
              </li>
            ))}
          </Box>

          <a
            href="https://www.livingrent.org/privacy"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "var(--muted-text)",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Privacy policy
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
