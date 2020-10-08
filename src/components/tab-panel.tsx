import { Box } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import React from "react"

type Props = {
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}

export const TabPanel: React.FC<Props> = ({ children, dir, index, value, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
