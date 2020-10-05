import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import {DownloadButton} from "./button"

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: any) => {
  return {
    "id": `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}

const sendClickMessage = (tab: chrome.tabs.Tab, type: string): void => {
  const sendData = {
    type: type,
    url: tab.url,
  }

  if (!tab.id) {
    return
  }

  chrome.tabs.sendMessage(tab.id, sendData, (response) => {
  })
}

const clickCurrentPage = () => {
  chrome.tabs.query({
    currentWindow: true,
    active: true,
    status: "complete",
    url: "https://hiroba.dqx.jp/sc/character/*/picture/*",
  }, (tabs) => {
    if (tabs.length === 0) {
      alert("思い出アルバムのページを表示した状態で実行してください")
    } else {
      sendClickMessage(tabs[0], "current")
    }
  })
}

const clickAllPage = () => {
  chrome.tabs.query({
    currentWindow: true,
    active: true,
    status: "complete",
    url: "https://hiroba.dqx.jp/sc/character/*/picture/*",
  }, (tabs) => {
    if (tabs.length === 0) {
      alert("思い出アルバムのページを表示した状態で実行してください")
    } else {
      sendClickMessage(tabs[0], "all")
    }
  })
}

export const Popup: React.FC = () => {
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  })
  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box width={600}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
            DQX 思い出アルバムダウンローダ
            </Typography>
          </Toolbar>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
            aria-label="select load type"
          >
            <Tab label="現在のページ" {...a11yProps(0)} />
            <Tab label="すべてのぺーじ" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <DownloadButton text="ダウンロード" onClick={clickCurrentPage} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <DownloadButton text="ダウンロード" onClick={clickAllPage} />
        </TabPanel>
      </Box>
    </ThemeProvider>
  )
}
