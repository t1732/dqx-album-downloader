import AppBar from "@material-ui/core/AppBar"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import React from "react"

type Props = {
  title?: string
  tab: number
  firstTabLabel?: string
  secondTabLabel?: string
  handleChange: (event: React.ChangeEvent<{}>, newTab: number) => void
}

const tabProps = (index: any) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}
export const Header: React.FC<Props> = ({
  title,
  tab,
  firstTabLabel,
  secondTabLabel,
  handleChange,
}) => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          {title}
        </Typography>
      </Toolbar>
      <Tabs
        value={tab}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        aria-label="select load type"
      >
        <Tab label={firstTabLabel} {...tabProps(0)} />
        <Tab label={secondTabLabel} {...tabProps(1)} />
      </Tabs>
    </AppBar>
  )
}

Header.defaultProps = {
  title: "DQX 思い出アルバムダウンローダ",
  firstTabLabel: "現在のページ",
  secondTabLabel: "すべてのぺーじ",
}
