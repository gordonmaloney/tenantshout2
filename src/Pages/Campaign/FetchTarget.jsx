import React, { useState } from "react";
import { TextField } from "@mui/material";
import { BtnStyle, TextFieldStyle } from "../../MUIStyles";

//Take user's postcode  and set adminDivisions

//this uses the postcodes.io API

const FetchTarget = ({
  campaign,
  postcode,
  setPostcode,
  adminDivisions,
  setAdminDivisions,
}) => {
  const [invalidPC, setInvalidPC] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Utility function to validate UK postcode format
  const isValidPostcode = (postcode) =>
    /^[A-Z0-9]{2,4}\s?[A-Z0-9]{3}$/i.test(postcode);

  // Fetch UK postcode data
  const fetchUKData = async (trimmedPostcode) => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${trimmedPostcode}`,
    );
    return response.json();
  };

  const POSTCODE_DATA_BASE =
    "https://scotland-constituencies.netlify.app/postcode-json";

  const normalisePostcode = (postcode) =>
    String(postcode || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .trim();

  const getOutwardCode = (postcode) => {
    const normalised = normalisePostcode(postcode);

    // EH65QQ -> EH6
    // AB101AA -> AB10
    // G428AB -> G42
    const match = normalised.match(/^([A-Z]{1,2}\d[A-Z\d]?)/);

    return match ? match[1] : null;
  };

  // Fetch Scotland-specific data from your static Netlify files
  const fetchScotlandData = async (postcode) => {
    console.log("fetching scotland data", postcode);
    const normalised = normalisePostcode(postcode);
    const outward = getOutwardCode(normalised);

    if (!outward) {
      throw new Error("Could not identify outward postcode");
    }

	console.log('outward', outward)
    const response = await fetch(`${POSTCODE_DATA_BASE}/${outward}.json`);

    if (!response.ok) {
      throw new Error(`No postcode data file found for ${outward}`);
    }

    const data = await response.json();

    const result = data[normalised];

	console.log('result', result)
    if (!result) {
      throw new Error(`Postcode not found in ${outward}.json`);
    }

    return result;
  };

  // Main function to fetch postcode data
  const fetchPostcodeData = async () => {
    // Trim whitespace from postcode before validation and fetching
    const trimmedPostcode = postcode.trim();

    // Early validation for postcode format
    if (!isValidPostcode(trimmedPostcode)) {
      setInvalidPC(true);
      setAdminDivisions({
        ward: "",
        constituency: "",
        scotConstituency: "",
      });
      setErrorMessage(
        "Invalid postcode format. Please enter a valid UK postcode.",
      );
      return;
    }

    setSearching(true);
    setInvalidPC(false);
    setErrorMessage("");

    try {
      const uk_data = await fetchUKData(trimmedPostcode);

      if (uk_data.result.country === "Scotland") {
        const scotland_data = await fetchScotlandData(trimmedPostcode);
		console.log('scotland data', scotland_data)

        if (scotland_data.c !== null) {
          setAdminDivisions({
            constituency: uk_data.result.parliamentary_constituency,
            ward: uk_data.result.admin_ward,
            scotConstituency: scotland_data.c,
            scotRegion: scotland_data.r,
          });
        } else {
          //this should be  fixed now
          let code =
            scotland_data.result.codes.scottish_parliamentary_constituency;

          let correctedScotConstituency;

          if (code == "S16000149") {
            correctedScotConstituency = "Coatbridge and Chryston";
          }
          if (code == "S16000150") {
            correctedScotConstituency = "Glasgow Provan";
          }

          setAdminDivisions({
            constituency: uk_data.result.parliamentary_constituency,
            ward: uk_data.result.admin_ward,
            scotConstituency: correctedScotConstituency,
          });
        }
      } else {
        setAdminDivisions({
          constituency: uk_data.result.parliamentary_constituency,
          ward: uk_data.result.admin_ward,
          scotConstituency: "",
        });
      }
    } catch {
      setInvalidPC(true);
      setErrorMessage(
        "Looks like there's something wrong with your postcode. Please check or try again later.",
      );
      setAdminDivisions({ ward: "", constituency: "", scotConstituency: "" });
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className="promptQ">
        Enter your postcode to find your representatives: *
      </div>
      <TextField
        id="postcode"
        placeholder="Your postcode..."
        sx={TextFieldStyle}
        fullWidth
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        onBlur={() => {
          if (postcode.trim() !== "") fetchPostcodeData();
        }}
      />

      {/* Display error message if invalid postcode or fetch error */}
      {errorMessage && (
        <div
          style={{
            textAlign: "center",
            color: "rgba(221,28,26,1)",
          }}
        >
          {errorMessage}
          <br />
          <br />
        </div>
      )}
    </>
  );
};

export default FetchTarget;
