import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import React from "react"

type Props = {
  open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export const LoadingOverlay: React.FC<Props> = ({ open }) => {
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

LoadingOverlay.defaultProps = {
  open: false,
}
