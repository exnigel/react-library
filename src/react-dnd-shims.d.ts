// react-dnd/react-dnd-html5-backend are peerDependencies (a real consumer like mwater-forms
// supplies the actual runtime copy and its real, more precise types) -- deliberately NOT also
// installed as real devDependencies here, since a standalone `npm install` in this repo would
// otherwise place a second copy of react-dnd's own dependency tree in this package's own
// node_modules, which past experience (Feature 6.1's real duplicate-React-instance bug) shows
// wins module resolution over the consumer's hoisted copy when this package is consumed via a
// symlinked `file:` dependency -- exactly the class of bug that would reintroduce. Every actual
// usage in this repo (demo.tsx, reorderable/ReorderableListItemComponent.ts) already treats
// react-dnd's own return values as `any`, so this shim only needs to satisfy the import shape
// itself, not model react-dnd's real API precisely.
declare module "react-dnd" {
  export function DragSource(...args: any[]): any
  export function DropTarget(...args: any[]): any
  export function DragDropContext(...args: any[]): any
}

declare module "react-dnd-html5-backend" {
  const HTML5Backend: any
  export default HTML5Backend
}
