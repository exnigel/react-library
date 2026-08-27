import _ from "lodash"
import classnames from "classnames"
import React, { CSSProperties, ReactNode, useState } from "react"
const R = React.createElement

// Feature 6.4b: migrated from Bootstrap classes to Tailwind utilities (mwater-forms's
// FEATURE_MAP_AND_MILESTONES.md, Feature 6.4). A few deliberate approximations, not pixel-perfect
// Bootstrap replication:
// - Hover/darken states use `hover:opacity-90` rather than Bootstrap's actual darkened shade
//   (e.g. btn-primary:hover's #0b5ed7) -- correct family of color, not the exact same hex.
// - `.btn-group`'s connected/shared-border look (no gap, shared corners between buttons) is
//   approximated as a plain `inline-flex` with a small gap, not replicated exactly.
// - `.form-check`/checkbox/radio inputs keep their native browser appearance (not Bootstrap's
//   custom SVG-background square/circle) with Tailwind's `accent-*` utility for the checked-state
//   color -- visually close, not identical across browsers.
// - `.form-select`'s custom chevron background-image is skipped; the native `<select>` arrow
//   renders instead.
// Bootstrap's spacer scale (0.25/0.5/1/1.5/3rem for 1-5) does NOT numerically match Tailwind's
// own (0.25rem per unit) -- e.g. Bootstrap's `mb-3` (1rem) is Tailwind's `mb-4`, not `mb-3`.
// Every spacing utility below was converted through that mapping, not copied by number.

// Bootstrap components

/** Simple spinner */
export function Spinner() {
  return R("i", { className: "fa fa-spinner fa-spin" })
}

/** Standard button */
export class Button extends React.Component<{
  /** "default" gets mapped to "secondary" */
  type: string // e.g. "primary"
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  /** xs is deprecated. TODO how to handle */
  size?: "sm" | "xs" | "lg"
  children?: ReactNode
}> {
  static defaultProps = { type: "secondary" }

  // btn-{type} -> a solid bg/border/text combo per Bootstrap type, using the color tokens
  // app/tailwind.css defines to match this app's real Bootstrap palette exactly. warning/info/
  // light use dark text (poor contrast with white on those lighter backgrounds), matching
  // Bootstrap's own behavior.
  static typeClasses: Record<string, string> = {
    primary: "bg-primary border-primary text-white",
    secondary: "bg-secondary border-secondary text-white",
    success: "bg-success border-success text-white",
    danger: "bg-danger border-danger text-white",
    warning: "bg-warning border-warning text-dark",
    info: "bg-info border-info text-dark",
    light: "bg-light border-light text-dark",
    dark: "bg-dark border-dark text-white"
  }

  render() {
    const type = this.props.type == "default" ? "secondary" : this.props.type
    const size = this.props.size == "xs" ? "sm" : this.props.size

    return R(
      "button",
      {
        type: "button",
        className: classnames(
          "inline-block text-center align-middle cursor-pointer select-none border rounded transition-colors hover:opacity-90 disabled:opacity-65 disabled:cursor-not-allowed",
          Button.typeClasses[type] || Button.typeClasses.secondary,
          { "inset-shadow-sm": this.props.active },
          size === "sm" ? "px-2 py-1 text-sm rounded" : size === "lg" ? "px-4 py-2 text-lg rounded-lg" : "px-3 py-1.5 text-base"
        ),
        onClick: this.props.onClick,
        disabled: this.props.disabled
      },
      this.props.children
    )
  }
}

/** Icon, font-awesome v4 */
export class Icon extends React.Component<{ id: string }> {
  render() {
    if (this.props.id.match(/^fa-/)) {
      return R("i", { className: `fa ${this.props.id}` })
    } else {
      return null
    }
  }
}

/** Indented form group with a label, optional help text. Label and indented contents */
export class FormGroup extends React.Component<{
  /** Label to display */
  label: ReactNode
  /** True to mute label */
  labelMuted?: boolean
  /** Hint to append to label. Makes label faded if only hint presented */
  hint?: ReactNode
  /** Help block at bottom */
  help?: ReactNode
  /** @deprecated True to display as success */
  hasSuccess?: boolean
  /** @deprecated True to display as warning */
  hasWarnings?: boolean
  /** @deprecated True to display as error */
  hasErrors?: boolean
  children?: ReactNode
}> {
  render() {
    return R(
      "div",
      { className: "mb-4" },
      R(
        "label",
        { key: "label" },
        this.props.labelMuted ? R("span", { className: "text-secondary" }, this.props.label) : this.props.label,

        this.props.hint
          ? R(
              "span",
              { className: "text-secondary", style: { fontWeight: this.props.label ? "normal" : undefined } },
              this.props.label ? " - " : undefined,
              this.props.hint
            )
          : undefined
      ),

      R("div", { key: "contents", style: { marginLeft: 5 } }, this.props.children),
      this.props.help
        ? R("p", { key: "help", className: "mt-1 text-sm text-secondary", style: { marginLeft: 5 } }, this.props.help)
        : undefined
    )
  }
}

