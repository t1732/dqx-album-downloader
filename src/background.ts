import axios from "axios"

const loadAlbumPage = async (url: string) => {
  return await axios.get(url, {responseType: "text"})
}

const background = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.loadUrl) {
      loadAlbumPage(request.loadUrl).then((response) => {
        const html = response.data as String
        sendResponse({html: html.replace(/\r?\n/g, "").trim()})
      })
    } else {
      // chrome.downloads.download(request)
      console.log(request)
      sendResponse(true)
    }

    return true
  })
}

background()
