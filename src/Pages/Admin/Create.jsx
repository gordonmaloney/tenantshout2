import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Modal,
  Grid,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Radio,
  Checkbox,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CampaignTopLevel from "../Campaign/CampaignTopLevel"; // Make sure this component exists
import { ENDPOINT } from "../../Endpoints";
import { TargetingOptions } from "../../TARGETING/TargetingOptions";
import { useCampaigns } from "../../CampaignContext";
import {
  BtnStyleSmall,
  CheckBoxStyle,
  StepperStyle,
  TextFieldStyle,
  BtnStyle,
  RadioGroupStyle,
} from "../../MUIStyles";
import { useNavigate } from "react-router";

//This is the 'create' campaign page

//TODO:
// - make the textfields look better

const slugifyCampaignId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/_+/g, "_")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");

const getSubjectList = (subject) =>
  (Array.isArray(subject) ? subject : [subject || ""])
    .map((item) => String(item || "").trim())
    .filter(Boolean);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const promptIsUsedInTemplate = (prompt, template) => {
  const id = slugifyCampaignId(prompt.id);
  if (!id) return false;
  return (
    String(template || "").includes(`<<${id}>>`) ||
    String(template || "").includes(`<<${id}=yes:`) ||
    String(template || "").includes(`<<${id}=no:`)
  );
};

const DEFAULT_CAMPAIGN = {
  id: "",
  host: "",
  channel: "email",
  title: "",
  blurb: "",
  link: "",
  subject: "",
  target: "",
  customTargetting: "",
  bcc: "",
  accordion: [],
  prompts: [],
  template: "",
  customTarget: [],
};

const createShellSx = {
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 1,
  boxShadow: "0 14px 36px rgba(8, 21, 13, 0.1)",
  maxWidth: "1180px",
  mx: "auto",
  my: 3,
  p: { xs: 2, md: 4 },
  width: { xs: "calc(100% - 24px)", md: "90%" },
};

const sidePanelSx = {
  backgroundColor: "var(--surface-color)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 1,
  p: 2,
};

const sectionPanelSx = {
  backgroundColor: "rgba(9, 124, 53, 0.035)",
  border: "1px solid var(--border-subtle)",
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
};

const nestedPanelSx = {
  backgroundColor: "white",
  border: "1px solid var(--border-subtle)",
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
};

const panelTitleSx = {
  color: "var(--text-color)",
  fontSize: "1rem",
  fontWeight: 800,
  lineHeight: 1.2,
  m: 0,
};

const panelCopySx = {
  color: "var(--muted-text)",
  fontSize: "0.92rem",
  lineHeight: 1.45,
  mt: 0.75,
};