/** Unique id sequence for making ids of elements in checkbox + radio */
let uniqueId = 0

export interface CheckboxProps {
  value: boolean | null | undefined
  onChange?: (value: boolean) => void
  inline?: boolean
  /** Uses null for false */
  nullForFalse?: boolean
  disabled?: boolean
  children?: ReactNode
}

export class Checkbox extends React.Component<CheckboxProps> {
  id: string

  constructor(props: CheckboxProps) {
    super(props)
    this.id = `id_${uniqueId}`
    uniqueId += 1
  }

  handleChange = (ev: any) => {
    if (this.props.nullForFalse) {
      return this.props.onChange!(ev.target.checked || null)
    } else {
      return this.props.onChange!(ev.target.checked)
    }
  }

  render() {
    return R(
      "div",
      { className: classnames("flex items-center gap-2 mb-0.5", { "inline-flex mr-4 mb-0": this.props.inline }) },
      R("input", {
        type: "checkbox",
        id: this.id,
        disabled: this.props.disabled,
        className: "w-4 h-4 accent-primary",
        checked: this.props.value || false,
        onChange: this.props.onChange ? this.handleChange : undefined
      }),
      R("label", { className: "cursor-pointer", htmlFor: this.id }, this.props.children)
    )
  }
}


export interface RadioProps {
  /** Value to display */
  value: any

  /** Value that radio button represents. If equal to value, button is checked */
  radioValue: any

  /** Called with radio value */
  onChange: (value: any) => void

  /** Makes horizontal */
  inline?: boolean

  disabled?: boolean

  children?: ReactNode
}

export class Radio extends React.Component<RadioProps> {
  id: string

  constructor(props: RadioProps) {
    super(props)
    this.id = `id_${uniqueId}`
    uniqueId += 1
  }

  render() {
    return R(
      "div",
      { className: classnames("flex items-center gap-2 mb-0.5", { "inline-flex mr-4 mb-0": this.props.inline }) },
      R("input", {
        type: "radio",
        className: "w-4 h-4 accent-primary",
        id: this.id,
        disabled: this.props.disabled,
        checked: this.props.value === this.props.radioValue,
        onChange() {}, // Do nothing
        onClick: this.props.onChange ? (ev) => this.props.onChange(this.props.radioValue) : undefined
      }),
      R("label", { className: "cursor-pointer", htmlFor: this.id }, this.props.children)
    )
  }
}

/** Select dropdown. Note: stringifies the value of the option so that null, strings, numbers, booleans etc.
 * all work as possible options.*/
export class Select<T> extends React.Component<{
  value: T | null
  onChange?: (value: T | null) => void
  options: Array<{ value: T | null; label: string }>
  size?: "lg" | "sm"
  nullLabel?: string
  style?: object
  inline?: boolean
}> {
  handleChange = (ev: any) => {
    const value = JSON.parse(ev.target.value)
    return this.props.onChange!(value)
  }

  render() {
    const options = this.props.options.slice()
    if (this.props.nullLabel != null) {
      options.unshift({ value: null, label: this.props.nullLabel })
    }

    let style = {}
    if (this.props.inline) {
      style = { width: "auto", display: "inline-block" }
    }
    _.extend(style, this.props.style || {})

    return R(
      "select",
      {
        style,
        disabled: this.props.onChange == null,
        className: classnames(
          "block w-full bg-white border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-65",
          this.props.size === "sm" ? "px-2 py-1 text-sm" : this.props.size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-base"
        ),
        value: JSON.stringify(this.props.value != null ? this.props.value : null),
        onChange: this.props.onChange ? this.handleChange : function () {}
      },
      _.map(options, (option) =>
        R("option", { key: JSON.stringify(option.value), value: JSON.stringify(option.value) }, option.label)
      )
    )
  }
}

export type TextInputProps = TextInputPropsNull | TextInputPropsNoNull

export interface TextInputPropsNoNull {
  value: string | null
  onChange?: (value: string) => void
  placeholder?: string
  size?: "sm" | "lg"
  emptyNull?: false
  style?: object
}

export interface TextInputPropsNull {
  value: string | null
  onChange?: (value: string | null) => void
  placeholder?: string
  size?: "sm" | "lg"
  emptyNull: true
  style?: object
}

export class TextInput extends React.Component<TextInputProps> {
  input?: HTMLInputElement | null

  handleChange = (ev: any) => {
    let { value } = ev.target
    if (this.props.emptyNull) {
      value = value || null
    }

    return this.props.onChange!(value)
  }

