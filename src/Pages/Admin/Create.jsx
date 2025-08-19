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
  Modal,
  Grid,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
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
  const [campaign, setCampaign] = useState({
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
  });
  const [openModal, setOpenModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [yesText, setYesText] = useState("");
  const [noText, setNoText] = useState("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);

  const [edittingCampaignId, setEdittingCampaignId] = useState("");

  useEffect(() => {
    if (edittingCampaign) {
      setEdittingCampaignId(edittingCampaign.id);
      setCampaign(edittingCampaign);
    }
  }, [edittingCampaign]);

  console.log(campaign);

  const token = localStorage.getItem("token");

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const payload = {
          campaignId: campaign.id,


          campaign: { ...campaign },
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
            }
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
        navigate(`../act/${campaign.id}`);
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

  const handleFAQChange = (index, field, value) => {
    const updated = [...campaign.accordion];
    updated[index][field] = value;
    setCampaign({ ...campaign, accordion: updated });
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
    setOpenModal(true);
  };

  const handleInsertYesNo = () => {
    const id = currentPrompt.id;
    const insertText = `${yesText !== "" ? `<<${id}=yes:${yesText}>>` : ""}${
      noText !== "" ? `<<${id}=no:${noText}>>` : ""
    }`;
    insertPrompt(insertText);
    setOpenModal(false);
  };

  const handleTargetSelect = (value) => {
    handleChange("target", value);
    if (value === "custom") {
      setCustomTargetModalOpen(true);
    }
  };

  const handleInsertLink = () => {
    if (editingFaqIndex !== null) {
      const updated = [...campaign.accordion];
      const htmlLink = `<a href="${linkURL}" target="_blank">${linkText}</a>`;
      updated[editingFaqIndex].a += ` ${htmlLink}`;
      setCampaign({ ...campaign, accordion: updated });
    }
    setLinkURL("");
    setLinkText("");
    setLinkModalOpen(false);
    setEditingFaqIndex(null);
  };

  const [simpleMode, setSimpleMode] = useState(false);
  useEffect(() => {
    if (simpleMode) setSteps(["Overview", "Template Message"]);

    if (!simpleMode) setSteps(["Overview", "Prompts", "Template Message"]);
  }, [simpleMode]);

  return (
    <Box sx={{ width: "90%", margin: "20px auto", p: 4, bgcolor: "white" }}>
      <Stepper activeStep={activeStep} sx={StepperStyle}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={1}>
          <Grid item lg={4} xs={12}>
            <div>
              <h3 style={{ margin: 0 }}>Simple Mode</h3>
              <p>
                In simple mode, all optional steps are removed - use this for a
                quick and easy set-up, with no message personalisation.
              </p>
              <Button sx={BtnStyle} onClick={() => setSimpleMode(!simpleMode)}>
                Simple Mode {simpleMode ? "off" : "on"}
              </Button>
            </div>
          </Grid>

          <Grid item lg={8} xs={12}>
            {activeStep === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Campaign ID"
                  helperText={`This will form the URL of your campaign - keep it short and snappy! Something like: "renthikeconsultation".`}
                  value={campaign.id}
                  onChange={(e) => handleChange("id", e.target.value)}
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

                {campaigns
                  .map((camp) => camp.campaign.id)
                  .includes(campaign.id) &&
                  campaign.id !== edittingCampaignId && (
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
                    helperText="Users will have the opportunity to BCC (blind copy) an email into their message to targets, so you can keep track of the messages sent. This should generally only be an @livingrent.org email address - not someone's personal one!"
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
                    onChange={(e) => handleChange("channel", e.target.value)} // ← update channel
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
                      <MenuItem key={target.value} value={target.value}>
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
                  <Box>
                    <Typography>
                      <p style={{ margin: "0" }}>
                        <b>FAQs (Optional)</b>: if necessary, you can add some
                        FAQs for your campaign - this might be helpful if it's a
                        complicated or niche topic, or the target is someone
                        unsuspected.
                      </p>
                    </Typography>
                    {campaign.accordion.map((faq, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
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
                        You can add a link to the body of your answer using
                        normal HTML, or using this button:{" "}
                        <Button
                          sx={{ ...BtnStyleSmall, padding: "3px 0 0 0" }}
                          variant="text"
                          size="small"
                          onClick={() => {
                            setEditingFaqIndex(index);
                            setLinkModalOpen(true);
                          }}
                        >
                          Add Link
                        </Button>
                      </Box>
                    ))}
                    <Button
                      sx={BtnStyleSmall}
                      variant="outlined"
                      onClick={() =>
                        setCampaign({
                          ...campaign,
                          accordion: [...campaign.accordion, { q: "", a: "" }],
                        })
                      }
                    >
                      Add FAQ
                    </Button>

                    <Dialog
                      open={linkModalOpen}
                      onClose={() => setLinkModalOpen(false)}
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
                      </DialogContent>
                      <DialogActions>
                        <Button
                          sx={BtnStyleSmall}
                          onClick={() => setLinkModalOpen(false)}
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
                {campaign.channel !== "phone" && (
                  <p>
                    "Prompts" are how users can personalise their messages.
                    After users answer these prompt questions, their answers can
                    be incorporated into the template message. This means
                    striking a powerful balance of a campaign that is quick and
                    easy for members to take part in, but also has a personal,
                    human touch that makes it harder for decision makers to
                    dismiss.
                    <br />
                    <br />
                    Prompts can be either open text, or yes/no questions and
                    then, when you are creating the template message, you can
                    choose how and where to incorporate them into it.
                    <br />
                    <br />
                    Prompts are <b>optional</b>, but you can add as many as you
                    like.
                  </p>
                )}
                {campaign.channel == "phone" && (
                  <center>
                    <p>
                      <em>No need for prompts in phone campaigns</em>
                    </p>
                  </center>
                )}
                {campaign.prompts.map((prompt, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <TextField
                      helperText="Users won't see this - it's just for you to reference in the template"
                      fullWidth
                      label="Prompt ID"
                      value={prompt.id || ""}
                      onChange={(e) =>
                        handlePromptChange(index, "id", e.target.value)
                      }
                      sx={TextFieldStyle}
                    />
                    <TextField
                      helperText=""
                      fullWidth
                      label="Question"
                      value={prompt.question || ""}
                      onChange={(e) =>
                        handlePromptChange(index, "question", e.target.value)
                      }
                      sx={TextFieldStyle}
                    />

                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      Answer type:
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
                          label="Text"
                        />
                        <FormControlLabel
                          value="yesno"
                          control={<Radio />}
                          label="Yes/No"
                        />
                      </RadioGroup>
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
                <TextField
                  fullWidth
                  multiline
                  label="Subject line"
                  value={campaign.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  sx={TextFieldStyle}
                />

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

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
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
              onChange={(e) => setYesText(e.target.value)}
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
              onChange={(e) => setNoText(e.target.value)}
              sx={TextFieldStyle}
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0 20px",
            }}
          >
            <Button sx={BtnStyleSmall} onClick={() => setOpenModal(false)}>
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
