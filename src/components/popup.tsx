import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import {DownloadButton} from "./button"

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

export const Popup: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box width={600}>
      <div className="with-title">
        <p className="title">DQX 思い出アルバムダウンローダ</p>
      ダウンロードする対象のボタンをクリックしてください
      </div>
      <div className="container">
        <DownloadButton text="現在のページ" onClick={clickCurrentPage} />
        <DownloadButton text="すべてのぺーじ" onClick={clickAllPage} />
      </div>
    </Box>
  </ThemeProvider>
)