export default function CampaignSetupForm({ edittingCampaign }) {
  const [steps, setSteps] = useState([
    "Overview",
    "Prompts",
    "Template Message",
  ]);

  const navigate = useNavigate();

  const { campaigns, loading, fetchCampaigns } = useCampaigns();

  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [customTargetModalOpen, setCustomTargetModalOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState([{ name: "", email: "" }]);
  const [campaign, setCampaign] = useState(DEFAULT_CAMPAIGN);
  const [openModal, setOpenModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [yesText, setYesText] = useState("");
  const [noText, setNoText] = useState("");
  const [yesNoError, setYesNoError] = useState("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState("");
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const [edittingCampaignId, setEdittingCampaignId] = useState("");

  useEffect(() => {
    if (edittingCampaign) {
      const normalizedCampaign = {
        ...DEFAULT_CAMPAIGN,
        ...edittingCampaign,
        accordion: edittingCampaign.accordion || [],
        prompts: edittingCampaign.prompts || [],
        customTarget: edittingCampaign.customTarget || [],
      };

      setEdittingCampaignId(edittingCampaign.id);
      setCampaign(normalizedCampaign);
      setCustomTargets(
        normalizedCampaign.customTarget.length
          ? normalizedCampaign.customTarget
          : [{ name: "", email: "" }]
      );
    }
  }, [edittingCampaign]);

  const token = localStorage.getItem("token");

  const validateCampaign = (safeCampaignId) => {
    const errors = [];
    const existingIds = campaigns
      .map((camp) => slugifyCampaignId(camp?.campaign?.id || camp?.campaignId))
      .filter(Boolean);
    const promptIds = campaign.prompts
      .map((prompt) => slugifyCampaignId(prompt.id))
      .filter(Boolean);
    const duplicatePromptIds = promptIds.filter(
      (id, index) => promptIds.indexOf(id) !== index
    );
    const cleanedCustomTargets = (campaign.customTarget || []).filter((target) =>
      Object.values(target).some((value) => String(value || "").trim() !== "")
    );

    if (!safeCampaignId) errors.push("Campaign ID is required.");
    if (
      existingIds.includes(safeCampaignId) &&
      safeCampaignId !== slugifyCampaignId(edittingCampaignId)
    ) {
      errors.push("Campaign ID is already taken.");
    }
    if (!String(campaign.host || "").trim()) errors.push("Host is required.");
    if (!String(campaign.title || "").trim()) errors.push("Campaign title is required.");
    if (!String(campaign.blurb || "").trim()) errors.push("Blurb is required.");
    if (!campaign.target) errors.push("Target is required.");
    if (campaign.channel === "phone" && campaign.target !== "custom") {
      errors.push("Phone campaigns must use custom targets.");
    }
    if (campaign.channel === "email" && getSubjectList(campaign.subject).length === 0) {
      errors.push("At least one subject line is required for email campaigns.");
    }
    if (campaign.channel !== "phone" && !String(campaign.template || "").trim()) {
      errors.push("Template message is required.");
    }
    if (campaign.bcc && !isEmail(campaign.bcc)) {
      errors.push("BCC must be a valid email address.");
    }
    if (campaign.bcc && !campaign.bcc.toLowerCase().endsWith("@livingrent.org")) {
      errors.push("BCC must be a livingrent.org email address.");
    }

    campaign.prompts.forEach((prompt, index) => {
      const promptLabel = `Prompt ${index + 1}`;
      const safePromptId = slugifyCampaignId(prompt.id);
      if (!safePromptId) errors.push(`${promptLabel} needs an ID.`);
      if (safePromptId && safePromptId !== prompt.id) {
        errors.push(`${promptLabel} ID can only use lowercase letters, numbers, hyphens and underscores.`);
      }
      if (!String(prompt.question || "").trim()) {
        errors.push(`${promptLabel} needs a question.`);
      }
    });
    [...new Set(duplicatePromptIds)].forEach((id) => {
      errors.push(`Prompt ID "${id}" is used more than once.`);
    });

    if (campaign.target === "custom" || campaign.channel === "phone") {
      if (cleanedCustomTargets.length === 0) {
        errors.push("At least one custom target is required.");
      }
      cleanedCustomTargets.forEach((target, index) => {
        const targetLabel = `Custom target ${index + 1}`;
        if (!String(target.name || "").trim()) {
          errors.push(`${targetLabel} needs a name.`);
        }
        if (campaign.channel === "email" && !isEmail(target.email || "")) {
          errors.push(`${targetLabel} needs a valid email address.`);
        }
        if (campaign.channel === "twitter" && !String(target.handle || "").trim()) {
          errors.push(`${targetLabel} needs a Twitter/X handle.`);
        }
        if (campaign.channel === "phone" && !String(target.phone || "").trim()) {
          errors.push(`${targetLabel} needs a phone number.`);
        }
      });
    }

    return errors;
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const safeCampaignId = slugifyCampaignId(campaign.id);
        const errors = validateCampaign(safeCampaignId);

        if (errors.length > 0) {
          setValidationErrors(errors);
          setCampaign((current) => ({ ...current, id: safeCampaignId }));
          return;
        }

        setValidationErrors([]);

        const cleanedCustomTargets = (campaign.customTarget || []).filter((target) =>
          Object.values(target).some((value) => String(value || "").trim() !== "")
        );
        const sanitizedCampaign = {
          ...campaign,
          id: safeCampaignId,
          customTarget: cleanedCustomTargets,
        };

        const payload = {
          campaignId: safeCampaignId,
          campaign: sanitizedCampaign,
        };

        //create new campaign if NOT edittingCampaign
        if (!edittingCampaign) {
          const response = await fetch(ENDPOINT + "campaigns/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error("Failed to post campaign");
          }
        } else if (edittingCampaign) {
          //update existing campaign if edittingCampaign

          const response = await fetch(
            ENDPOINT + "campaigns/" + `${edittingCampaignId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            },
          );
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error response:", errorText);
            throw new Error("Failed to post campaign");
          } else {
            fetchCampaigns();
          }
        }

        fetchCampaigns();
        alert("Campaign successfully submitted!");
        navigate(`../act/${safeCampaignId}`);
      } catch (error) {
        console.error("Submission error:", error);
        alert("There was an error submitting the campaign.");
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setCampaign({ ...campaign, [field]: value });
  };

  const handlePromptChange = (index, field, value) => {
    const updated = [...campaign.prompts];
    updated[index][field] = value;
    setCampaign({ ...campaign, prompts: updated });
  };

  const handleRemovePrompt = (index) => {
    setCampaign({
      ...campaign,
      prompts: campaign.prompts.filter((_, promptIndex) => promptIndex !== index),
    });
  };

  const handleFAQChange = (index, field, value) => {
    const updated = [...campaign.accordion];
    updated[index][field] = value;
    setCampaign({ ...campaign, accordion: updated });
  };

  const handleRemoveFAQ = (index) => {
    setCampaign({
      ...campaign,
      accordion: campaign.accordion.filter((_, faqIndex) => faqIndex !== index),
    });
  };

  const handleCustomTargetChange = (index, field, value) => {
    const updated = [...customTargets];
    updated[index][field] = value;
    setCustomTargets(updated);
    setCampaign({ ...campaign, customTarget: updated });
  };

  const insertPrompt = (placeholder) => {
    setCampaign({ ...campaign, template: campaign.template + placeholder });
  };

  const openYesNoModal = (prompt) => {
    setCurrentPrompt(prompt);
    setYesText("");
    setNoText("");
    setYesNoError("");
    setOpenModal(true);
  };

  const handleInsertYesNo = () => {
    const id = currentPrompt.id;
    const trimmedYesText = yesText.trim();
    const trimmedNoText = noText.trim();

    if (!trimmedYesText && !trimmedNoText) {
      setYesNoError(
        "Add text for at least one answer, or cancel if you do not want to insert this prompt."
      );
      return;
    }

    const insertText = `${trimmedYesText ? `<<${id}=yes:${trimmedYesText}>>` : ""}${
      trimmedNoText ? `<<${id}=no:${trimmedNoText}>>` : ""
    }`;
    insertPrompt(insertText);
    setYesNoError("");
    setOpenModal(false);
  };

  const handleTargetSelect = (value) => {
    handleChange("target", value);
    if (value === "custom") {
      setCustomTargetModalOpen(true);
    }
  };

  const handleChannelSelect = (value) => {
    setCampaign((current) => ({
      ...current,
      channel: value,
      target: value === "phone" ? "custom" : current.target,
    }));
    if (value === "phone") {
      setCustomTargetModalOpen(true);
    }
  };

  const handleInsertLink = () => {
    const trimmedUrl = linkURL.trim();
    const trimmedText = linkText.trim();

    if (!isHttpUrl(trimmedUrl)) {
      setLinkError("Enter a full URL starting with http:// or https://.");
      return;
    }
    if (!trimmedText) {
      setLinkError("Enter link text.");
      return;
    }

    if (editingFaqIndex !== null) {
      const updated = [...campaign.accordion];
      const htmlLink = `<a href="${trimmedUrl}" target="_blank" rel="noopener noreferrer">${trimmedText}</a>`;
      updated[editingFaqIndex].a += ` ${htmlLink}`;
      setCampaign({ ...campaign, accordion: updated });
    }
    setLinkURL("");
    setLinkText("");
    setLinkError("");
    setLinkModalOpen(false);
    setEditingFaqIndex(null);
  };

  const [simpleMode, setSimpleMode] = useState(false);
  useEffect(() => {
    if (simpleMode) setSteps(["Overview", "Template Message"]);

    if (!simpleMode) setSteps(["Overview", "Prompts", "Template Message"]);
  }, [simpleMode]);

  //Subject Line logic
  const collapseIfSingle = (arr) => (arr.length === 1 ? arr[0] : arr);

  const subjects = Array.isArray(campaign.subject)
    ? campaign.subject
    : [campaign.subject || ""];

  const updateSubjectAt = (index, value) => {
    const next = [...subjects];
    next[index] = value;
    // If all are empty, keep a single empty field
    const trimmed = next.filter((s, i) => s !== "" || i === 0);
    handleChange("subject", collapseIfSingle(trimmed));
  };

  const addSubject = () => {
    const next = [...subjects, ""];
    handleChange("subject", next); // keep as array while multiple
  };

  const removeSubjectAt = (index) => {
    const next = subjects.filter((_, i) => i !== index);
    handleChange("subject", next.length ? collapseIfSingle(next) : "");
  };

  const safeCampaignId = slugifyCampaignId(campaign.id);
  const campaignIdTaken =
    campaigns
      .map((camp) => slugifyCampaignId(camp?.campaign?.id || camp?.campaignId))
      .includes(safeCampaignId) &&
    safeCampaignId !== slugifyCampaignId(edittingCampaignId);

  return (
    <Box sx={createShellSx}>
      <Stepper
        activeStep={activeStep}
        sx={{ ...StepperStyle, backgroundColor: "transparent" }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item lg={4} xs={12}>
            <Box sx={sidePanelSx}>
              <Typography component="h2" sx={panelTitleSx}>
                New campaign template
              </Typography>
              <Typography sx={panelCopySx}>
                Use{" "}
                <a
                  href="https://docs.google.com/document/d/1RvbPVU6kMyCWN8CGTSOV0vBWCzuBf9G-KEuXgShPaH0/edit?tab=t.0"
                  target="_blank"
                  rel="noreferrer"
                >
                  this doc
                </a>{" "}
                to help get started with your campaign. By drafting your
                campaign in there, it will be easier to get input and
                suggestions, and to make sure you have done everything right
                (and don't end up with any legal risks!).
              </Typography>
            </Box>

            <Box sx={{ ...sidePanelSx, mt: 2 }}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography component="h2" sx={panelTitleSx}>
                    Simple mode
                  </Typography>
                  <Typography sx={panelCopySx}>
                    {simpleMode ? "On" : "Off"}
                  </Typography>
                </Box>
                <Switch
                  checked={simpleMode}
                  onChange={(event) => setSimpleMode(event.target.checked)}
                  color="success"
                  inputProps={{ "aria-label": "Toggle simple mode" }}
                />
              </Box>
              <Typography sx={{ ...panelCopySx, mt: 1 }}>
                In simple mode, all optional steps are removed - use this for a
                quick and easy set-up, with no message personalisation.
              </Typography>
            </Box>
          </Grid>

          <Grid item lg={8} xs={12}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Campaign ID"
                  helperText={`This will form the URL of your campaign. Use lowercase letters, numbers, hyphens and underscores.`}
                  value={campaign.id}
                  onChange={(e) =>
                    handleChange("id", slugifyCampaignId(e.target.value))
                  }
                  sx={TextFieldStyle}
                />

                {edittingCampaign && edittingCampaignId !== campaign.id && (
                  <p
                    style={{
                      margin: "-6px 0 8px 0",
                      color: "red",
                      fontSize: "small",
                    }}
                  >
                    Caution: changing your campaign ID from{" "}
                    <u>{edittingCampaignId}</u> this will change the URL of your
                    campaign
                  </p>
                )}

                {campaignIdTaken && (
                    <p
                      style={{
                        margin: "-6px 0 8px 0",
                        color: "red",
                        fontSize: "small",
                      }}
                    >
                      This campaign ID is already taken.
                    </p>
                  )}

                <TextField
                  fullWidth
                  label="Host"
                  helperText="This can be just 'Living Rent', but if the campaign is being run by a specific branch, say so."
                  value={campaign.host}
                  onChange={(e) => handleChange("host", e.target.value)}
                  sx={TextFieldStyle}
                />

                {!simpleMode && (
                  <TextField
                    fullWidth
                    label="BCC"
                    helperText="Users will have the opportunity to BCC (blind copy) an email into their message to targets, so you can keep track of the messages sent. This should only ever be an @livingrent.org email address - not someone's personal one, and not an external one!"
                    value={campaign.bcc}
                    onChange={(e) => handleChange("bcc", e.target.value)}
                    sx={TextFieldStyle}
                  />
                )}
                <TextField
                  fullWidth
                  label="Campaign Title"
                  helperText="This will be the headline on your campaign page - it should include a call to action, not just something descriptive."
                  value={campaign.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  sx={TextFieldStyle}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Blurb"
                  helperText="What's the elevator pitch for your campaign? Sum up why it's important in no more than a couple sentences."
                  value={campaign.blurb}
                  onChange={(e) => handleChange("blurb", e.target.value)}
                  sx={TextFieldStyle}
                />

                {!simpleMode && (
                  <TextField
                    fullWidth
                    label="Link"
                    helperText="Put a link to more information about the campaign, or even just your branch's social media page."
                    value={campaign.link}
                    onChange={(e) => handleChange("link", e.target.value)}
                    sx={TextFieldStyle}
                  />
                )}

                <FormControl
                  fullWidth
                  variant="outlined" // ← make it outlined
                  sx={TextFieldStyle}
                >
                  <InputLabel id="channel-label">Channel</InputLabel>
                  <Select
                    labelId="channel-label" // ← must match the InputLabel id
                    id="channel-select"
                    label="Channel"
                    value={campaign.channel}
                    onChange={(e) => handleChannelSelect(e.target.value)} // ← update channel
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="twitter">Twitter/X</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                  </Select>
                  {campaign.channel == "phone" && (
                    <span style={{ marginTop: "4px" }}>
                      <em>
                        Phone campaigns are an experimental feature that are
                        currently only compatible with custom targetting - we
                        will add numbers for MSPs soon.
                      </em>
                    </span>
                  )}
                  <FormHelperText>
                    Choose whether you are asking members to send emails,
                    tweets, or phone calls.
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth sx={TextFieldStyle}>
                  <InputLabel id="target-label">Target</InputLabel>
                  <Select
                    labelId="target-label"
                    label="Target"
                    value={campaign.target}
                    onChange={(e) => handleTargetSelect(e.target.value)}
                  >
                    {TargetingOptions.map((target) => (
                      <MenuItem
                        key={target.value}
                        value={target.value}
                        disabled={
                          campaign.channel === "phone" &&
                          target.value !== "custom"
                        }
                      >
                        <b>{target.name}</b>: {target.description}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Choose the target of your campaign. If you need something
                    more complicated or an option that isn't here already, get
                    in touch and we can add it.
                  </FormHelperText>
                </FormControl>
                {campaign.target === "custom" && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Custom targets:{" "}
                      {customTargets
                        .map((t) => t.name)
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    <Button
                      sx={BtnStyleSmall}
                      variant="outlined"
                      onClick={() => setCustomTargetModalOpen(true)}
                    >
                      Edit Custom Targets
                    </Button>
                  </Box>
                )}

                {!simpleMode && (
                  <Box sx={{ ...sectionPanelSx, mt: 2 }}>
                    <Box
                      sx={{
                        alignItems: "flex-start",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography component="h3" sx={panelTitleSx}>
                          FAQs
                        </Typography>
                        <Typography sx={panelCopySx}>
                          Optional context for complicated, niche or surprising
                          targets.
                        </Typography>
                      </Box>
                      <Button
                        sx={BtnStyleSmall}
                        variant="outlined"
                        onClick={() =>
                          setCampaign({
                            ...campaign,
                            accordion: [
                              ...campaign.accordion,
                              { q: "", a: "" },
                            ],
                          })
                        }
                      >
                        Add FAQ
                      </Button>
                    </Box>
                    {campaign.accordion.length === 0 && (
                      <Typography sx={panelCopySx}>
                        No FAQs added yet.
                      </Typography>
                    )}
                    {campaign.accordion.map((faq, index) => (
                      <Box key={index} sx={{ ...nestedPanelSx, mb: 1.5 }}>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: 800 }}>
                            FAQ {index + 1}
                          </Typography>
                          <IconButton
                            aria-label={`Remove FAQ ${index + 1}`}
                            onClick={() => handleRemoveFAQ(index)}
                            size="small"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                        <TextField
                          sx={TextFieldStyle}
                          fullWidth
                          label={`Question ${index + 1}`}
                          value={faq.q}
                          onChange={(e) =>
                            handleFAQChange(index, "q", e.target.value)
                          }
                        />
                        <TextField
                          fullWidth
                          sx={TextFieldStyle}
                          multiline
                          rows={4}
                          label={`Answer ${index + 1}`}
                          value={faq.a}
                          onChange={(e) =>
                            handleFAQChange(index, "a", e.target.value)
                          }
                        />
                        <Button
                          sx={{ ...BtnStyleSmall, padding: "3px 7px 2px" }}
                          variant="text"
	                          size="small"
	                          onClick={() => {
	                            setEditingFaqIndex(index);
	                            setLinkError("");
	                            setLinkModalOpen(true);
	                          }}
                        >
                          Add Link
                        </Button>
                      </Box>
                    ))}

                    <Dialog
                      open={linkModalOpen}
	                      onClose={() => {
	                        setLinkError("");
	                        setLinkModalOpen(false);
	                      }}
                    >
                      <DialogTitle>
                        <h3 style={{ margin: "0" }}>Add Link</h3>
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          sx={TextFieldStyle}
                          autoFocus
                          margin="dense"
                          label="Link URL"
                          fullWidth
                          variant="standard"
                          value={linkURL}
                          onChange={(e) => setLinkURL(e.target.value)}
                        />
                        <TextField
                          sx={TextFieldStyle}
                          margin="dense"
                          label="Link Text"
                          fullWidth
                          variant="standard"
	                          value={linkText}
	                          onChange={(e) => setLinkText(e.target.value)}
	                        />
	                        {linkError && (
	                          <Alert severity="error" sx={{ mt: 1 }}>
	                            {linkError}
	                          </Alert>
	                        )}
	                      </DialogContent>
	                      <DialogActions>
	                        <Button
	                          sx={BtnStyleSmall}
	                          onClick={() => {
	                            setLinkError("");
	                            setLinkModalOpen(false);
	                          }}
	                        >
                          Cancel
                        </Button>
                        <Button sx={BtnStyleSmall} onClick={handleInsertLink}>
                          Insert
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                )}
              </Box>
            )}

            {!simpleMode && activeStep === 1 && (
              <Box>
                <Box sx={sectionPanelSx}>
                  <Box
                    sx={{
                      alignItems: "flex-start",
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography component="h2" sx={panelTitleSx}>
                        Personalisation prompts
                      </Typography>
                      <Typography sx={panelCopySx}>
                        Ask members for details you can insert into the message.
                        Keep questions short and use clear prompt IDs.
                      </Typography>
                    </Box>
                    <Button
                      sx={BtnStyleSmall}
                      variant="outlined"
                      onClick={() =>
                        setCampaign({
                          ...campaign,
                          prompts: [
                            ...campaign.prompts,
                            {
                              id: "",
                              question: "",
                              answerType: "text",
                              required: false,
                            },
                          ],
                        })
                      }
                    >
                      Add Prompt
                    </Button>
                  </Box>

                  {campaign.channel == "phone" && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Phone campaigns usually do not need prompts.
                    </Alert>
                  )}

                  {campaign.prompts.length === 0 ? (
                    <Box sx={nestedPanelSx}>
                      <Typography sx={panelCopySx}>
                        No prompts yet. Add one if the message should include a
                        member's personal answer.
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {campaign.prompts.map((prompt, index) => (
                        <Box key={index} sx={nestedPanelSx}>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1.25,
                            }}
                          >
                            <Typography sx={{ fontWeight: 800 }}>
                              Prompt {index + 1}
                            </Typography>
                            <IconButton
                              aria-label={`Remove prompt ${index + 1}`}
                              onClick={() => handleRemovePrompt(index)}
                              size="small"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Box>

                          <Grid container spacing={1.5}>
                            <Grid item xs={12} md={4}>
                              <TextField
                                helperText="Used inside the template"
                                fullWidth
                                label="Prompt ID"
                                value={prompt.id || ""}
                                onChange={(e) =>
                                  handlePromptChange(
                                    index,
                                    "id",
                                    slugifyCampaignId(e.target.value)
                                  )
                                }
                                sx={TextFieldStyle}
                              />
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                fullWidth
                                label="Question members see"
                                value={prompt.question || ""}
                                onChange={(e) =>
                                  handlePromptChange(
                                    index,
                                    "question",
                                    e.target.value
                                  )
                                }
                                sx={TextFieldStyle}
                              />
                            </Grid>
                          </Grid>

                          <Box
                            sx={{
                              alignItems: { xs: "flex-start", sm: "center" },
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontSize: "0.88rem", fontWeight: 800 }}>
                                Answer type
                              </Typography>
                              <RadioGroup
                                sx={RadioGroupStyle}
                                row
                                value={prompt.answerType || "text"}
                                onChange={(e) =>
                                  handlePromptChange(
                                    index,
                                    "answerType",
                                    e.target.value
                                  )
                                }
                              >
                                <FormControlLabel
                                  value="text"
                                  control={<Radio />}
                                  label="Short text"
                                />
                                <FormControlLabel
                                  value="text-multiline"
                                  control={<Radio />}
                                  label="Long text"
                                />
                                <FormControlLabel
                                  value="yesno"
                                  control={<Radio />}
                                  label="Yes/no"
                                />
                              </RadioGroup>
                            </Box>

                            <FormControlLabel
                              control={
                                <Checkbox
                                  sx={CheckBoxStyle}
                                  checked={prompt.required || false}
                                  onChange={(e) =>
                                    handlePromptChange(
                                      index,
                                      "required",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Required"
                            />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            )}

            {(activeStep === 2 || (simpleMode && activeStep === 1)) && (
              <Box>
                {campaign.channel !== "phone" && (
                  <p>
                    Here is where you write your template message. If you
                    created prompts, you can insert them into the template to
                    give the message a more personalised feel.
                    <br />
                    <br />
                    Note that if your message doesn't start with "Dear" (such as
                    "Dear MSPs,"), then the tool will insert the names of all
                    recipients into the start of the template.
                    <br />
                    <br />
                    For campaigns where the target is filtered based on the
                    user's postcode (such as for MSPs), the tool will add the
                    user's postcode to the end of the message so the recipient
                    knows they are a constituent.
                  </p>
                )}
                {campaign.channel == "phone" && (
                  <center>
                    <p>
                      <em>
                        For phone campaigns, instead of a template message,
                        suggest key talking points for the call.
                      </em>
                    </p>
                  </center>
                )}

                {campaign.channel === "email" && (
                  <Box
                    sx={{
                      backgroundColor: "rgba(9, 124, 53, 0.025)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 1,
                      mb: 2,
                      p: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: { xs: "flex-start", sm: "center" },
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          component="h3"
                          sx={{
                            color: "var(--text-color)",
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            lineHeight: 1.2,
                          }}
                        >
                          Subject lines
                        </Typography>
                        <Typography
                          sx={{
                            color: "var(--muted-text)",
                            fontSize: "0.84rem",
                            lineHeight: 1.35,
                            mt: 0.25,
                          }}
                        >
                          Add more than one if you want the tool to rotate them.
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{
                          ...BtnStyleSmall,
                          fontSize: "0.85rem",
                          minHeight: 32,
                          px: 1,
                          py: 0.25,
                          whiteSpace: "nowrap",
                        }}
                        onClick={addSubject}
                      >
                        Add another
                      </Button>
                    </Box>

                    <Stack spacing={1}>
                      {subjects.map((value, i) => (
                        <Box
                          key={i}
                          sx={{
                            alignItems: "flex-start",
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            label={`Subject line ${i + 1}`}
                            value={value}
                            onChange={(e) => updateSubjectAt(i, e.target.value)}
                            sx={{
                              ...TextFieldStyle,
                              mb: 0,
                              mt: 0,
                            }}
                          />
                          {subjects.length > 1 && (
                            <IconButton
                              aria-label={`Remove subject line ${i + 1}`}
                              onClick={() => removeSubjectAt(i)}
                              size="small"
                              sx={{ mt: 0.5 }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Template Message"
                  value={campaign.template}
                  onChange={(e) => handleChange("template", e.target.value)}
                  sx={TextFieldStyle}
                />

                {campaign.prompts.length > 0 && (
                  <>
                    {campaign.prompts.some(
                      (prompt) => !promptIsUsedInTemplate(prompt, campaign.template)
                    ) && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Some prompts are not used in the template yet:{" "}
                        {campaign.prompts
                          .filter(
                            (prompt) =>
                              !promptIsUsedInTemplate(prompt, campaign.template)
                          )
                          .map((prompt) => prompt.id || "(missing ID)")
                          .join(", ")}
                      </Alert>
                    )}
                    <h4 style={{ margin: "0" }}>Insert Prompts: </h4>
                    <Box sx={{ display: "flex", marginTop: "5px" }}>
                      {campaign.prompts.map((prompt, index) => (
                        <Box key={index} sx={{ margin: "0 3px" }}>
                          {prompt.answerType === "yesno" ? (
                            <Button
                              sx={{ ...BtnStyleSmall, padding: "3px 0 0 0" }}
                              onClick={() => openYesNoModal(prompt)}
                            >
                              {prompt.id}
                            </Button>
                          ) : (
                            <Button
                              sx={{ ...BtnStyleSmall, padding: "3px 0 0 0" }}
                              onClick={() => insertPrompt(`<<${prompt.id}>>`)}
                            >
                              {prompt.id}
                            </Button>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            )}

            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              {validationErrors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                  <strong>Fix these before publishing:</strong>
                  <ul style={{ margin: "8px 0 0 18px", padding: 0 }}>
                    {validationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Box>

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              {activeStep !== 0 ? (
                <Button
                  sx={{ ...BtnStyle, margin: "0 5px" }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Box>
                {activeStep === steps.length - 1 && (
                  <Button
                    sx={{ ...BtnStyle, margin: "0 5px" }}
                    variant="outlined"
                    onClick={() => setPreviewOpen(true)}
                  >
                    Preview
                  </Button>
                )}
                <Button
                  sx={{ ...BtnStyle, margin: "0 5px" }}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Publish" : "Next"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={openModal}
          onClose={() => {
            setYesNoError("");
            setOpenModal(false);
          }}
        >
          <h2 style={{ margin: "20px 0px 20px 20px" }}>
            Insert Yes/No Prompt Text
          </h2>

          <p style={{ margin: "0 20px" }}>
            For yes/no prompts, you can show text in the template message
            conditionally, based on the user's answer. For example: if a user
            answers 'yes' to the question "Are you a current or former tenant of
            DJ Alexander?", it could show "As a tenant who's experienced your
            dodgy practices firsthand..."
            <br />
            <br />
            You do <b>not</b> need to give text for both conditions - it could
            only show if they say 'yes', for example.
            <br />
            <br />
            <b>Question:</b> {currentPrompt?.question}
          </p>
          <DialogContent sx={{ paddingBottom: "0" }}>
            <TextField
              fullWidth
              helperText={
                <>
                  Say what should appear in the template message if the user
                  answers <em>yes</em> to this prompt.
                </>
              }
              label="Yes Text"
              value={yesText}
              onChange={(e) => {
                setYesText(e.target.value);
                setYesNoError("");
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey || e.key === "Enter") && !e.shiftKey) {
                  e.preventDefault();
                  handleInsertYesNo();
                }
              }}
              sx={TextFieldStyle}
            />
            <TextField
              helperText={
                <>
                  Say what should appear in the template message if the user
                  answers <em>no</em> to this prompt.
                </>
              }
              fullWidth
              label="No Text"
              value={noText}
              onChange={(e) => {
                setNoText(e.target.value);
                setYesNoError("");
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey || e.key === "Enter") && !e.shiftKey) {
                  e.preventDefault();
                  handleInsertYesNo();
                }
              }}
              sx={TextFieldStyle}
            />
            {yesNoError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {yesNoError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0 20px",
            }}
          >
            <Button
              sx={BtnStyleSmall}
              onClick={() => {
                setYesNoError("");
                setOpenModal(false);
              }}
            >
              Cancel
            </Button>
            <Button sx={BtnStyleSmall} onClick={handleInsertYesNo}>
              Insert
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={customTargetModalOpen}
          onClose={() => setCustomTargetModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Custom Targets</DialogTitle>
          <DialogContent>
            {customTargets.map((target, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={target.name || ""}
                  onChange={(e) =>
                    handleCustomTargetChange(index, "name", e.target.value)
                  }
                  sx={TextFieldStyle}
                />
                {campaign.channel == "email" && (
                  <TextField
                    fullWidth
                    label="Email"
                    value={target.email || ""}
                    onChange={(e) =>
                      handleCustomTargetChange(index, "email", e.target.value)
                    }
                    sx={TextFieldStyle}
                  />
                )}
                {campaign.channel == "twitter" && (
                  <TextField
                    fullWidth
                    label="Twitter handle"
                    value={target.handle || ""}
                    onChange={(e) =>
                      handleCustomTargetChange(index, "handle", e.target.value)
                    }
                    sx={TextFieldStyle}
                  />
                )}
                {campaign.channel == "phone" && (
                  <TextField
                    fullWidth
                    label="Phone number"
                    value={target.phone || ""}
                    onChange={(e) =>
                      handleCustomTargetChange(index, "phone", e.target.value)
                    }
                    sx={TextFieldStyle}
                  />
                )}
              </Box>
            ))}
            <Button
              sx={BtnStyle}
              onClick={() => {
                const updated = [...customTargets, { name: "", email: "" }];
                setCustomTargets(updated);
                setCampaign({ ...campaign, customTarget: updated });
              }}
            >
              Add Target
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              sx={BtnStyle}
              onClick={() => setCustomTargetModalOpen(false)}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>

        <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
          <Box
            sx={{
              p: 4,
              maxHeight: "90vh",
              overflow: "auto",
              bgcolor: "darkgrey",
              margin: "5vh auto",
              width: "90%",
              borderRadius: "10px",
              border: "1px solid black",
            }}
          >
            <h1 style={{ marginTop: "0" }}>Preview:</h1>
            <CampaignTopLevel testCampaign={campaign} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
