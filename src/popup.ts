import "./popup.styl"

const sendClickMessage = (tab: chrome.tabs.Tab, type: string): void => {
  const sendData = {
    type: type,
  }

  if (!tab.id) {
    return
  }

  chrome.tabs.sendMessage(tab.id, sendData, (response) => {
  })
}

const popup = () => {
  const btnCurrent = document.getElementById("btn-current")
  const btnAll = document.getElementById("btn-all")

  btnCurrent?.addEventListener("click", () => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }, (tabs) => {
      sendClickMessage(tabs[0], "current")
    })
  })

  btnAll?.addEventListener("click", () => {
    chrome.tabs.query({
      currentWindow: true,
      active: true,
    }, (tabs) => {
      sendClickMessage(tabs[0], "all")
    })
  })
}

popup()
