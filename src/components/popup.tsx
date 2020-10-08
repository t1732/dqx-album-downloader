import { Box, CssBaseline } from "@material-ui/core"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { imageInfo } from "../content_scripts"
import { DownloadButton } from "./button"
import { Header } from "./header"
import { LoadingOverlay } from "./loading-overlay"
import { TabPanel } from "./tab-panel"

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
})

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
