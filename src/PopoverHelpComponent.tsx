import _ from "lodash"
import React, { ReactNode } from "react"
import ReactDOM from "react-dom"
import Popover from "bootstrap/js/dist/popover"

export interface PopoverHelpComponentProps {
  placement?: "top" | "right" | "bottom" | "left"

  /** hover is default */
  trigger?: "hover" | "click"

  /** Override content. Defaults to gray question circle */
  content?: ReactNode

  children?: ReactNode
}

// Feature 6.4b: NOT migrated off Bootstrap. Unlike this codebase's other components, this one
// uses `bootstrap/js/dist/popover` -- a real Bootstrap JS widget whose popup markup/styling
// (`.popover`, `.popover-body`, `.popover-arrow`) is generated internally by that widget, not by
// classnames in this file. Removing it means replacing the widget itself, not just swapping
// classes -- out of scope for 6.4b's classname migration. Still requires Bootstrap's CSS to be
// present wherever this component is used.
// @deprecated Feature 12.2: confirmed (grep, not assumed) unused anywhere in mwater-forms's
// app/, src/, test/, or stories/ -- its only real usage is react-library's own src/demo.tsx, a
// non-Storybook internal demo harness, and that call site is already commented out there.
// Real Bootstrap CSS is no longer loaded by mwater-forms at all (removed in Feature 6.4d), so
// this component's popup would render completely unstyled if it were ever wired up in that app.
// Per Feature 12.1/FEATURE_MAP_AND_MILESTONES.md's own explicit choice ("reimplement without
// Bootstrap, or formally deprecate") -- formally deprecated rather than redesigned, since
// building a real non-Bootstrap popover widget for zero live consumers isn't a good use of this
// redesign's effort. Left otherwise untouched; a future real consumer should get a proper
// Tailwind-native popover instead of reviving this one.
/** Shows a popover when help icon is clicked. Needs bootstrap */
export default class PopoverHelpComponent extends React.Component<PopoverHelpComponentProps> {
  divRef = (el: any) => {
    if (el) {
      // Create div with content
      const contentDiv = document.createElement("div")
      ReactDOM.render(this.props.children as any, contentDiv)
      new Popover(el, {
        content: contentDiv,
        trigger: this.props.trigger || "hover",
        placement: this.props.placement || "top",
        html: true
      })
    }
  }


  render() {
    return <span ref={this.divRef}>
      {
        this.props.content ? 
        this.props.content : 
        <span className="text-secondary" style={{ cursor: "pointer" }}>
          <i className="fa fa-question-circle"/>
        </span>
      }
    </span>
  }
}
