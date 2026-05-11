import { useState, useEffect } from "react";

const DATA_BASE = "https://scotland-constituencies.netlify.app/reps/";

export function useDefaultTargetting(
  campaign,
  adminDivisions,
  {
    setLoading: externalSetLoading,
    setMessaging: externalSetMessaging,
    setNotMessaging: externalSetNotMessaging,
    setErrorMsg: externalSetErrorMsg,
  } = {},
) {
  // internal defaults if parent doesn't supply
  const [loadingState, _setLoading] = useState(true);
  const [messagingState, _setMessaging] = useState([]);
  const [notMessagingState, _setNotMessaging] = useState([]);
  const [errorMsgState, _setErrorMsg] = useState("");
  const [regions, setRegions] = useState([]);
  const [msps, setMSPs] = useState([]);

  // unify setters
  const setLoading = externalSetLoading || _setLoading;
  const setMessaging = externalSetMessaging || _setMessaging;
  const setNotMessaging = externalSetNotMessaging || _setNotMessaging;
  const setErrorMsg = externalSetErrorMsg || _setErrorMsg;

  /*
  // Fetch Regions
  // Temporarily commented out while migrating to postcode lookup data
  useEffect(() => {
    if (
      campaign.target !== "msps" &&
      campaign.target !== "cllrs-msps-ben-siobhan"
    )
      return;

    let cancelled = false;
    setLoading(true);

    fetch(`${DATA_BASE}/REGIONS.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch regions");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setRegions(data);
      })
      .catch((err) => console.error("Could not load regions:", err));

    return () => {
      cancelled = true;
    };
  }, [campaign.target]);
  */

  // Fetch MSPs
  useEffect(() => {
    if (
      campaign.target !== "msps" &&
      campaign.target !== "cllrs-msps-ben-siobhan"
    )
      return;

    let cancelled = false;

    fetch(`${DATA_BASE}/MSPs.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch MSPs");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setMSPs(data);
      })
      .catch((err) => console.error("Could not load MSPs:", err));

    return () => {
      cancelled = true;
    };
  }, [campaign.target]);

  // Councillors
  useEffect(() => {
    if (
      campaign.target !== "edinburgh" &&
      campaign.target !== "glasgow" &&
      campaign.target !== "highland"
    )
      return;

    setLoading(true);
    let cancelled = false;

    fetch(`${DATA_BASE}/${campaign.target}-councillors.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch councillors");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        const councillorsForWard = data.filter(
          (c) => c.ward == adminDivisions.ward,
        );

        setMessaging(councillorsForWard);
        setLoading(false);

        if (councillorsForWard.length == 0) {
          setErrorMsg("Could not load councillors");
        }
      })
      .catch((err) => {
        console.error("Could not load councillors:", err);
        setErrorMsg("Could not load councillors");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [campaign.target, adminDivisions.ward]);

  // MPs
  useEffect(() => {
    if (campaign.target !== "mps") return;

    setLoading(true);
    let cancelled = false;

    fetch(`${DATA_BASE}/MPs.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch MPs");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setMessaging(
          data.filter((c) => c.constituency == adminDivisions.constituency),
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Could not load MPs:", err);
        setErrorMsg("Could not load MPs");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [campaign.target, adminDivisions.constituency]);

  // Add to messaging for Ben/Siobhian
  useEffect(() => {
    if (campaign.customTargetting) return;
    if (campaign.target !== "cllrs-msps-ben-siobhan") return;

    let extraAdditions = [
      {
        name: "Ben Macpherson",
        constituency: "Edinburgh Northern and Leith",
        party: "SNP",
        handle: "@BenMacpherson",
        email: "ben.macpherson.msp@parliament.scot",
      },
      {
        name: "Siobhian Brown",
        constituency: "Ayr",
        party: "SNP",
        handle: "@Siobhianayr",
        email: "siobhian.brown.msp@parliament.scot",
      },
    ];

    if (!adminDivisions.scotConstituency) {
      setErrorMsg("No Scottish Constituency found...");
      setLoading(false);
      return;
    }

    /*
    // OLD REGION LOOKUP LOGIC
    // Temporarily disabled while migrating to adminDivisions.scotRegion

    if (regions.length === 0 || msps.length === 0) return;

    const constituency = adminDivisions.scotConstituency;
    const regionObj = regions.find((r) => r.constituency === constituency);

    if (!regionObj) {
      setErrorMsg("Your constituency isn’t in our region map.");
      setLoading(false);
      return;
    }

    const regionName = regionObj.region;
    */

    if (msps.length === 0) return;

    const constituency = adminDivisions.scotConstituency;
    const regionName = adminDivisions.scotRegion;

    if (!regionName) {
      setErrorMsg("No Scottish Parliamentary Region found...");
      setLoading(false);
      return;
    }

    const inTarget = msps.filter(
      (msp) =>
        msp.constituency === constituency || msp.constituency === regionName,
    );

    extraAdditions.forEach((extra) => {
      const alreadyIncluded = inTarget.some(
        (msp) =>
          msp.name === extra.name ||
          msp.email?.toLowerCase() === extra.email?.toLowerCase(),
      );

      if (!alreadyIncluded) {
        inTarget.push(extra);
      }
    });

    fetch(`${DATA_BASE}/edinburgh-councillors.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch councillors");
        return res.json();
      })
      .then((data) => {
        const wardFromAdmin = String(adminDivisions.ward ?? "")
          .trim()
          .toLowerCase();

        const councillorsForWard = (Array.isArray(data) ? data : []).filter(
          (c) => {
            const wardInFile = String(c.ward ?? "")
              .trim()
              .toLowerCase();

            return wardInFile === wardFromAdmin;
          },
        );

        const key = (p) => p?.email?.toLowerCase?.() || `name:${p?.name}`;
        const mergedMap = new Map();

        [...inTarget, ...councillorsForWard].forEach((p) => {
          if (!p) return;
          mergedMap.set(key(p), p);
        });

        const merged = Array.from(mergedMap.values());

        setMessaging(merged);
        setLoading(false);

        if (councillorsForWard.length === 0) {
          setErrorMsg("Could not load councillors for your ward.");
        } else {
          setErrorMsg("");
        }
      })
      .catch((err) => {
        console.error("Could not load councillors", err);
        setErrorMsg("Could not load councillors.");
        setLoading(false);
      });
  }, [
    campaign.target,
    campaign.customTargetting,
    adminDivisions.scotConstituency,
    adminDivisions.scotRegion,
    adminDivisions.ward,
    msps,
  ]);

  // Add to messaging array all the targets for MSPs
  useEffect(() => {
    if (campaign.customTargetting) return;
    if (campaign.target !== "msps") return;

    if (!adminDivisions.scotConstituency) {
      setErrorMsg("No Scottish Constituency found...");
      setLoading(false);
      return;
    }

    /*
    // OLD REGION LOOKUP LOGIC
    // Temporarily disabled while migrating to adminDivisions.scotRegion

    if (regions.length === 0 || msps.length === 0) return;

    const constituency = adminDivisions.scotConstituency;
    const regionObj = regions.find((r) => r.constituency === constituency);

    if (!regionObj) {
      setErrorMsg("Your constituency isn’t in our region map.");
      setLoading(false);
      return;
    }

    const regionName = regionObj.region;
    */

    if (msps.length === 0) return;

    const constituency = adminDivisions.scotConstituency;
    const regionName = adminDivisions.scotRegion;

    if (!regionName) {
      setErrorMsg("No Scottish Parliamentary Region found...");
      setLoading(false);
      return;
    }

    const inTarget = msps.filter(
      (msp) =>
        msp.constituency === constituency || msp.constituency === regionName,
    );

    setMessaging(inTarget);
    setErrorMsg("");
    setLoading(false);
  }, [
    campaign.target,
    campaign.customTargetting,
    adminDivisions.scotConstituency,
    adminDivisions.scotRegion,
    msps,
  ]);

  return { regions, msps };
}
