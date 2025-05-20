import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const HelpPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">
          Help & Documentation
        </Typography>
        <Typography variant="body1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vitae eros eget tellus tristique bibendum. Donec rutrum sed sem quis
          venenatis. Proin viverra risus a eros volutpat tempor. In quis arcu et
          eros porta lobortis sit amet at magna. Praesent sit amet diam
          ultrices, facilisis elit nec, ullamcorper magna.
        </Typography>
        <Typography variant="body1" paragraph>
          Nullam a nibh nec nulla cursus placerat. Morbi sollicitudin felis in
          sem aliquet, et ultricies leo convallis. Integer mollis sapien a
          mauris ullamcorper, a cursus tortor condimentum. Duis vehicula
          facilisis lectus, at pulvinar lorem feugiat sed.
        </Typography>
        <Typography variant="body1" paragraph>
          Fusce varius, enim eget sodales consequat, enim libero suscipit nunc,
          non malesuada arcu mauris at lorem. Curabitur id libero dictum,
          laoreet urna at, egestas lacus. Sed sed luctus elit, at posuere urna.
          Phasellus id ligula id purus dignissim lacinia.
        </Typography>
      </Paper>
    </Container>
  );
};

export default HelpPage;
