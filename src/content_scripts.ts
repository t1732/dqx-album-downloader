const convertImageName = (name: string): string => {
  if (name) {
    return name.replace(/\r?\n/g, "_").replace(/\//g, "-").replace(/:/g, "")
  } else {
    return "dq10-album-image"
  }
}

const onError = (): void => {
  console.log("ダウンロードできませんでした。思い出アルバムページではないかHTMLの構造が変わった可能性があります")
}

const downloadCurrentPageImages = (target: Document): boolean => {
  const imageFrame = target.querySelector(".contentsFrameArea")

  if (!imageFrame) {
    onError()
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

const downloadAllPageImages = (url: string) => {
  const baseUrl = url.replace(/\/page\/\d*/, "")
  const pageNavi = document.querySelector(".pageNavi")
  let page: string | undefined

  if (pageNavi) {
    const lastPager = pageNavi.querySelector("li.last")
    if (lastPager) {
      page = lastPager.querySelector("a")?.dataset.pageno
      console.log(page)
    } else {
      page = pageNavi.querySelector<HTMLLIElement>("li:last-child")?.innerText
      if (page) {
        console.log(page)
      } else {
        onError()
        return
      }
    }
  } else {
    onError()
    return
  }

  if (!page) {
    onError()
    return
  }

  const lastPageNum: number = parseInt(page)
  const x: Array<number> = [...Array(lastPageNum)]
  x.map((_, i) => {
    chrome.runtime.sendMessage({loadUrl: `${baseUrl}/page/${i}`}, (data) => {
      const domparser = new DOMParser()
      const doc = domparser.parseFromString(data.html, "text/html")
      downloadCurrentPageImages(doc)
    })
  })
}

export type imageInfo = Partial<{
  url: string
  thmb: string
  name: string
}>

const fetchCurrentPageImages = (target: Document): imageInfo[] => {
  const imageFrame = target.querySelector(".contentsFrameArea")

  if (!imageFrame) {
    onError()
    return []
  }

  const images = Array.from(imageFrame.querySelectorAll("img"))
  const imageNames = imageFrame.getElementsByClassName("thumbLocationAndDate")

  return images
      .filter((img) => img.src.match("webpicture") !== null)
      .map((img, index) => {
        const imageName = imageNames[index] as HTMLParagraphElement
        const fileName = convertImageName(imageName.innerText)

        return {
          url: img.src.replace("thum2", "xl"),
          thum: img.src,
          name: `dq10_album/${fileName}.jpg`,
        }
      })
}

const main = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "current") {
      sendResponse(fetchCurrentPageImages(document))
    }

    if (request.type === "all") {
      sendResponse(downloadAllPageImages(request.url))
    }

    return true
  })
}

main()
