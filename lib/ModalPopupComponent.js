"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const R = react_1.default.createElement;
const lodash_1 = __importDefault(require("lodash"));
// Modal popup based on react
class ModalPopupComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        // Add special region to body
        this.modalNode = document.createElement("div");
        // append is not supported everywhere https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append#Browser_compatibility
        if (document.fullscreenElement) {
            document.fullscreenElement.appendChild(this.modalNode);
        }
        else {
            document.body.appendChild(this.modalNode);
        }
    }
    componentWillUnmount() {
        return this.modalNode.remove();
    }
    render() {
        return react_dom_1.default.createPortal(R(InnerModalComponent, this.props), this.modalNode);
    }
}
exports.default = ModalPopupComponent;
/** Render something into a top-level div */
ModalPopupComponent.show = (modalFunc, onClose) => {
    // Create temporary div to render into
    const tempDiv = document.createElement("div");
    // Create close function
    const close = () => {
        // Unrender
        react_dom_1.default.unmountComponentAtNode(tempDiv);
        // Remove div
        tempDiv.remove();
        // Call onClose
        if (onClose) {
            return onClose();
        }
    };
    const popupElem = modalFunc(close);
    return react_dom_1.default.render(popupElem, tempDiv);
};
// Feature 6.4b: migrated from Bootstrap's `.modal`/`.modal-dialog`/`.modal-content`/etc. classes
// to Tailwind utilities. `.modal`'s own fixed/inset/z-index positioning (previously provided
// entirely by Bootstrap's stylesheet -- this component's own `rootStyle` only ever set
// `display`) now needs to be explicit. `.btn-close` (an empty button styled via a CSS
// background-image X icon) is replaced with a real "×" character, since there's no equivalent
// utility-only icon.
const CLOSE_BUTTON_CLASSES = "inline-flex items-center justify-center w-6 h-6 text-xl leading-none bg-transparent border-0 rounded opacity-50 hover:opacity-75 cursor-pointer";
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Content must be rendered at body level to prevent weird behaviour, so this is the inner component
class InnerModalComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.dialogRef = react_1.default.createRef();
        this.titleId = lodash_1.default.uniqueId("modal-title-");
        this.handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (this.props.onClose) {
                    this.props.onClose();
                }
                return;
            }
            if (e.key === "Tab" && this.dialogRef.current) {
                const focusable = Array.from(this.dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
                if (focusable.length === 0) {
                    // Nothing focusable inside -- keep focus pinned on the dialog itself rather than let Tab
                    // escape into the page behind the overlay.
                    e.preventDefault();
                    return;
                }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement;
                if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                }
                else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
    }
    // Feature 12.6: a modal previously had no keyboard-accessible way to close (only a mouse click
    // on the backdrop or an explicit Close-X/Cancel button -- and per this component's own callers,
    // several never set `showCloseX` at all), no initial focus placed inside it (a keyboard user
    // tabbing when a modal opened would still be somewhere in the now-hidden-behind-the-overlay page),
    // and no focus trap (Tab could walk out of the modal into that same background content, which is
    // still visible and technically still in the tab order despite the overlay). Fixed at this one
    // shared primitive rather than per-caller, since every real modal in mwater-forms goes through it.
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        // Focus the dialog container itself (tabIndex=-1, not a specific child) rather than guessing
        // which child is "the first focusable one" -- this component's children vary per caller (a
        // form, a confirmation message, a picker), so the dialog itself is the one reliable target.
        if (this.dialogRef.current) {
            this.dialogRef.current.focus();
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    render() {
        let dialogStyle;
        let dialogSizeClass = "sm:max-w-[500px]";
        if (this.props.size === "large") {
            dialogSizeClass = "sm:max-w-[800px]";
        }
        if (this.props.size === "small") {
            dialogSizeClass = "sm:max-w-[300px]";
        }
        else if (this.props.size === "x-large") {
            dialogSizeClass = "sm:max-w-[1140px]";
        }
        else if (this.props.size === "full") {
            dialogStyle = { maxWidth: "95%" };
        }
        if (this.props.width) {
            dialogStyle = { width: this.props.width };
        }
        const rootStyle = {
            display: "block"
        };
        const overlayStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)"
        };
        return R("div", { style: rootStyle, className: "fixed inset-0 z-[1055] overflow-y-auto outline-none" }, R("style", null, "body { overflow-y: hidden }"), R("div", { style: overlayStyle, onClick: this.props.onClose }), R("div", { className: `relative mx-auto my-8 w-[calc(100%-1rem)] ${dialogSizeClass}`, style: dialogStyle }, R("div", {
            // Feature 12.1's "Slate instrument" system is borders-only for elevation (no
            // box-shadow anywhere -- shadows wash out in direct sunlight), so a modal's separation
            // from the page relies on `border-strong` alone, not a dropped shadow.
            className: "relative flex flex-col w-full bg-surface text-ink border border-border-strong rounded-md outline-none",
            ref: this.dialogRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": this.props.header ? this.titleId : undefined,
            tabIndex: -1
        }, this.props.header
            ? R("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border rounded-t-md" }, R("h5", { id: this.titleId, className: "text-lg font-medium m-0", "data-testid": "modal-title" }, this.props.header), this.props.showCloseX
                ? R("button", { type: "button", className: CLOSE_BUTTON_CLASSES, "aria-label": "Close", onClick: this.props.onClose }, "×")
                : undefined)
            : undefined, R("div", {
            className: "p-4 flex-1",
            style: {
                maxHeight: window.innerHeight - (this.props.header ? 56 : 0) - (this.props.footer ? 65 : 0) - 30 - 30,
                overflowY: "auto"
            }
        }, this.props.children), this.props.footer
            ? R("div", { className: "flex items-center justify-end gap-2 px-4 py-3 border-t border-border rounded-b-md" }, this.props.footer)
            : undefined, !this.props.header && this.props.showCloseX
            ? R("button", { className: CLOSE_BUTTON_CLASSES, "aria-label": "Close", onClick: this.props.onClose, style: { position: "absolute", right: 10, top: 10 } }, // Put above body
            "×")
            : undefined)));
    }
}
