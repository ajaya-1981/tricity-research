import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
} from "@mui/material";

const steps = [
  {
    label: "Select Device",
    name: "device",
    options: ["Pacemaker", "Stent", "Cochlear Implant"],
  },
  {
    label: "Brand Model",
    name: "brand",
    options: ["Brand A", "Brand B", "Brand C"],
  },
  {
    label: "Model Number",
    name: "modelNumber",
    options: ["123X", "456Y", "789Z"],
  },
  {
    label: "MRI Compatibility",
    name: "compatibility",
    options: ["Safe", "Conditional", "Not Safe"],
  },
];

const CheckMriPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const currentStep = steps[activeStep];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        align="center"
        fontWeight="bold"
        color="primary"
        mb={4}
      >
        Streamlining Safety, Simplifying MRI Compatibility
      </Typography>

      {isMobile ? (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid item xs={12} key={step.name}>
                <FormControl fullWidth size="medium">
                  <InputLabel>{step.label}</InputLabel>
                  <Select
                    value={formValues[step.name] || ""}
                    label={step.label}
                    onChange={(e) => handleChange(step.name, e.target.value)}
                  >
                    {step.options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 1.2, mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.name}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={5}>
            <FormControl fullWidth>
              <InputLabel>{currentStep.label}</InputLabel>
              <Select
                value={formValues[currentStep.name] || ""}
                label={currentStep.label}
                onChange={(e) => handleChange(currentStep.name, e.target.value)}
              >
                {currentStep.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              display="flex"
              justifyContent="space-between"
              mt={4}
              flexWrap="wrap"
              gap={2}
            >
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CheckMriPage;
