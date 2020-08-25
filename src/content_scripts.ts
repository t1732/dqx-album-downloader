const convertImageName = (name: string): string => {
  if (name) {
    return name.replace(/\r?\n/g, "_").replace(/\//g, "-").replace(/:/g, "")
  } else {
    return "dq10-album-image"
  }
}

const downloadCurrentPageImages = (target: Document): boolean => {
  const imageFrame = target.querySelector(".contentsFrameArea")

  if (!imageFrame) {
    console.log("ダウンロードできませんでした。思い出アルバムページではないかHTMLの構造が変わった可能性があります")
    return false
  }

  const images = imageFrame.querySelectorAll("img")
  const imageNames = imageFrame.getElementsByClassName("thumbLocationAndDate")

  images.forEach((img, index) => {
    if (img.src.match("webpicture") === null) {
      return
    }

    const imageName = imageNames[index] as HTMLParagraphElement
    const fileName = convertImageName(imageName.innerText)
    const downloadOptions = {
      url: img.src.replace("thum2", "xl"),
      filename: `dq10_album/${fileName}.jpg`,
      conflictAction: "uniquify",
      saveAs: false,
    }

    chrome.runtime.sendMessage(downloadOptions)
  })

  alert("ダウンロードが完了しました")

  return true
}

const downloadAllPageImages = (target: Document) => {
  const baseUrl = location.href.replace(/\/page\/\d*/, "")
  const page = 11
  chrome.runtime.sendMessage({loadUrl: `${baseUrl}/page/${page}`}, (data) => {
    const domparser = new DOMParser()
    const doc = domparser.parseFromString(data.html, "text/html")
    downloadCurrentPageImages(doc)
  })
}

const main = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "current") {
      sendResponse(downloadCurrentPageImages(document))
    }

    if (request.type === "all") {
      sendResponse(downloadAllPageImages(document))
    }

    return true
  })
}

main()
