import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

const teamMembers = [
  {
    name: 'Kumar Saurav',
    role: 'Lead Data Scientist',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQFoZwhH1K_ZSQ/profile-displayphoto-shrink_400_400/B56ZRFtlfkHoAg-/0/1736336367077?e=1762387200&v=beta&t=mDLbh3YNPP_OfMlKUZGuH2R67Sfd_a3SHzzBcRXrtpA',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    description: 'Expert in exoplanet detection algorithms and machine learning model development.'
  },
  {
    name: 'Nikhil Prakash',
    role: 'Astrophysicist',
    image: 'https://media.licdn.com/dms/image/v2/D4E03AQGXhCspUkmEXw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1725435487029?e=1762387200&v=beta&t=zrShjRdhz4FF97xY9fd-IrUqRcSobKj744tq-hR6zLo',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    description: 'Specializes in analyzing stellar data and characterizing exoplanetary systems.'
  },
  {
    name: 'Hardik Kushwaha',
    role: 'Full Stack Developer',
    image: 'https://media.licdn.com/dms/image/v2/D4E03AQH_YxrYkaQ_jQ/profile-displayphoto-scale_400_400/B4EZhAdTMIGYAo-/0/1753428080891?e=1762387200&v=beta&t=0khoqQ9cQBQJ9xD-ggJ7XdSZXeeRVseynm3BWKz_hoM',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    description: 'Builds robust applications for processing and visualizing astronomical data.'
  },
  {
    name: 'Basil Khan',
    role: 'UI/UX Designer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQG-2Nf--z0D9Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723812389366?e=1762387200&v=beta&t=dFbH13nthTHWgfhGIbKXjJt6DtEFqkROyOkKrOu_HZk',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    description: 'Creates intuitive interfaces for exploring space data and discoveries.'
  },
  {
    name: 'Prashant Suthar',
    role: 'Data Engineer',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQFF--uTto9hEA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723779183427?e=1762387200&v=beta&t=b1TD74ZmFZ0c_6uS15OahAaos8exomY7JrAguUCGYc4',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    description: 'Manages data pipelines and infrastructure for large-scale astronomical datasets.'
  },
  {
    name: 'Aryan Garg',
    role: 'Research Scientist',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQFF--uTto9hEA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723779183427?e=1762387200&v=beta&t=b1TD74ZmFZ0c_6uS15OahAaos8exomY7JrAguUCGYc4',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
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
                '&:hover': { color: '#1DA1F2' }
              }}
            >
              <TwitterIcon />
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