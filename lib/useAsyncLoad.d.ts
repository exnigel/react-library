export interface AsyncLoadResult<S> {
    /** Current loaded state -- the merged result of every applied load() callback so far. */
    state: S;
    /** True while the LATEST started load hasn't yet completed. */
    loading: boolean;
    /** Manually triggers a new load using the current props, mirroring AsyncLoadComponent.forceLoad(). */
    forceLoad: () => void;
}
/**
 * Hook replacement for AsyncLoadComponent, replicating its exact race-condition guarantee: if a
 * load is superseded by a newer one (a prop change, or forceLoad) before it completes, the
 * superseded load's result is only applied if no newer load has already completed by the time it
 * calls back, and it never flips `loading` back to false while a newer load is still in flight.
 *
 * Mirrors AsyncLoadComponent's own abstract methods 1:1 (isLoadNeeded/load, same signatures) so
 * existing subclasses can convert with minimal logic changes -- see CLAUDE.md's Feature 6.3b
 * write-up in the mwater-forms repo for the full migration plan this hook is a prerequisite for.
 *
 * `isLoadNeeded` is NOT consulted on mount -- the first render always loads, exactly matching
 * AsyncLoadComponent's own componentWillMount (which calls `_performLoad(this.props, {})`
 * unconditionally). `load`'s own `prevProps` argument is likewise `{}` on that first call, not
 * `props` -- matching the class's exact behavior for any `load()` implementation that reads
 * `prevProps`.
 */
export declare function useAsyncLoad<P, S>(props: P, isLoadNeeded: (newProps: P, oldProps: P) => boolean, load: (props: P, prevProps: P, callback: (stateUpdate: Partial<S>) => void) => void, initialState: S): AsyncLoadResult<S>;
