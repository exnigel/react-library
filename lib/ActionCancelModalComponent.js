"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
const ModalPopupComponent_1 = __importDefault(require("./ModalPopupComponent"));
// Feature 6.4b: migrated from Bootstrap's `btn btn-{type}`/`me-auto` classes to Tailwind,
// matching bootstrap.tsx's `Button` component's own recipe for visual consistency.
const BTN_BASE = "inline-block text-center align-middle cursor-pointer select-none border rounded transition-colors hover:opacity-90 disabled:opacity-65 disabled:cursor-not-allowed px-3 py-1.5 text-base";
// Modal with action and cancel buttons
class ActionCancelModalComponent extends react_1.default.Component {
    render() {
        return react_1.default.createElement(ModalPopupComponent_1.default, {
            size: this.props.size,
            header: this.props.title,
            footer: [
                this.props.onDelete
                    ? R("button", {
                        key: "delete",
                        type: "button",
                        onClick: this.props.onDelete,
                        className: `${BTN_BASE} bg-danger border-danger text-white mr-auto`
                    }, this.props.deleteBusy ? [R("i", { className: "fa fa-spinner fa-spin" }), "\u00A0"] : undefined, this.props.deleteLabel || "Delete")
                    : undefined,
                this.props.onAction
                    ? R("button", {
                        key: "action",
                        type: "button",
                        onClick: this.props.onAction,
                        disabled: this.props.actionBusy,
                        className: `${BTN_BASE} bg-primary border-primary text-white`
                    }, this.props.actionBusy ? [R("i", { className: "fa fa-spinner fa-spin" }), "\u00A0"] : undefined, this.props.actionLabel || "Save")
                    : undefined,
                R("button", {
                    key: "cancel",
                    type: "button",
                    onClick: this.props.onCancel,
                    className: `${BTN_BASE} bg-secondary border-secondary text-white`
                }, this.props.cancelLabel || (this.props.onAction ? "Cancel" : "Close")),
            ]
        }, this.props.children);
    }
}
exports.default = ActionCancelModalComponent;
