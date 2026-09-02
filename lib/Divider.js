"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
// Divider
//
// Internally used by SplitPane to create the draggable divider between 2 panes
//
// Vertical splitpane divider gets the classes "divider vertical"
// Horizontal splitpane divider gets the classes "divider horizontal"
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
class Divider extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.onMouseDown = (event) => {
            return this.props.onMouseDown(event);
        };
    }
    render() {
        const classNames = ["divider"];
        // Feature 12.1/12.2: was a hardcoded #aeaeae. NOT live-verified against the real running
        // app -- confirmed via grep that no file in mwater-forms's app/ or src/ imports SplitPane.
        const style = {
            backgroundColor: "var(--color-border-strong)"
        };
        if (this.props.split === "horizontal") {
            classNames.push("horizontal");
            style.height = 4;
            style.cursor = "row-resize";
        }
        else {
            classNames.push("vertical");
            style.width = 4;
            style.cursor = "col-resize";
        }
        return R("div", { className: classNames.join(" "), onMouseDown: this.onMouseDown });
    }
}
exports.default = Divider;
