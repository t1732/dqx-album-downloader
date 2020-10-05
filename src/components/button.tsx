import React from "react"
import {makeStyles, createStyles, Theme} from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

type Props = {
  text: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }),
)

export const DownloadButton: React.FC<Props> = ({children, text, onClick}) => {
  const classes = useStyles()
  return (
    <Button className={classes.root} color="primary" onClick={onClick}>
      {text}
    </Button>
  )
}
