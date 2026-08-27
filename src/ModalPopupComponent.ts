import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
const R = React.createElement
import _ from "lodash"

export interface ModalPopupComponentProps {
  /** Header of modal. Any react element */
  header?: React.ReactNode
  /** Footer of modal. Any react element */
  footer?: React.ReactNode
  /** Size of modal. Default is "normal" */
  size?: "large" | "full" | "normal" | "small" | "x-large"
  /** True to show close 'x' at top right */
  showCloseX?: boolean
  /** callback function to be called when close is requested */
  onClose?: () => void
  width?: number
  children?: React.ReactNode
}

// Modal popup based on react
export default class ModalPopupComponent extends React.Component<ModalPopupComponentProps> {
  modalNode: any

  /** Render something into a top-level div */
  static show = (modalFunc: (close: () => void) => ReactElement, onClose?: () => void) => {
    // Create temporary div to render into
    const tempDiv = document.createElement("div")

    // Create close function
    const close = () => {
      // Unrender
      ReactDOM.unmountComponentAtNode(tempDiv)

      // Remove div
      tempDiv.remove()

      // Call onClose
      if (onClose) {
        return onClose()
      }
    }

    const popupElem = modalFunc(close)
    return ReactDOM.render(popupElem, tempDiv)
  }

  constructor(props: ModalPopupComponentProps) {
    super(props)

    // Add special region to body
    this.modalNode = document.createElement("div")

    // append is not supported everywhere https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append#Browser_compatibility
    if (document.fullscreenElement) {
      document.fullscreenElement.appendChild(this.modalNode)
    } else {
      document.body.appendChild(this.modalNode)
    }
  }

  componentWillUnmount() {
    return this.modalNode.remove()
  }

  render() {
    return ReactDOM.createPortal(R(InnerModalComponent, this.props), this.modalNode)
  }
}

export interface InnerModalComponentProps {
  /** Header of modal. Any react element */
  header?: any
  /** Footer of modal. Any react element */
  footer?: any
  /** "large" for large, "full" for full-width */
  size?: "large" | "full" | "normal" | "small" | "x-large"
  /** True to show close 'x' at top right */
  showCloseX?: boolean
  /** callback function to be called when close is requested */
  onClose?: any
  width?: number
  children?: React.ReactNode
}

// Feature 6.4b: migrated from Bootstrap's `.modal`/`.modal-dialog`/`.modal-content`/etc. classes
// to Tailwind utilities. `.modal`'s own fixed/inset/z-index positioning (previously provided
// entirely by Bootstrap's stylesheet -- this component's own `rootStyle` only ever set
// `display`) now needs to be explicit. `.btn-close` (an empty button styled via a CSS
// background-image X icon) is replaced with a real "×" character, since there's no equivalent
// utility-only icon.
const CLOSE_BUTTON_CLASSES =
  "inline-flex items-center justify-center w-6 h-6 text-xl leading-none bg-transparent border-0 rounded opacity-50 hover:opacity-75 cursor-pointer"

// Content must be rendered at body level to prevent weird behaviour, so this is the inner component
class InnerModalComponent extends React.Component<InnerModalComponentProps> {
  render() {
    let dialogStyle
    let dialogSizeClass = "sm:max-w-[500px]"
    if (this.props.size === "large") {
      dialogSizeClass = "sm:max-w-[800px]"
    }
    if (this.props.size === "small") {
      dialogSizeClass = "sm:max-w-[300px]"
    }
    else if (this.props.size === "x-large") {
      dialogSizeClass = "sm:max-w-[1140px]"
    }
    else if (this.props.size === "full") {
      dialogStyle = { maxWidth: "95%" }
    }

    if (this.props.width) {
      dialogStyle = { width: this.props.width }
    }

    const rootStyle = {
      display: "block"
    }

    const overlayStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)"
    }

    return R(
      "div",
      { style: rootStyle, className: "fixed inset-0 z-[1055] overflow-y-auto outline-none" },
      R("style", null, "body { overflow-y: hidden }"),
      R("div", { style: overlayStyle, onClick: this.props.onClose }),
      R(
        "div",
        { className: `relative mx-auto my-8 w-[calc(100%-1rem)] ${dialogSizeClass}`, style: dialogStyle },
        R(
          "div",
          { className: "relative flex flex-col w-full bg-white border border-black/20 rounded-md shadow-lg outline-none" },
          this.props.header
            ? R(
                "div",
                { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-md" },
                R("h5", { className: "text-lg font-medium m-0", "data-testid": "modal-title" }, this.props.header),
                this.props.showCloseX
                  ? R("button", { type: "button", className: CLOSE_BUTTON_CLASSES, "aria-label": "Close", onClick: this.props.onClose }, "×")
                  : undefined,
              )
            : undefined,

          R(
            "div",
            {
              className: "p-4 flex-1",
              style: {
                maxHeight: window.innerHeight - (this.props.header ? 56 : 0) - (this.props.footer ? 65 : 0) - 30 - 30,
                overflowY: "auto"
              }
            },
            this.props.children
          ),
          this.props.footer
            ? R("div", { className: "flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 rounded-b-md" }, this.props.footer)
            : undefined,

          !this.props.header && this.props.showCloseX
            ? R(
                "button",
                { className: CLOSE_BUTTON_CLASSES, "aria-label": "Close", onClick: this.props.onClose, style: { position: "absolute", right: 10, top: 10 } }, // Put above body
                "×"
              )
            : undefined
        )
      )
    )
  }
}
