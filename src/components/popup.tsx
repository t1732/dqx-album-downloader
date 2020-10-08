import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { imageInfo } from "../content_scripts"
import { DownloadButton } from "./button"
import { Header } from "./header"
import { LoadingOverlay } from "./loading-overlay"

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
})

type TabPanelProps = Partial<{
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}>

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

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

const sendClickMessage = (tab: chrome.tabs.Tab, type: string): void => {
  const sendData = {
    type: type,
    url: tab.url,
  }

  if (!tab.id) {
    return
  }

  chrome.tabs.sendMessage(tab.id, sendData, (response) => {
    return
  })
}

const clickCurrentPage = () => {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
      status: "complete",
      url: "https://hiroba.dqx.jp/sc/character/*/picture/*",
    },
    (tabs) => {
      if (tabs.length === 0) {
        alert("思い出アルバムのページを表示した状態で実行してください")
      } else {
        sendClickMessage(tabs[0], "current")
      }
    }
  )
}

const clickAllPage = () => {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
      status: "complete",
      url: "https://hiroba.dqx.jp/sc/character/*/picture/*",
    },
    (tabs) => {
      if (tabs.length === 0) {
        alert("思い出アルバムのページを表示した状態で実行してください")
      } else {
        sendClickMessage(tabs[0], "all")
      }
    }
  )
}

const loadCurrentTab = () => {
  return new Promise<chrome.tabs.Tab>((resolve, _reject) => {
    chrome.tabs.query(
      {
        currentWindow: true,
        active: true,
        status: "complete",
        url: "https://hiroba.dqx.jp/sc/character/*/picture/*",
      },
      (tabs) => {
        if (tabs.length === 0) {
          throw new Error("思い出アルバムのページを表示した状態で実行してください")
        } else {
          const tab = tabs[0]
          resolve(tab)
        }
      }
    )
  })
}

const loadImages = (tabId: number, data: { [key: string]: string }) => {
  return new Promise<imageInfo[]>((resolve, _reject) => {
    chrome.tabs.sendMessage(tabId, data, (response: imageInfo[]) => {
      resolve(response)
    })
  })
}

const loadCurrentImages = async () => {
  try {
    const tab = await loadCurrentTab()

    if (!tab.id || !tab.url) {
      throw new Error("思い出アルバムのページを表示した状態で実行してください")
    }

    const sendData = {
      type: "current",
      url: tab.url,
    }

    return await loadImages(tab.id, sendData)
  } catch (error) {
    alert(error)
  }
}

const didMount = async (setLoading: (loading: boolean) => void) => {
  setLoading(true)
  try {
    const _images = await loadCurrentImages()
    alert(_images?.length)
    setLoading(false)
  } catch (error) {
    alert(error)
  }
}

export const Popup: React.FC = () => {
  const [tab, setTab] = React.useState(0)
  const handleChange = (event: React.ChangeEvent<{}>, newTab: number) => {
    setTab(newTab)
  }
  const [loading, setLoading] = React.useState(false)

  // componentDidMount
  React.useEffect(() => {
    didMount((loading) => {
      setLoading(loading)
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box width={600}>
        <Header tab={tab} handleChange={handleChange} />
        <TabPanel value={tab} index={0} dir={theme.direction}>
          <DownloadButton text="ダウンロード" onClick={clickCurrentPage} />
        </TabPanel>
        <TabPanel value={tab} index={1} dir={theme.direction}>
          <DownloadButton text="ダウンロード" onClick={clickAllPage} />
        </TabPanel>
      </Box>
      <LoadingOverlay open={loading} />
    </ThemeProvider>
  )
}