  focus() {
    return this.input?.focus()
  }

  render() {
    return R("input", {
      ref: (c: HTMLInputElement | null) => {
        return (this.input = c)
      },
      type: "text",
      className: classnames(
        "block w-full bg-white border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-65",
        this.props.size === "sm" ? "px-2 py-1 text-sm" : this.props.size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-base"
      ),
      value: this.props.value || "",
      style: this.props.style,
      onChange: this.props.onChange ? this.handleChange : undefined,
      placeholder: this.props.placeholder,
      disabled: this.props.onChange == null
    })
  }
}

export interface NumberInputProps {
  decimal: boolean
  value?: number | null
  onChange?: (value: number | null) => void
  style?: CSSProperties
  size?: "sm" | "lg"
  onTab?: (ev: React.KeyboardEvent<HTMLInputElement>) => void
  onEnter?: (ev: React.KeyboardEvent<HTMLInputElement>) => void
  /** Force an exact number of decimal places, rounding value as necessary */
  decimalPlaces?: number
  placeholder?: string
  min?: number // The minimum number allowed
  max?: number
}

// Number input component that handles parsing and maintains state when number is invalid
export class NumberInput extends React.Component<NumberInputProps, { inputText: string }> {
  input?: HTMLInputElement | null

  constructor(props: NumberInputProps) {
    super(props)

    // Parsing happens on blur
    this.state = {
      inputText: this.formatInput(props)
    }
  }

  componentWillReceiveProps(nextProps: any) {
    // If different, override text
    if (nextProps.value !== this.props.value) {
      return this.setState({ inputText: this.formatInput(nextProps) })
    }
  }

  // Format the input based on props
  formatInput(props: any) {
    // Blank
    if (props.value == null) {
      return ""
    }

    // Integer
    if (!props.decimal) {
      return "" + Math.floor(props.value)
    }

    // Decimal
    if (props.decimalPlaces != null) {
      return props.value.toFixed(props.decimalPlaces)
    }

    return "" + props.value
  }

  focus() {
    return this.input?.focus()
  }

  handleKeyDown = (ev: any) => {
    // When pressing ENTER or TAB
    if (ev.keyCode === 13) {
      // First parse value as if blur will be done
      this.handleBlur()

      if (this.props.onEnter) {
        this.props.onEnter(ev)
        ev.preventDefault()
      }
    }

    if (ev.keyCode === 9) {
      // First parse value as if blur will be done
      this.handleBlur()

      if (this.props.onTab) {
        this.props.onTab(ev)
        // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        return ev.preventDefault()
      }
    }
  }

  handleBlur = () => {
    // Parse and set value if valid
    if (this.isValid()) {
      const val = this.getNumericValue()
      if (val !== this.props.value) {
        return this.props.onChange?.(val)
      }
    }
  }

  getNumericValue = () => {
    let val = this.props.decimal ? parseFloat(this.state.inputText) : parseInt(this.state.inputText)
    if (isNaN(val)) {
      return null
    } else {
      // Round if necessary
      if (this.props.decimalPlaces != null) {
        val = parseFloat(val.toFixed(this.props.decimalPlaces))
      }
    }

    return val
  }

  // Check regex matching of numbers
  isValid() {
    let valid
    if (this.state.inputText.length === 0) {
      return true
    }

    if (this.props.decimal) {
      valid = this.state.inputText.match(/^-?[0-9]*\.?[0-9]+$/) && !isNaN(parseFloat(this.state.inputText))
      if (!valid) {
        return false
      }
    } else {
      valid = this.state.inputText.match(/^-?\d+$/)

      if (!valid) {
        return false
      }
    }

    const val = this.getNumericValue()

    if (val && this.props.max != null && val > this.props.max) {
      return false
    }

    if (val && this.props.min != null && val < this.props.min) {
      return false
    }

    return true
  }

  render() {
    // Display red border if not valid
    const style = _.clone(this.props.style || {})
    style.width = style.width || "8em"
    if (!this.isValid()) {
      style.borderColor = "#a94442"
      style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)"
      style.backgroundColor = "rgba(132, 53, 52, 0.12)" // Faded red
    }

    let inputType = this.props.decimal ? "number" : "tel"

    // Special problem with Galaxy Tab 3V (SM-T116NU) missing decimal place
    if (this.props.decimal && navigator.userAgent.match(/SM-/)) {
      inputType = "text"
    }

    return R("input", {
      ref: (c) => {
        return (this.input = c)
      },
      type: inputType,
      className: classnames(
        "block w-full bg-white border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-65",
        this.props.size === "sm" ? "px-2 py-1 text-sm" : this.props.size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-base"
      ),
      lang: "en",
      style,
      value: this.state.inputText,
      onChange: this.props.onChange ? (ev) => this.setState({ inputText: ev.target.value }) : function () {},
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown,
      placeholder: this.props.placeholder,
      disabled: this.props.onChange == null
    })
  }
}

