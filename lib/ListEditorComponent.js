"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEditorComponent = void 0;
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const ActionCancelModalComponent_1 = __importDefault(require("./ActionCancelModalComponent"));
const ReorderableListComponent_1 = __importDefault(require("./reorderable/ReorderableListComponent"));
/** Generic editor for a list of items that shows the items within a Bootstrap 3 list-group.
 * Adding and editing are done via a popup if present
 */
function ListEditorComponent(props) {
    const [adding, setAdding] = (0, react_1.useState)();
    const [editing, setEditing] = (0, react_1.useState)();
    const [editingIndex, setEditingIndex] = (0, react_1.useState)();
    const handleAdd = (ev) => {
        ev.stopPropagation();
        if (props.renderEditor != null) {
            setAdding(props.createNew());
        }
        else {
            props.onItemsChange(props.items.concat(props.createNew()));
        }
    };
    const handleDelete = (index, ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        // Confirm deletion
        if (props.deleteConfirmPrompt) {
            const prompt = (typeof props.deleteConfirmPrompt === "string") ? props.deleteConfirmPrompt : props.deleteConfirmPrompt(props.items[index]);
            if (!confirm(prompt)) {
                return;
            }
        }
        const items = props.items.slice();
        items.splice(index, 1);
        props.onItemsChange(items);
    };
    /** Render as an li element */
    const renderListItem = (item, index) => {
        const handleChange = (value) => {
            const items = props.items.slice();
            items[index] = value;
            props.onItemsChange(items);
        };
        const handleClick = () => {
            if (props.renderEditor != null) {
                setEditing(item);
                setEditingIndex(index);
            }
        };
        // Feature 6.4b: was Bootstrap's `.list-group-item`/`.active` (with `var(--bs-primary)`/
        // `var(--bs-list-group-active-color)`, both Bootstrap-defined vars no longer present).
        const isActive = props.selectedIndex === index;
        const linkColor = isActive ? "#fff" : "var(--color-primary)";
        return (react_2.default.createElement("li", { className: isActive ? "px-4 py-2 border-b border-gray-300 last:border-b-0 bg-primary text-white" : "px-4 py-2 border-b border-gray-300 last:border-b-0 bg-white", onClick: props.editLink ? undefined : handleClick, key: index },
            react_2.default.createElement("a", { onClick: handleDelete.bind(null, index), style: { float: "right", cursor: "pointer", color: linkColor } },
                react_2.default.createElement("i", { className: "fa fa-remove" })),
            props.editLink && props.renderEditor != null ? (react_2.default.createElement("a", { onClick: handleClick, style: { float: "right", cursor: "pointer", color: linkColor, marginRight: 5 } },
                react_2.default.createElement("i", { className: "fa fa-pencil" }))) : null,
            props.renderItem(item, index, handleChange)));
    };
    /** Render as an li element */
    const renderDraggableListItem = (item, index, connectDragSource, connectDragPreview, connectDropTarget) => {
        let elem = renderListItem(item, index);
        elem = connectDragSource(elem);
        elem = connectDragPreview(elem);
        elem = connectDropTarget(elem);
        return elem;
    };
    return (react_2.default.createElement("div", null,
        adding && props.renderEditor != null ? (react_2.default.createElement(ActionCancelModalComponent_1.default, { size: "large", actionLabel: "Add", onCancel: () => setAdding(undefined), onAction: () => {
                if (props.validateItem != null && !props.validateItem(adding)) {
                    return;
                }
                props.onItemsChange(props.items.concat([adding]));
                setAdding(undefined);
            } }, props.renderEditor(adding, setAdding))) : null,
        editing != null && props.renderEditor != null ? (react_2.default.createElement(ActionCancelModalComponent_1.default, { size: "large", onCancel: () => setEditing(undefined), onAction: () => {
                if (props.validateItem != null && !props.validateItem(editing)) {
                    return;
                }
                const items = props.items.slice();
                items.splice(editingIndex, 1, editing);
                props.onItemsChange(items);
                setEditing(undefined);
            } }, props.renderEditor(editing, setEditing))) : null,
        props.getReorderableKey ? (react_2.default.createElement(ReorderableListComponent_1.default, { items: props.items, getItemId: props.getReorderableKey, onReorder: props.onItemsChange, renderItem: renderDraggableListItem, element: react_2.default.createElement("ul", { className: "flex flex-col rounded-md overflow-hidden border border-gray-300" }) })) : (react_2.default.createElement("ul", { className: "flex flex-col rounded-md overflow-hidden border border-gray-300" }, props.items.map(renderListItem))),
        props.createNew ? (react_2.default.createElement("div", { key: "add" },
            react_2.default.createElement("button", { type: "button", className: "inline-flex items-center bg-transparent border-0 text-primary hover:opacity-75 cursor-pointer", onClick: handleAdd },
                react_2.default.createElement("i", { className: "fa fa-plus" }),
                " ",
                props.addLabel || "Add"))) : null));
}
exports.ListEditorComponent = ListEditorComponent;
