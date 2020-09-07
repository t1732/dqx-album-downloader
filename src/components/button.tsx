import React from "react"

type Props = {
  text: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<Props> = ({children, text}) => (
  <button className="nes-btn btn-download">{text}</button>
)

export default Button
