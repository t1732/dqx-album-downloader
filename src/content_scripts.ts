const convertImageName = (name: string): string => {
  return name ? name.replace(/\r?\n/g, " ") : "dq10-album-image"
}

const downloadCurrentPageImages = (): boolean => {
  const imageFrame = document.querySelector(".contentsFrameArea")

  if (!imageFrame) {
    console.log("ダウンロードできませんでした。思い出アルバムの構造が変わった可能性があります")
    return false
  }

  const images = imageFrame.querySelectorAll("img")
  const imageNames = imageFrame.getElementsByClassName("thumbLocationAndDate")

  images.forEach((img, index) => {
    if (img.src.match("webpicture") === null) {
      return
    }

    const imageName = imageNames[index] as HTMLParagraphElement
    const downloadOptions = {
      url: img.src.replace("thum2", "xl"),
      filename: convertImageName(imageName.innerText),
      conflictAction: "uniquify",
    }

    console.table(downloadOptions)
    // chrome.downloads.download(downloadOptions, (downloadId) => {
    //  console.log(downloadId)
    // })
  })

  return true
}

const main = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "current") {
      sendResponse(downloadCurrentPageImages())
    }
  })
}

main()
