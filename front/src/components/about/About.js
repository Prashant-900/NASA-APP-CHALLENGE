import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RollingGallery from "../profilecard/profilecard.js";
import StarfieldBackground from "../common/StarfieldBackground.js";
const About = () => {
  const theme = useTheme();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <StarfieldBackground />
      </Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          About Exoplanet Detection
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          Exploring the cosmos through advanced data analysis and machine learning
        </Typography>
      </Box>
      
      <Paper elevation={0} sx={{ p: 4, mb: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          This dashboard provides cutting-edge tools for analyzing exoplanet data from NASA's Kepler and K2 missions. 
          Using advanced machine learning algorithms, we help researchers identify potential exoplanets and analyze their characteristics.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          Our platform combines data visualization, predictive modeling, and interactive exploration to make exoplanet 
          research more accessible and efficient for scientists and enthusiasts alike.
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', textAlign: 'center', mb: 3 }}>
          Explore the Universe
        </Typography>
        <RollingGallery autoplay={true} pauseOnHover={true} />
      </Box>
      
      <Paper elevation={0} sx={{ p: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
          Key Features
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>Data Explorer</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Interactive tables with advanced filtering and search capabilities for Kepler and K2 datasets.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>AI Predictions</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Upload your own data and get AI-powered predictions for exoplanet detection.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>Smart Chat</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ask questions about the data and get intelligent responses with relevant visualizations.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>3D Visualization</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Explore detailed 3D models and information about discovered exoplanets.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
