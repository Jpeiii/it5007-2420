import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FaceIcon from "@mui/icons-material/Face";
import SendIcon from "@mui/icons-material/Send";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  height: "80vh",
  overflowY: "auto",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const ChatBotContainer = styled(Stack)(({ theme }) => ({
  maxHeight: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function AIChatbot() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      user: 0,
      text: "Hello! How can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleQuery = async (query: String) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 0, text: data.response },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error posting to server:", error);
    }
  };

  const handleSubmitMessage = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: 1, text: inputValue },
    ]);
    handleQuery(inputValue);
    setLoading(true);
    setInputValue("");
  };

  return (
    <Container>
      <ChatBotContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: msg.user === 0 ? "flex-start" : "flex-end",
                backgroundColor: msg.user === 0 ? "#e1f5fe" : "#e0f2f1",
                padding: 2,
                borderRadius: 2,
                margin: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {msg.user === 0 && <SmartToyIcon sx={{ color: "#01579b" }} />}
              <Typography
                sx={{
                  color: msg.user === 0 ? "#01579b" : "#004d40",
                  wordWrap: "break-word",
                  maxHeight: "20vh",
                  overflowY: "auto",
                }}
              >
                {msg.text}
              </Typography>
              {msg.user === 1 && <FaceIcon sx={{ color: "#004d40" }} />}
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              marginTop: "auto",
            }}
          >
            <TextField
              fullWidth
              id="outlined-multiline-flexible"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="send message"
                      edge="end"
                      onClick={handleSubmitMessage}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Card>
      </ChatBotContainer>
    </Container>
  );
}
