"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_resize_detector_1 = require("react-resize-detector");
const R = react_1.default.createElement;
// react-resize-detector v12 dropped its old render-prop component (`withPolyfill`) entirely in
// favor of a hook-only API (`useResizeDetector`) -- a class component can't call a hook directly,
// so this small function component wraps it and AutoSizeComponent's class below delegates to it,
// keeping the exact same public API/behavior (injectWidth/injectHeight, children as a function or
// a single child element) for every existing caller.
function AutoSizeInner({ injectWidth, injectHeight, children }) {
    const { width, height, ref } = (0, react_resize_detector_1.useResizeDetector)({ handleWidth: injectWidth, handleHeight: injectHeight });
    let innerElem;
    const style = {};
    if (injectWidth) {
        style.width = "100%";
    }
    if (injectHeight) {
        style.height = "100%";
    }
    // Return placeholder until width/height known
    if (width == null || height == null) {
        return R("div", { style, ref });
    }
    const overrides = {};
    if (injectWidth) {
        overrides.width = width;
    }
    if (injectHeight) {
        overrides.height = height;
    }
    if (typeof children === "function") {
        innerElem = children(overrides);
    }
    else {
        // DEPRECATED
        innerElem = react_1.default.cloneElement(react_1.default.Children.only(children), overrides);
    }
    return R("div", { style, ref }, innerElem);
}
// Automatically injects the width or height of the DOM element into the
// child component, updating as window resizes.
// If children is a function, calls with with { width:,  height: } depending on injectHeight or injectWidth
class AutoSizeComponent extends react_1.default.Component {
    render() {
        return R(AutoSizeInner, this.props);
    }
}
exports.default = AutoSizeComponent;
