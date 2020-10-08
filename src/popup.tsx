import React from "react"
import ReactDOM from "react-dom"
import { Popup } from "./components/popup"

const popup = () => {
  ReactDOM.render(<Popup />, document.getElementById("root"))
}

popup()
