import React, { CSSProperties } from "react"
import { useResizeDetector } from "react-resize-detector"
const R = React.createElement

export interface AutoSizeComponentProps {
  /** True to inject width */
  injectWidth?: boolean
  /** True to inject height */
  injectHeight?: boolean
  children?: (size: { width?: number; height?: number }) => React.ReactElement<any>
}

// react-resize-detector v12 dropped its old render-prop component (`withPolyfill`) entirely in
// favor of a hook-only API (`useResizeDetector`) -- a class component can't call a hook directly,
// so this small function component wraps it and AutoSizeComponent's class below delegates to it,
// keeping the exact same public API/behavior (injectWidth/injectHeight, children as a function or
// a single child element) for every existing caller.
function AutoSizeInner({ injectWidth, injectHeight, children }: AutoSizeComponentProps) {
  const { width, height, ref } = useResizeDetector({ handleWidth: injectWidth, handleHeight: injectHeight })

  let innerElem
  const style: CSSProperties = {}
  if (injectWidth) {
    style.width = "100%"
  }
  if (injectHeight) {
    style.height = "100%"
  }

  // Return placeholder until width/height known
  if (width == null || height == null) {
    return R("div", { style, ref })
  }

  const overrides: any = {}
  if (injectWidth) {
    overrides.width = width
  }
  if (injectHeight) {
    overrides.height = height
  }

  if (typeof children === "function") {
    innerElem = children(overrides)
  } else {
    // DEPRECATED
    innerElem = React.cloneElement(React.Children.only(children as any), overrides)
  }

  return R("div", { style, ref }, innerElem)
}

// Automatically injects the width or height of the DOM element into the
// child component, updating as window resizes.
// If children is a function, calls with with { width:,  height: } depending on injectHeight or injectWidth
export default class AutoSizeComponent extends React.Component<AutoSizeComponentProps> {
  render() {
    return R(AutoSizeInner, this.props)
  }
}
