import * as React from "react";
import Container from "@mui/material/Container";
import { Box, Button, Typography } from "@mui/material";

export default function App() {
  const [message, setMessage] = React.useState("testing");
  const handleSubmit = async () => {
    console.log("Button clicked");
    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Where is Singapore" }),
      });
      const data = await response.json();
      setMessage(data.response);
    } catch (error) {
      console.error("Error posting to server:", error);
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Button variant="text" onClick={handleSubmit}>
          Text
        </Button>
      </Box>
    </Container>
  );
}
