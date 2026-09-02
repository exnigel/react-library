"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importDefault(require("react"));
const R = react_1.default.createElement;
// Feature 6.4b: migrated from Bootstrap's `.nav.nav-tabs`/`.nav-item`/`.nav-link`/`.btn-link`
// classes to Tailwind, approximating Bootstrap's tab look (overlapping bottom border via
// `-mb-px`, active tab's border/background matching the container's bottom border).
// Feature 12.1/12.2: raw `gray-*`/`white` classes replaced with the semantic tokens
// app/tailwind.css defines -- `border-b-white` in particular relied on the panel below always
// being literally white to visually "erase" that border, which broke once dark mode made surfaces
// dark; `border-b-surface` tracks whatever the real panel background is in either mode. NOT
// live-verified against the real running app -- confirmed via grep that no file in mwater-forms's
// app/ or src/ actually imports TabbedComponent, so this mechanical substitution follows the same
// pattern already verified live on Button/Select/ModalPopupComponent, but couldn't be re-verified
// in a browser the way those could.
const NAV_LINK_BASE = "inline-block -mb-px px-4 py-2 border border-transparent rounded-t cursor-pointer hover:border-border";
const NAV_LINK_ACTIVE = `${NAV_LINK_BASE} text-ink bg-surface border-border-strong border-b-surface`;
/** Simple bootstrap tabbed component */
class TabbedComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleClick = (tabId) => {
            if (this.props.onTabClick != null) {
                return this.props.onTabClick(tabId);
            }
            else {
                return this.setState({ tabId });
            }
        };
        this.handleRemove = (tab, ev) => {
            ev.stopPropagation();
            return tab.onRemove();
        };
        this.renderTab = (tab) => {
            let tabId;
            if (this.props.tabId != null) {
                ;
                ({ tabId } = this.props);
            }
            else {
                ;
                ({ tabId } = this.state);
            }
            return R("li", { key: tab.id }, R("a", {
                onClick: this.handleClick.bind(null, tab.id),
                style: { cursor: "pointer" },
                className: tabId === tab.id ? NAV_LINK_ACTIVE : NAV_LINK_BASE
            }, tab.label, tab.onRemove
                ? R("button", {
                    type: "button",
                    className: "inline-flex items-center px-1 py-0.5 text-sm bg-transparent border-0 text-primary hover:opacity-75 cursor-pointer",
                    onClick: this.handleRemove.bind(null, tab)
                }, R("span", { className: "fa fa-times" }))
                : undefined));
        };
        this.state = { tabId: this.props.initialTabId };
    }
    render() {
        let tabId;
        if (this.props.tabId != null) {
            ;
            ({ tabId } = this.props);
        }
        else {
            ;
            ({ tabId } = this.state);
        }
        const currentTab = lodash_1.default.findWhere(this.props.tabs, { id: tabId });
        return R("div", null, R("ul", { key: "tabs", className: "flex flex-wrap list-none border-b border-border-strong m-0 p-0", style: { marginBottom: 10 } }, lodash_1.default.map(this.props.tabs, this.renderTab), this.props.onAddTab
            ? R("li", { key: "_add" }, R("a", { className: NAV_LINK_BASE, onClick: this.props.onAddTab, style: { cursor: "pointer" } }, R("i", { className: "fa fa-plus" })))
            : undefined), R("div", { key: "currentTab" }, currentTab ? currentTab.elem : undefined));
    }
}
exports.default = TabbedComponent;
