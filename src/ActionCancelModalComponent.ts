import React from "react"
const R = React.createElement
import _ from "lodash"
import ModalPopupComponent from "./ModalPopupComponent"

export interface ActionCancelModalComponentProps {
  /** Title of modal */
  title?: React.ReactNode
  /** Action button. Defaults to "Save" */
  actionLabel?: React.ReactNode
  /** Cancel button. Defaults to "Cancel" if action, "Close" otherwise */
  cancelLabel?: React.ReactNode
  /** Label of delete button. Default "Delete" */
  deleteLabel?: React.ReactNode
  /** Called when action button is clicked */
  onAction?: () => void
  /** Called when cancel is clicked */
  onCancel?: () => void
  /** Big red destuctive action in footer. Not present if null */
  onDelete?: () => void
  /** "large" for large, "full" for full width */
  size?: "large" | "x-large" | "full"
  /** True for action button to show spinner and be disabled */
  actionBusy?: boolean
  /** True for delete button to show spinner and be disabled */
  deleteBusy?: boolean
  children?: React.ReactNode
}

// Feature 6.4b: migrated from Bootstrap's `btn btn-{type}`/`me-auto` classes to Tailwind,
// matching bootstrap.tsx's `Button` component's own recipe for visual consistency.
const BTN_BASE =
  "inline-block text-center align-middle cursor-pointer select-none border rounded transition-colors hover:opacity-90 disabled:opacity-65 disabled:cursor-not-allowed px-3 py-1.5 text-base"

// Modal with action and cancel buttons
export default class ActionCancelModalComponent extends React.Component<ActionCancelModalComponentProps> {
  render() {
    return React.createElement(
      ModalPopupComponent,
      {
        size: this.props.size,
        header: this.props.title,
        footer: [
          this.props.onDelete
            ? R(
                "button",
                {
                  key: "delete",
                  type: "button",
                  onClick: this.props.onDelete,
                  className: `${BTN_BASE} bg-danger border-danger text-on-danger mr-auto`
                },
                this.props.deleteBusy ? [R("i", { className: "fa fa-spinner fa-spin" }), "\u00A0"] : undefined,
                this.props.deleteLabel || "Delete"
              )
            : undefined,
          this.props.onAction
            ? R(
                "button",
                {
                  key: "action",
                  type: "button",
                  onClick: this.props.onAction,
                  disabled: this.props.actionBusy,
                  className: `${BTN_BASE} bg-primary border-primary text-on-primary`
                },
                this.props.actionBusy ? [R("i", { className: "fa fa-spinner fa-spin" }), "\u00A0"] : undefined,
                this.props.actionLabel || "Save"
              )
            : undefined,
          R(
            "button",
            {
              key: "cancel",
              type: "button",
              onClick: this.props.onCancel,
              className: `${BTN_BASE} bg-secondary border-secondary text-on-secondary`
            },
            this.props.cancelLabel || (this.props.onAction ? "Cancel" : "Close")
          ),
        ]
      },
      this.props.children
    )
  }
}
