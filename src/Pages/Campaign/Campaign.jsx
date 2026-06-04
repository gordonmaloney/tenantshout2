import React, { useRef, useState, useEffect } from "react";

import FetchTarget from "./FetchTarget";

import Prompts from "./Prompts";
import Message from "./Message/Message";
import { Tooltip, Button, TextField } from "@mui/material";
import { BtnStyleSmall, TextFieldStyle } from "../../MUIStyles";

import { webmailProviders } from "./webmailProviders";

//this renders the prompts and then the actual template message

const Campaign = ({ campaign, stage, setStage }) => {
  const requirePostcode =
    campaign.target !== "custom" && campaign.target !== "edregcttee";
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const [postcode, setPostcode] = useState("");
  const fetchTargetRef = useRef(null);
  const [checkingPostcode, setCheckingPostcode] = useState(false);

  useEffect(() => {}, [postcode]);

  const [adminDivisions, setAdminDivisions] = useState({
    ward: "",
    constituency: "",
    scotConstituency: "",
  });

  const [prompts, setPrompts] = useState([]);

  const [emailClient, setEmailClient] = useState(undefined);
  const [userEmail, setUserEmail] = useState("");
  const emailRequiredAndInvalid =
    campaign.channel === "email" && !isValidEmail(userEmail || "");

  const matchProvider = (domain) => {
    return webmailProviders.find((p) =>
      p.domains.includes(domain.toLowerCase())
    );
  };
  const sniffMX = async (domain) => {
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
        { headers: { Accept: "application/dns-json" } }
      );
      if (!res.ok) return null;
      const { Answer } = await res.json();
      for (let { data } of Answer || []) {
        for (let provider of webmailProviders) {
          if (data.includes(provider.mxHint)) {
            return provider.name;
          }
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const checkEmailClient = async () => {
    if (!userEmail) {
      setEmailClient(null);
      return;
    }
    const email = userEmail.trim();
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      setEmailClient("mobile");
      return;
    }
    const [, domain] = email.split("@");
    if (!domain) {
      setEmailClient(null);
      return;
    }
    // ① static match
    let provider = matchProvider(domain);
    if (provider) {
      setEmailClient(provider.name);
      return;
    }
    // ② MX sniff
    const mxResult = await sniffMX(domain);
    if (mxResult) {
      setEmailClient(mxResult);
      return;
    }
    // ③ fallback
    setEmailClient(null);
  };

  useEffect(() => {
    // Load prompts with initial answers from campaign data
    if (campaign) {
      setPrompts(
        (campaign.prompts || []).map((prompt) => ({
          ...prompt,
          answer: prompt.answer || "",
        }))
      );
    }
  }, [campaign]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const missingRequiredPrompts = prompts.some(
    (prompt) =>
      prompt.required &&
      (prompt.answer === null ||
        prompt.answer === undefined ||
        prompt.answer === "")
  );
  const postcodeRequiredAndMissing = requirePostcode && !adminDivisions.ward;
  const cannotContinue =
    emailRequiredAndInvalid || missingRequiredPrompts || postcodeRequiredAndMissing;

  const handleButtonClick = () => {
    if (
      cannotContinue
    ) {
      setTooltipOpen(true);
      // Automatically close tooltip after 3 seconds
      setTimeout(() => {
        setTooltipOpen(false);
      }, 3000);
    }
  };

  const handleNextClick = async () => {
    if (missingRequiredPrompts || emailRequiredAndInvalid) {
      handleButtonClick();
      return;
    }

    if (postcodeRequiredAndMissing) {
      setCheckingPostcode(true);
      const found = await fetchTargetRef.current?.fetchPostcodeData();
      setCheckingPostcode(false);

      if (!found) {
        handleButtonClick();
        return;
      }
    }

    await checkEmailClient();
    setStage((old) => old + 1);
  };

  useEffect(() => {
      !requirePostcode &&
      (campaign.prompts || []).length == 0 &&
      stage == 0 &&
      (setStage(1));
  }, [campaign.prompts, requirePostcode, setStage, stage]);

  return (
    <div>
      {stage == 0 && (
        <>
          <h2 style={{ margin: "0 0 10px 0" }}>A few quick questions...</h2>

          {requirePostcode && (
            <FetchTarget
              ref={fetchTargetRef}
              postcode={postcode}
              setPostcode={setPostcode}
              campaign={campaign}
              adminDivisions={adminDivisions}
              setAdminDivisions={setAdminDivisions}
            />
          )}
          <Prompts
            campaign={campaign}
            prompts={prompts}
            setPrompts={setPrompts}
          />

          <div
            style={{ display: campaign.channel == "email" ? "block" : "none" }}
          >
            <div className="email">Your email: *</div>

            <TextField
              placeholder="example@email.com"
              sx={TextFieldStyle}
              fullWidth
              value={userEmail}
              required
              error={Boolean(userEmail) && emailRequiredAndInvalid}
              helperText={
                Boolean(userEmail) && emailRequiredAndInvalid
                  ? "Enter a valid email address."
                  : ""
              }
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip
              title="Make sure you have filled out all the required fields marked with *"
              open={tooltipOpen}
              disableHoverListener
              disableFocusListener
              disableTouchListener
              placement="left"
            >
              <span onClick={handleButtonClick}>
                <Button
                  sx={BtnStyleSmall}
                  disabled={
                    checkingPostcode ||
                    emailRequiredAndInvalid ||
                    missingRequiredPrompts
                  }
                  onClick={() => handleNextClick()}
                >
                  {checkingPostcode ? "Checking..." : "Next"}
                </Button>{" "}
              </span>
            </Tooltip>
          </div>
        </>
      )}

      {stage == 1 && (
        <>
          <Message
            adminDivisions={adminDivisions}
            campaign={campaign}
            prompts={prompts}
            postcode={postcode}
            setStage={setStage}
            emailClient={emailClient}
          />
        </>
      )}
    </div>
  );
};

export default Campaign;
