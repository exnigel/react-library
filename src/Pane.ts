import PropTypes from "prop-types"

// Pane
//
// Internally used by SplitPane to create the resizable panes
//
// Vertical splitpane panes gets the classes "pane vertical"
// Horizontal splitpane panes gets the classes "pane horizontal"
//
// The first pane gets an added class "first"

import React, { CSSProperties } from "react"

const R = React.createElement

export default class Pane extends React.Component<{
  split?: "vertical" | "horizontal"
  width?: number | string
  children?: React.ReactNode
}> {
  // Was `static defaultProps() { return {...} }` -- a method declaration, not a property
  // assignment, so React never actually read it (defaultProps must be a plain object on the
  // class, not a function) -- this default has silently never applied at runtime. Real bug,
  // found while fixing this file's TypeScript errors for React 18 compatibility.
  static defaultProps = { split: "vertical" as const }

  render() {
    const classNames = ["pane"]
    const style: CSSProperties = {
      flex: "0 0 auto",
      position: "relative"
    }

    if (this.props.split === "vertical") {
      classNames.push("vertical")
      if (this.props.width != null) {
        style.width = this.props.width
      }
    } else {
      classNames.push("horizontal")
      if (this.props.width != null) {
        style.height = this.props.width
      }
    }

    if (this.props.width) {
      classNames.push("first")
    } else {
      style.flex = 1
      if (this.props.split === "vertical") {
        style.width = "100%"
      } else {
        style.height = "100%"
      }
    }

    return R("div", { style, className: classNames.join(" ") }, this.props.children)
  }
}
