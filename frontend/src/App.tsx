import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { AppBar, Box, Tab, Tabs, Typography } from "@mui/material";
import VisionParser from "./VisionParser";
import AIChatbot from "./AIChatbot";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

export default function App() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "100%%",
        height: "80%",
        position: "relative",
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="static"
        color="default"
        sx={{ alignContent: "center", justifyContent: "center" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="AI Chatbot" {...a11yProps(0)} />
          <Tab label="Vision Parser" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <AIChatbot />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <VisionParser />
      </TabPanel>
    </Box>
  );
}
