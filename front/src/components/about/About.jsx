import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NewProfileCards from "../profilecard/NewProfileCards.jsx";
import StarfieldBackground from "../common/StarfieldBackground.jsx";
const About = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <StarfieldBackground />
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src="/logo.png" alt="Logo" style={{ height: '100px', width: '110px', marginBottom: '16px', display: 'block', margin: '0 auto 16px auto' }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Our Team
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          Space Marshals
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <NewProfileCards />
      </Box>
    </Container>
    </Box>
  );
};

export default About;
