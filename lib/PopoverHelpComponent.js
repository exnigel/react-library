"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const popover_1 = __importDefault(require("bootstrap/js/dist/popover"));
// Feature 6.4b: NOT migrated off Bootstrap. Unlike this codebase's other components, this one
// uses `bootstrap/js/dist/popover` -- a real Bootstrap JS widget whose popup markup/styling
// (`.popover`, `.popover-body`, `.popover-arrow`) is generated internally by that widget, not by
// classnames in this file. Removing it means replacing the widget itself, not just swapping
// classes -- out of scope for 6.4b's classname migration. Still requires Bootstrap's CSS to be
// present wherever this component is used.
// @deprecated Feature 12.2: confirmed (grep, not assumed) unused anywhere in mwater-forms's
// app/, src/, test/, or stories/ -- its only real usage is react-library's own src/demo.tsx, a
// non-Storybook internal demo harness, and that call site is already commented out there.
// Real Bootstrap CSS is no longer loaded by mwater-forms at all (removed in Feature 6.4d), so
// this component's popup would render completely unstyled if it were ever wired up in that app.
// Per Feature 12.1/FEATURE_MAP_AND_MILESTONES.md's own explicit choice ("reimplement without
// Bootstrap, or formally deprecate") -- formally deprecated rather than redesigned, since
// building a real non-Bootstrap popover widget for zero live consumers isn't a good use of this
// redesign's effort. Left otherwise untouched; a future real consumer should get a proper
// Tailwind-native popover instead of reviving this one.
/** Shows a popover when help icon is clicked. Needs bootstrap */
class PopoverHelpComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.divRef = (el) => {
            if (el) {
                // Create div with content
                const contentDiv = document.createElement("div");
                react_dom_1.default.render(this.props.children, contentDiv);
                new popover_1.default(el, {
                    content: contentDiv,
                    trigger: this.props.trigger || "hover",
                    placement: this.props.placement || "top",
                    html: true
                });
            }
        };
    }
    render() {
        return react_1.default.createElement("span", { ref: this.divRef }, this.props.content ?
            this.props.content :
            react_1.default.createElement("span", { className: "text-secondary", style: { cursor: "pointer" } },
                react_1.default.createElement("i", { className: "fa fa-question-circle" })));
    }
}
exports.default = PopoverHelpComponent;
