import React from "react";
export interface AutoSizeComponentProps {
    /** True to inject width */
    injectWidth?: boolean;
    /** True to inject height */
    injectHeight?: boolean;
    children?: (size: {
        width?: number;
        height?: number;
    }) => React.ReactElement<any>;
}
export default class AutoSizeComponent extends React.Component<AutoSizeComponentProps> {
    render(): React.FunctionComponentElement<AutoSizeComponentProps>;
}
