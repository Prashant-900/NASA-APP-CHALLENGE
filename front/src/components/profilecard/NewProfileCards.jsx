import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

const teamMembers = [
  {
    name: 'Kumar Saurav',
    role: 'Web Developer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQFoZwhH1K_ZSQ/profile-displayphoto-shrink_400_400/B56ZRFtlfkHoAg-/0/1736336367077?e=1762387200&v=beta&t=mDLbh3YNPP_OfMlKUZGuH2R67Sfd_a3SHzzBcRXrtpA',
    linkedin: 'https://www.linkedin.com/in/kumar-saurav-417508323/',
    github: 'https://github.com/Saurav10codes',
    twitter: 'https://instagram.com/saurav10101010',
    description: 'Designed the Website and implemented user-friendly interfaces for data visualization.'
  },
  {
    name: 'Nikhil Prakash',
    role: 'Feature Extractor',
    image: 'https://i.ibb.co/1Jr2sbQL/Whats-App-Image-2025-10-04-at-01-40-09-68517d96.jpg',
    linkedin: 'https://www.linkedin.com/in/nikhil-prakash-509869326/',
    github: 'https://github.com/Coding-yeager',
    twitter: 'https://instagram.com/nikhilprakash7684',
    description: 'Specializes in analyzing stellar data and characterizing exoplanetary systems.'
  },
  {
    name: 'Hardik Kushwaha',
    role: 'Data Analyst',
    image: 'https://i.ibb.co/Q7z5LkLT/Whats-App-Image-2025-10-03-at-18-55-40-f183b1a7.jpg',
    linkedin: 'https://www.linkedin.com/in/hardik-kushwah-54705a377/',
    github: 'https://github.com/Hardik-2211',
    twitter: 'https://www.instagram.com/sassy_boy_hunk',
    description: 'Builds robust applications for processing and visualizing astronomical data.'
  },
  {
    name: 'Basil Khan',
    role: 'Model Fine Tuner',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQG-2Nf--z0D9Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723812389366?e=1762387200&v=beta&t=dFbH13nthTHWgfhGIbKXjJt6DtEFqkROyOkKrOu_HZk',
    linkedin: 'https://www.linkedin.com/in/basil-khan-b7714b321/',
    github: 'https://github.com/Basilkhan1718',
    twitter: 'https://www.instagram.com/basilkhan78/',
    description: 'Fine Tunes machine learning models for enhanced exoplanet detection accuracy.'
  },
  {
    name: 'Prashant Suthar',
    role: 'RAG Specialist',
    image: 'https://i.ibb.co/zVmY2Wbc/Whats-App-Image-2025-10-04-at-01-32-53-203a39c0.jpg',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com/Prashant-900',
    twitter: 'https://instagram.com/ehhbefr',
    description: 'Manages data pipelines for RAG systems and infrastructure for large-scale astronomical datasets.'
  },
  {
    name: 'Aryan Garg',
    role: 'Statistics',
    image: 'https://i.ibb.co/8LQChqrF/20250412-172355.jpg',
    linkedin: 'https://www.linkedin.com/in/aryan-garg-jeezzzzzz/',
    github: 'https://github.com/ar-garg',
    twitter: 'https://www.instagram.com/aryan_.garg_',
    description: 'Focuses on statistical analysis of exoplanet detection methods.'
  }
];

const ProfileCard = ({ member }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -10 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
    >
      <Card
        sx={{
          width: 380,
          m: 2.5,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          overflow: 'visible',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'primary.main',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            mt: -5,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Avatar
            src={member.image}
            sx={{
              width: 130,
              height: 130,
              border: '4px solid',
              borderColor: 'background.paper',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
            }}
          />
        </Box>

        <CardContent sx={{ textAlign: 'center', pt: 3, px: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {member.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2.5, fontSize: '1.1rem' }}>
            {member.role}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, height: 72, fontSize: '0.95rem' }}>
            {member.description}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              component="a" 
              href={member.linkedin}
              target="_blank"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#0077B5' }
              }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton 
              size="small" 
              component="a" 
              href={member.github}
              target="_blank"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#333' }
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton 
              size="small" 
              component="a" 
              href={member.twitter}
              target="_blank"
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: '#E4405F' }
              }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const NewProfileCards = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollContainerRef = React.useRef(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= scrollWidth - container.clientWidth) {
      // If near the end, jump to one-third point
      container.scrollLeft = container.scrollWidth / 3;
    } else if (container.scrollLeft <= 0) {
      // If near the start, jump to two-thirds point
      container.scrollLeft = (container.scrollWidth * 2) / 3;
    }
    
    setScrollPosition(container.scrollLeft);
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Set initial scroll position to middle of duplicated content
      container.scrollLeft = container.scrollWidth / 4;
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Create a longer list for smoother infinite scroll
  const duplicatedMembers = [...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers, ...teamMembers];

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        width: '100%',
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',  // Hide scrollbar IE/Edge
        scrollbarWidth: 'none',   // Hide scrollbar Firefox
        '&::-webkit-scrollbar': { // Hide scrollbar Chrome/Safari/Opera
          display: 'none'
        },

        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100px',
          background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.3))',
          pointerEvents: 'none',
          zIndex: 2
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100px',
          background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.3))',
          pointerEvents: 'none',
          zIndex: 2
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          py: 6,
          px: { xs: 4, md: 8 },
          gap: 4,
          scrollSnapType: 'x mandatory',
          '& > div': {
            scrollSnapAlign: 'center',
          },
          width: 'fit-content',
          position: 'relative',
          '&:hover': {
            '& > div': {
              transform: 'scale(0.95)',
              opacity: 0.7,
              transition: 'all 0.3s ease-in-out',
            },
            '& > div:hover': {
              transform: 'scale(1.1)',
              opacity: 1,
              zIndex: 1
            }
          }
        }}
      >
        {duplicatedMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProfileCard member={member} />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default NewProfileCards;