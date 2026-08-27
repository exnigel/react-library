import React, { ReactNode } from "react";
export interface PopupHelpComponentProps {
    children?: ReactNode;
}
/** Shows a popup when help icon is clicked. Needs bootstrap */
export default class PopoverHelpComponent extends React.Component<PopupHelpComponentProps, {
    open: boolean;
}> {
    constructor(props: PopupHelpComponentProps);
    handleOpen: () => void;
    handleClose: () => void;
    render(): React.JSX.Element;
}
