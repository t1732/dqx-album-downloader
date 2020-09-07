import React from "react"
import Button from "./button"

type Props = Partial<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  children: never
}>

const Popup: React.FC<Props> = ({children}) => (
  <main>
    <div className="nes-container is-dark with-title">
      <p className="title">DQX 思い出アルバムダウンローダ</p>
      ダウンロードする対象のボタンをクリックしてください
    </div>
    <div className="container">
      <Button text="現在のページ" />
      <Button text="すべてのぺーじ" />
    </div>
  </main>
)

export default Popup
