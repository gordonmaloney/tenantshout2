import React, { useState, useEffect } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack
} from '@mui/material';
import CampaignTopLevel from '../Campaign/CampaignTopLevel'; // Make sure this component exists
import { CAMPAIGN_POST_ENDPOINT, ENDPOINT } from '../../Endpoints';
import { TargetingOptions } from '../../TARGETING/TargetingOptions';
import { useCampaigns } from '../../CampaignContext';

const steps = ['Overview', 'Prompts', 'Template Message'];

export default function CampaignSetupForm({edittingCampaign}) {

      const { campaigns, loading, fetchCampaigns } = useCampaigns();
  

  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [customTargetModalOpen, setCustomTargetModalOpen] = useState(false);
  const [customTargets, setCustomTargets] = useState([{name:'', email: ''}]);
  const [campaign, setCampaign] = useState({
    id: '',
    host: '',
    channel: 'email',
    title: '',
    blurb: '',
    link: '',
    target: '',
    customTargetting: "",
    bcc: '',
    accordion: [],
    prompts: [],
    template: '',
    customTarget: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [yesText, setYesText] = useState('');
  const [noText, setNoText] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkURL, setLinkURL] = useState('');
  const [linkText, setLinkText] = useState('');
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);

  useEffect(() => {
    if (edittingCampaign) {
    setCampaign(edittingCampaign)
    }
  }, [edittingCampaign])


  const token = localStorage.getItem('token');


  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const payload = {
          campaignId: campaign.id,
          campaign: { ...campaign },
        };
  
        if (!edittingCampaign) { 
        const response = await fetch(ENDPOINT + 'campaigns/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error('Failed to post campaign');
        }
      } else if (edittingCampaign) {
        const response = await fetch(ENDPOINT + 'campaigns/' + `${campaign.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error('Failed to post campaign');
        } else {
          fetchCampaigns();
        }
        }
  
   
  
        alert('Campaign successfully submitted!');
      } catch (error) {
        console.error('Submission error:', error);
        alert('There was an error submitting the campaign.');
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
    setYesText('');
    setNoText('');
    setOpenModal(true);
  };

  const handleInsertYesNo = () => {
    const id = currentPrompt.id;
    const insertText = `<<${id}=yes:${yesText}>> <<${id}=no:${noText}>>`;
    insertPrompt(insertText);
    setOpenModal(false);
  };

  const handleTargetSelect = (value) => {
    handleChange('target', value);
    if (value === 'custom') {
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
    setLinkURL('');
    setLinkText('');
    setLinkModalOpen(false);
    setEditingFaqIndex(null);
  };


  console.log(campaign)

  return (
    <Box sx={{ width: '90%', margin: '20px auto', p: 4, bgcolor: 'white' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Box>
            <TextField fullWidth label="Campaign ID" value={campaign.id} onChange={(e) => handleChange('id', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Host" value={campaign.host} onChange={(e) => handleChange('host', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="BCC" value={campaign.bcc} onChange={(e) => handleChange('bcc', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Campaign Title" value={campaign.title} onChange={(e) => handleChange('title', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth multiline rows={4} label="Blurb" value={campaign.blurb} onChange={(e) => handleChange('blurb', e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Link" value={campaign.link} onChange={(e) => handleChange('link', e.target.value)} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{mb:2}}>
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
</FormControl>
            {campaign.target === 'custom' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Custom targets: {customTargets.map(t => t.name).filter(Boolean).join(', ')}</Typography>
                <Button variant="outlined" onClick={() => setCustomTargetModalOpen(true)}>Edit Custom Targets</Button>
              </Box>
            )}

<Box>
      <Typography variant="h6">FAQs (Optional)</Typography>
      {campaign.accordion.map((faq, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <TextField fullWidth label="FAQ Question" value={faq.q} onChange={(e) => handleFAQChange(index, 'q', e.target.value)} sx={{ mb: 1 }} />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="FAQ Answer"
            value={faq.a}
            onChange={(e) => handleFAQChange(index, 'a', e.target.value)}
          />
          <Button variant="text" size="small" onClick={() => { setEditingFaqIndex(index); setLinkModalOpen(true); }}>Add Link</Button>
        </Box>
      ))}
      <Button variant="outlined" onClick={() => setCampaign({ ...campaign, accordion: [...campaign.accordion, { q: '', a: '' }] })}>
        Add FAQ
      </Button>

      <Dialog open={linkModalOpen} onClose={() => setLinkModalOpen(false)}>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Link URL" fullWidth variant="standard" value={linkURL} onChange={(e) => setLinkURL(e.target.value)} />
          <TextField margin="dense" label="Link Text" fullWidth variant="standard" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          <Button onClick={handleInsertLink}>Insert</Button>
        </DialogActions>
      </Dialog>
    </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            {campaign.prompts.map((prompt, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField fullWidth label="Prompt ID" value={prompt.id || ''} onChange={(e) => handlePromptChange(index, 'id', e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth label="Question" value={prompt.question || ''} onChange={(e) => handlePromptChange(index, 'question', e.target.value)} sx={{ mb: 1 }} />
                <RadioGroup
                  row
                  value={prompt.answerType || 'text'}
                  onChange={(e) => handlePromptChange(index, 'answerType', e.target.value)}
                >
                  <FormControlLabel value="text" control={<Radio />} label="Text" />
                  <FormControlLabel value="yesno" control={<Radio />} label="Yes/No" />
                </RadioGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prompt.required || false}
                      onChange={(e) => handlePromptChange(index, 'required', e.target.checked)}
                    />
                  }
                  label="Required"
                />
              </Box>
            ))}
            <Button variant="outlined" onClick={() => setCampaign({ ...campaign, prompts: [...campaign.prompts, { id: '', question: '', answerType: 'text', required: false }] })}>
              Add Prompt
            </Button>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Template Message"
              value={campaign.template}
              onChange={(e) => handleChange('template', e.target.value)}
              sx={{ mb: 2 }}
            />

            {campaign.prompts.length > 0 && <>
            <Typography variant="h6">Insert Prompts</Typography>
            {campaign.prompts.map((prompt, index) => (
              <Box key={index}>
                {prompt.answerType === 'yesno' ? (
                  <Button onClick={() => openYesNoModal(prompt)}>{prompt.id}</Button>
                ) : (
                  <Button onClick={() => insertPrompt(`<<${prompt.id}>>`)}>{prompt.id}</Button>
                )}
              </Box>
            ))}</>}
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          <Box>
            {activeStep === steps.length - 1 && (
              <Button sx={{ mr: 2 }} variant="outlined" onClick={() => setPreviewOpen(true)}>Preview</Button>
            )}
            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
          </Box>
        </Box>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Insert Yes/No Prompt Text</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Yes Text" value={yesText} onChange={(e) => setYesText(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="No Text" value={noText} onChange={(e) => setNoText(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button onClick={handleInsertYesNo}>Insert</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={customTargetModalOpen} onClose={() => setCustomTargetModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Custom Targets</DialogTitle>
          <DialogContent>
            {customTargets.map((target, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={target.name || ''}
                  onChange={(e) => handleCustomTargetChange(index, 'name', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={target.email || ''}
                  onChange={(e) => handleCustomTargetChange(index, 'email', e.target.value)}
                />
              </Box>
            ))}
            <Button onClick={() => {
              const updated = [...customTargets, { name: '', email: '' }];
              setCustomTargets(updated);
              setCampaign({ ...campaign, customTarget: updated });
            }}>Add Target</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCustomTargetModalOpen(false)}>Done</Button>
          </DialogActions>
        </Dialog>

        <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
          <Box sx={{ p: 4, maxHeight: '90vh', overflow: 'auto', bgcolor: 'white', margin: '5vh auto', width: '90%' }}>
            <CampaignTopLevel testCampaign={campaign} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}