export interface CollapsibleSectionProps {
  initiallyOpen?: boolean

  /** Label to display */
  label: ReactNode

  /** True to mute label */
  labelMuted?: boolean

  /** Hint to append to label. Makes label faded if only hint presented */
  hint?: ReactNode

  children?: ReactNode
}

/** Indented section than can be opened and closed. Defaults closed */
export class CollapsibleSection extends React.Component<CollapsibleSectionProps, { open: boolean }> {
  constructor(props: CollapsibleSectionProps) {
    super(props)

    this.state = {
      open: props.initiallyOpen || false
    }
  }

  handleToggle = () => {
    return this.setState({ open: !this.state.open })
  }

  render() {
    return R(
      "div",
      { className: "mb-4" },
      R(
        "label",
        { key: "label", onClick: this.handleToggle, style: { cursor: "pointer" } },
        this.state.open
          ? R("i", { className: `fa fa-fw fa-caret-down ${this.props.labelMuted ? "text-secondary" : undefined}` })
          : R("i", { className: `fa fa-fw fa-caret-right ${this.props.labelMuted ? "text-secondary" : undefined}` }),

        this.props.labelMuted ? R("span", { className: "text-secondary" }, this.props.label) : this.props.label,

        this.props.hint
          ? R(
              "span",
              { className: "text-secondary", style: { fontWeight: this.props.label ? "normal" : undefined } },
              this.props.label ? " - " : undefined,
              this.props.hint
            )
          : undefined
      ),

      this.state.open ? R("div", { key: "contents", style: { marginLeft: 5 } }, this.props.children) : undefined
    )
  }
}

// Displays bootstrap pills with one active
export class NavPills extends React.Component<{
  pills: {
    id: string // Id of the tab
    label: ReactNode // Label of the tab
    href?: string // href optional
  }[]

  activePill?: string
  onPillClick?: (id: string) => void
}> {
  render() {
    return R(
      "ul",
      { className: "flex flex-wrap list-none p-0 m-0" },
      _.map(this.props.pills, (pill) => {
        return R(
          "li",
          { key: pill.id },
          R(
            "a",
            {
              href: pill.href,
              onClick: () => this.props.onPillClick?.(pill.id),
              className: classnames(
                "inline-block px-4 py-2 rounded cursor-pointer no-underline",
                pill.id === this.props.activePill ? "bg-primary text-white" : "text-primary hover:bg-gray-100"
              )
            },
            pill.label
          )
        )
      })
    )
  }
}

/** Button toggle component */
export class Toggle<T> extends React.Component<{
  value: T | null
  onChange?: (value: T | null) => void
  options: Array<{ value: T | null; label: ReactNode }>
  /** xs is deprecated */
  size?: "xs" | "sm" | "lg"
  allowReset?: boolean
}> {
  renderOption = (option: any, index: any) => {
    const value = this.props.value === option.value && this.props.allowReset ? null : option.value
    const isSelected = this.props.value === option.value
    const size = this.props.size == "xs" ? "sm" : this.props.size
    const btnClasses = classnames(
      "inline-block text-center align-middle cursor-pointer select-none border rounded transition-colors",
      size === "sm" ? "px-2 py-1 text-sm" : size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-base",
      isSelected ? "bg-primary border-primary text-white" : "bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
    )

    const props = {
      key: index,
      type: "button",
      className: btnClasses,
      // Wrapping creates awkward looking toggles
      style: { whiteSpace: "nowrap" }
    }

    if (!isSelected || this.props.allowReset) {
      props["onClick"] = this.props.onChange ? this.props.onChange.bind(null, value) : null
    }

    return R("button", props, option.label)
  }

  render() {
    return R("div", { className: "inline-flex gap-0.5" }, _.map(this.props.options, this.renderOption))
  }
}

/** Panel that can be opened and closed */
export function CollapsiblePanel(props: {
  title: ReactNode
  hint?: ReactNode
  children: any
  initiallyClosed?: boolean
}) {
  const [open, setOpen] = useState(props.initiallyClosed ? false : true)

  return <div className="border border-gray-200 rounded mb-4">
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div
        className="inline-block pr-1 text-primary cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        { open ? <i className="fas fa-caret-down fa-fw" /> : <i className="fas fa-caret-right fa-fw" /> }
      </div>
      {props.title}
      {props.hint ? <span className="text-secondary">{" - "}{props.hint}</span> : null}
    </div>
    { open ? <div className="p-4">{props.children}</div> : null }
  </div>
}
