import React from "react";
export default class Pane extends React.Component<{
    split?: "vertical" | "horizontal";
    width?: number | string;
    children?: React.ReactNode;
}> {
    static defaultProps: {
        split: "vertical";
    };
    render(): React.DetailedReactHTMLElement<{
        style: React.CSSProperties;
        className: string;
    }, HTMLElement>;
}
