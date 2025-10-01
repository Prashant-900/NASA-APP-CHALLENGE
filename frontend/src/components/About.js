import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProfileCard from '../profilecard/profilecard\'.js';

const teamMembers = [
  {
    name: 'Dr. Sarah Chen',
    title: 'Astrophysicist',
    handle: 'sarahchen',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  },
  {
    name: 'Prof. Michael Torres',
    title: 'Data Scientist',
    handle: 'mtorres',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  },
  {
    name: 'Dr. Emily Rodriguez',
    title: 'Machine Learning Engineer',
    handle: 'emilyml',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  },
  {
    name: 'Dr. James Wilson',
    title: 'Space Systems Engineer',
    handle: 'jwilson',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  },
  {
    name: 'Dr. Lisa Park',
    title: 'Computational Physicist',
    handle: 'lisapark',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  },
  {
    name: 'Dr. Alex Kumar',
    title: 'Research Scientist',
    handle: 'alexkumar',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    contactText: 'Contact'
  }
];

function About() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/src/design/main.js';
    script.async = true;
    document.body.appendChild(script);

    const canvas = document.createElement('canvas');
    canvas.id = 'c';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none;';
    document.body.appendChild(canvas);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto', backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4, textAlign: 'center' }}>
        Meet Our Team
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
        Our dedicated team of scientists, engineers, and researchers working together to advance exoplanet detection and analysis.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ProfileCard
              name={member.name}
              title={member.title}
              handle={member.handle}
              status={member.status}
              avatarUrl={member.avatarUrl}
              contactText={member.contactText}
              onContactClick={() => console.log(`Contact ${member.name}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default About;