import React from "react"
import ReactDOM from "react-dom"
import Popup from "./components/popup"
import "./popup.styl"

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

const popup = () => {
  ReactDOM.render(<Popup />, document.getElementById("root"))

  const btnCurrent = document.getElementById("btn-current")
  const btnAll = document.getElementById("btn-all")

  btnCurrent?.addEventListener("click", () => {
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
  })

  btnAll?.addEventListener("click", () => {
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
  })
}

popup()
