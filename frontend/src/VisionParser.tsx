import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FaceIcon from "@mui/icons-material/Face";
import SendIcon from "@mui/icons-material/Send";

interface imageType {
  id: string;
  name: string;
  preview: string;
}
export default function VisionParser() {
  const uppyContainerRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<imageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const handleSubmit = async () => {
    console.log("Sending to server...");
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/visonparser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images: image }),
      });
      const data = await response.json();
      setResponse(data.response as string);
      setLoading(false);
    } catch (error) {
      console.error("Error posting to server:", error);
    }
  };

  const resizeImage = (
    base64Str: string | ArrayBuffer | null,
    maxWidth: number,
    maxHeight: number
  ) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = base64Str as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const getBase64 = (file: any): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.data);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (uppyContainerRef.current) {
      const uppy = new Uppy({
        restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ["image/*"] },
        autoProceed: false,
      }).use(Dashboard, {
        inline: true,
        target: uppyContainerRef.current,
        height: "70vh",
        width: "30vw",
      });
      uppy.on("complete", async (result: any) => {
        const newFiles = [];

        for (const file of result.successful) {
          const base64img = await getBase64(file);
          const resizedBase64img = await resizeImage(base64img, 200, 200);
          newFiles.push({
            id: file.id,
            name: file.name,
            preview: URL.createObjectURL(file.data),
            base64: resizedBase64img,
          });
        }
        setImage(newFiles);
      });

      return () => uppy.destroy();
    }
  }, []);

  const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    height: "70vh",
    overflowY: "auto",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    [theme.breakpoints.up("sm")]: {
      width: "450px",
    },
    ...theme.applyStyles("dark", {
      boxShadow:
        "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
  }));

  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: "center",
          height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
          marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
          minHeight: "100%",
        },
        (theme) => ({
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
        }),
      ]}
    >
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: "auto",
          }}
        >
          {image.length > 0 ? (
            image.map((file) => (
              <Box key={file.id} sx={{ height: "70vh", width: "30vw" }}>
                <img
                  src={file.preview}
                  alt={file.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))
          ) : (
            <Box ref={uppyContainerRef} />
          )}
          <Card>
            <Box
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "#e1f5fe",
                padding: 2,
                borderRadius: 2,
                margin: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FaceIcon sx={{ color: "#01579b" }} />
              <Typography>Describe this image</Typography>
              <IconButton edge="end" onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </Box>
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {response && (
              <Box
                sx={{
                  alignSelf: "flex-end",
                  backgroundColor: "#e0f2f1",
                  padding: 2,
                  borderRadius: 2,
                  margin: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                  height: "40vh",
                  overflowY: "auto",
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    wordBreak: "break-word",
                    textAlign: "justify",
                  }}
                >
                  {response}
                </Typography>
                <SmartToyIcon sx={{ color: "#004d40" }} />
              </Box>
            )}
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
}
