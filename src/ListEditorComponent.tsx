import { ReactNode, useState } from "react"
import React from "react"
import ActionCancelModal from "./ActionCancelModalComponent"
import ReorderableListComponent from "./reorderable/ReorderableListComponent"

/** Generic editor for a list of items that shows the items within a Bootstrap 3 list-group.
 * Adding and editing are done via a popup if present
 */
export function ListEditorComponent<T>(props: {
  items: T[]
  onItemsChange: (items: T[]) => void

  /** Render the item in the list. Already inside a list-group-item */
  renderItem: (item: T, index: number, onItemChange: (item: T) => void) => ReactNode

  /** Render the editor in the popup modal */
  renderEditor?: (item: Partial<T>, onItemChange: (item: Partial<T>) => void) => ReactNode

  /** Create a new item. Doesn't allow add if not present. If editor not present, must return valid item */
  createNew?: () => Partial<T>

  /** Validate an item. True for valid */
  validateItem?: (item: Partial<T>) => boolean

  /** Override label of add button */
  addLabel?: string

  /** Prompt to confirm deletion */
  deleteConfirmPrompt?: string | ((item: T) => string)

  /** Allows list to be re-ordered by dragging. Returns unique key for each item.
   * Can just return index for simplicity.
   */
  getReorderableKey?: (item: T, index: number) => any

  /** Puts an edit on the right which must be clicked to edit */
  editLink?: boolean

  /** Selected item is highlighted */
  selectedIndex?: number
}) {
  const [adding, setAdding] = useState<Partial<T>>()
  const [editing, setEditing] = useState<Partial<T>>()
  const [editingIndex, setEditingIndex] = useState<number>()

  const handleAdd = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation()

    if (props.renderEditor != null) {
      setAdding(props.createNew!())
    } else {
      props.onItemsChange(props.items.concat(props.createNew!() as T))
    }
  }

  const handleDelete = (index: number, ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.stopPropagation()
    ev.preventDefault()

    // Confirm deletion
    if (props.deleteConfirmPrompt) {
      const prompt = (typeof props.deleteConfirmPrompt === "string") ? props.deleteConfirmPrompt : props.deleteConfirmPrompt(props.items[index])
      if (!confirm(prompt)) {
        return
      }
    }

    const items = props.items.slice()
    items.splice(index, 1)
    props.onItemsChange(items)
  }

  /** Render as an li element */
  const renderListItem = (item: T, index: number) => {
    const handleChange = (value: T) => {
      const items = props.items.slice()
      items[index] = value
      props.onItemsChange(items)
    }

    const handleClick = () => {
      if (props.renderEditor != null) {
        setEditing(item)
        setEditingIndex(index)
      }
    }

    // Feature 6.4b: was Bootstrap's `.list-group-item`/`.active` (with `var(--bs-primary)`/
    // `var(--bs-list-group-active-color)`, both Bootstrap-defined vars no longer present).
    // Feature 12.1/12.2: `linkColor`'s hardcoded "#fff" assumed the active row's text is always
    // white -- true only in the old light-mode-only palette. `--color-on-primary` is the correct,
    // mode-adaptive equivalent (dark text in dark mode, since dark-mode's primary fill is a light
    // pastel). NOT live-verified against the real running app -- confirmed via grep that no file
    // in mwater-forms's app/ or src/ imports ListEditorComponent.
    const isActive = props.selectedIndex === index
    const linkColor = isActive ? "var(--color-on-primary)" : "var(--color-primary)"
    return (
      <li
        className={isActive ? "px-4 py-2 border-b border-border last:border-b-0 bg-primary text-on-primary" : "px-4 py-2 border-b border-border last:border-b-0 bg-surface text-ink"}
        onClick={props.editLink ? undefined : handleClick}
        key={index}
      >
        <a
          onClick={handleDelete.bind(null, index)}
          style={{ float: "right", cursor: "pointer", color: linkColor }}
        >
          <i className="fa fa-remove" />
        </a>
        {props.editLink && props.renderEditor != null ? (
          <a onClick={handleClick} style={{ float: "right", cursor: "pointer", color: linkColor, marginRight: 5 }}>
            <i className="fa fa-pencil" />
          </a>
        ) : null}
        {props.renderItem(item, index, handleChange)}
      </li>
    )
  }

  /** Render as an li element */
  const renderDraggableListItem = (
    item: T,
    index: number,
    connectDragSource: (node: ReactNode) => ReactNode,
    connectDragPreview: (node: ReactNode) => ReactNode,
    connectDropTarget: (node: ReactNode) => ReactNode
  ) => {
    let elem: ReactNode = renderListItem(item, index)
    elem = connectDragSource(elem)
    elem = connectDragPreview(elem)
    elem = connectDropTarget(elem)
    return elem
  }

  return (
    <div>
      {adding && props.renderEditor != null ? (
        <ActionCancelModal
          size="large"
          actionLabel="Add"
          onCancel={() => setAdding(undefined)}
          onAction={() => {
            if (props.validateItem != null && !props.validateItem(adding)) {
              return
            }
            props.onItemsChange(props.items.concat([adding as T]))
            setAdding(undefined)
          }}
        >
          {props.renderEditor(adding, setAdding)}
        </ActionCancelModal>
      ) : null}
      {editing != null && props.renderEditor != null ? (
        <ActionCancelModal
          size="large"
          onCancel={() => setEditing(undefined)}
          onAction={() => {
            if (props.validateItem != null && !props.validateItem(editing)) {
              return
            }
            const items = props.items.slice()
            items.splice(editingIndex!, 1, editing as T)
            props.onItemsChange(items)
            setEditing(undefined)
          }}
        >
          {props.renderEditor(editing, setEditing)}
        </ActionCancelModal>
      ) : null}
      {props.getReorderableKey ? (
        <ReorderableListComponent
          items={props.items}
          getItemId={props.getReorderableKey}
          onReorder={props.onItemsChange}
          renderItem={renderDraggableListItem}
          element={<ul className="flex flex-col rounded-md overflow-hidden border border-border-strong" />}
        />
      ) : (
        <ul className="flex flex-col rounded-md overflow-hidden border border-border-strong">{props.items.map(renderListItem)}</ul>
      )}
      {props.createNew ? (
        <div key="add">
          <button type="button" className="inline-flex items-center bg-transparent border-0 text-primary hover:opacity-75 cursor-pointer" onClick={handleAdd}>
            <i className="fa fa-plus" /> {props.addLabel || "Add"}
          </button>
        </div>
      ) : null}
    </div>
  )
}
