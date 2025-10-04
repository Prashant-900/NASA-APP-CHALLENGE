import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { searchPlanet } from "../../api/dataApi";
import StarfieldBackground from "../common/StarfieldBackground";
import PlanetResult from "./PlanetResult";
import bhvid from "../../assets/blackhole.webm";
import Page2 from "./page2";
import Page3 from "./page3";
import Page4 from "./page4";
import Page5 from "./page5";

import styles from './home.module.css';


function Home() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [imageAtTop, setImageAtTop] = useState(false);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setShowResult(false);

    try {
      const response = await searchPlanet(searchTerm.trim());
      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      setResult({ found: false });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isScrollingRef.current || showResult) {
        e.preventDefault();
        return;
      }

      const scrollY = container.scrollTop;
      const pageHeight = window.innerHeight;
      const currentPage = Math.floor(scrollY / pageHeight);
      
      // Allow free scrolling on Page4 footer (index 4) and beyond
      if (scrollY >= pageHeight * 4) {
        // Let natural scrolling happen in the footer area
        setImageAtTop(true);
        return;
      }

      e.preventDefault();
      isScrollingRef.current = true;

      let targetPage;
      if (e.deltaY > 0) {
        // Scroll down - go to next page (up to index 4)
        targetPage = Math.min(currentPage + 1, 4);
      } else {
        // Scroll up - go to previous page
        targetPage = Math.max(currentPage - 1, 0);
      }

      container.scrollTo({ top: targetPage * pageHeight, behavior: "smooth" });
      setImageAtTop(targetPage > 0);

      // Increased timeout for slower scrolling (50% slower)
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isScrollingRef.current || showResult) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      const scrollY = container.scrollTop;
      const pageHeight = window.innerHeight;
      const currentPage = Math.floor(scrollY / pageHeight);
      
      // Allow free scrolling on Page4 footer (index 4) and beyond
      if (scrollY >= pageHeight * 4) {
        setImageAtTop(true);
        return;
      }

      if (Math.abs(diff) > 50) {
        e.preventDefault();
        isScrollingRef.current = true;

        let targetPage;
        if (diff > 0) {
          // Swipe up - go to next page (up to index 4)
          targetPage = Math.min(currentPage + 1, 4);
        } else {
          // Swipe down - go to previous page
          targetPage = Math.max(currentPage - 1, 0);
        }

        container.scrollTo({
          top: targetPage * pageHeight,
          behavior: "smooth",
        });
        setImageAtTop(targetPage > 0);

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      className="home-container"
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
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

      {/* Floating video - hidden in light mode */}
      {theme.palette.mode === "dark" && (
        <motion.video
          autoPlay
          loop
          muted
          initial={{ 
            top: "auto",
            bottom: "0",
            transform: "translate(-50%, 50%) scale(0.1)"
          }}
          style={{
            width: "83vw",
            borderRadius: "50%",
            position: "fixed",
            left: "50%",
            zIndex: 0, 
            objectFit: "cover",
          }}
          animate={
            imageAtTop
              ? { top: "7%", bottom: "auto", transform: "translate(-50%, -50%) scale(1)" }
              : { top: "auto", bottom: "0", transform: "translate(-50%, 50%) scale(1)" }
          }
          transition={{ 
            duration: imageAtTop ? 0.6 : 0.5,
            ease: "easeOut",
            scale: {
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1]
            }
          }}
        >
          <source src={bhvid} type="video/mp4" />
        </motion.video>
      )}

      {/* Page 1 */}
      <Box
        sx={{
          height: "100vh",
          p: 3,
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: showResult ? "flex-start" : "center",
        }}
      >
        <motion.div
          animate={{
            width: showResult ? "40%" : "60%",
            x: showResult ? 0 : 0
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: showResult ? "24px" : "0"
          }}
        >
          <motion.div
            style={{ marginTop: "-250px" }}  // Increased negative margin to move heading higher
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{ 
                color: "primary.main", 
                mb: 1.5,  // Reduced bottom margin
                fontWeight: "bold",
                textAlign: showResult ? "left" : "center",
                fontSize: "4rem" 
              }}
            >
              Exoplanet Discovery
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >

          </motion.div>

          <Box sx={{ display: "flex", gap: 2, mb: 4, mt: 15 }}>

            
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter planet name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={loading}
                />


              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                sx={{ minWidth: "120px", height: "56px" }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Search sx={{ mr: 1 }} />
                    Search
                  </>
                )}
              </Button>
          </Box>
        </motion.div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              width: "60%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlanetResult result={result} isVisible={showResult} onClose={handleCloseResult} />
          </motion.div>
        )}
      </Box>

      <Page5 />
      <Page2 />
      <Page3 />
      <Page4 />
    </Box>
  );
}

export default Home;
