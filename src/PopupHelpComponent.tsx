import React, { ReactNode } from "react"
import ModalPopupComponent from "./ModalPopupComponent"

export interface PopupHelpComponentProps {
  children?: ReactNode
}

/** Shows a popup when help icon is clicked. Needs bootstrap */
export default class PopoverHelpComponent extends React.Component<PopupHelpComponentProps, { open: boolean }> {
  constructor(props: PopupHelpComponentProps) {
    super(props)

    this.state = { open: false }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }
  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    return (
      <div style={{ display: "inline-block" }}>
        {this.state.open ? (
          <ModalPopupComponent showCloseX={true} onClose={this.handleClose} size="large">
            {this.props.children}
          </ModalPopupComponent>
        ) : null}
        {/* Feature 6.4b: was Bootstrap's `text-muted` */}
        <i className="text-secondary fa fa-question-circle" style={{ cursor: "pointer" }} onClick={this.handleOpen} />
      </div>
    )
  }
}
