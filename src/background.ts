const background = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.downloads.download(request)
    sendResponse()
  })
}

background()
