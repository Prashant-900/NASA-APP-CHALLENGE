import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
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
import Page6 from "./page6";

const allValues = [
  "BD+20 594",
  "BD+20 594",
  "BD+20 594",
  "EPIC 201111557",
  "EPIC 201111557",
  "EPIC 201126503",
  "EPIC 201127519",
  "EPIC 201176672",
  "EPIC 201127519",
  "EPIC 201147085",
  "1000.01",
  "1001.01",
  "1002.01",
  "1003.01",
  "1004.01",
  "1005.01",
  "1006.01",
  "1007.01",
  "1008.01",
  "1009.01",
  "Kepler-227 b",
  "Kepler-227 c",
  "Kepler-664 b",
  "Kepler-228 d",
  "Kepler-228 c",
  "Kepler-228 b",
  "Kepler-229 c"
];


function Home() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [imageAtTop, setImageAtTop] = useState(false);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Helper: pick up to `count` random unique suggestions from the provided values
  const pickRandomSuggestions = (values, count = 5) => {
    if (!Array.isArray(values) || values.length === 0) return [];
    // Use unique values to avoid showing duplicates
    const unique = Array.from(new Set(values));
    // Fisher-Yates shuffle
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    return unique.slice(0, Math.min(count, unique.length));
  };

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
      
      // Allow free scrolling on Page4 footer (index 5) and beyond
      if (scrollY >= pageHeight * 5) {
        // Let natural scrolling happen in the footer area
        setImageAtTop(true);
        return;
      }

      e.preventDefault();
      isScrollingRef.current = true;

      let targetPage;
      if (e.deltaY > 0) {
        // Scroll down - go to next page (up to index 5)
        targetPage = Math.min(currentPage + 1, 5);
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
      
      // Allow free scrolling on Page4 footer (index 5) and beyond
      if (scrollY >= pageHeight * 5) {
        setImageAtTop(true);
        return;
      }

      if (Math.abs(diff) > 50) {
        e.preventDefault();
        isScrollingRef.current = true;

        let targetPage;
        if (diff > 0) {
          // Swipe up - go to next page (up to index 5)
          targetPage = Math.min(currentPage + 1, 5);
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

          <Box sx={{ display: "flex", gap: 2, mb: 4, mt: 15, alignItems: "flex-start" }}>
            <Box sx={{ flex: 1, position: "relative" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter planet name..."
                value={searchTerm}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchTerm(v);
                  // show suggestions when user starts typing (has at least one non-space char)
                  if (v.trim().length > 0 && !loading && !showResult) {
                    setSuggestions(pickRandomSuggestions(allValues, 5));
                  } else {
                    setSuggestions([]);
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                disabled={loading}
              />

              {/* Suggestions list shown while typing */}
              {suggestions.length > 0 && !loading && !showResult && (
                <Paper
                  elevation={6}
                  sx={{ mt: 1, maxHeight: 220, overflow: "auto" }}
                >
                  <List dense>
                    {suggestions.map((s, idx) => (
                      <ListItem
                          key={`${s}-${idx}`}
                          button
                          onClick={() => {
                            // Only populate the input and hide suggestions — don't auto-search
                            setSearchTerm(s);
                            setSuggestions([]);
                          }}
                        >
                          <ListItemText primary={s} />
                        </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

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
      <Page6 />
      <Page4 />
    </Box>
  );
}

export default Home;
