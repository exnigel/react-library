"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncLoad = void 0;
const react_1 = require("react");
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
function useAsyncLoad(props, isLoadNeeded, load, initialState) {
    const [state, setState] = (0, react_1.useState)(initialState);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const propsRef = (0, react_1.useRef)(props);
    propsRef.current = props;
    const prevPropsRef = (0, react_1.useRef)(props);
    const mountedRef = (0, react_1.useRef)(true);
    const loadSeqStarted = (0, react_1.useRef)(0);
    const loadSeqCompleted = (0, react_1.useRef)(0);
    // Always reflects the latest `load` passed in, even though performLoad itself is a stable
    // callback -- mirrors AsyncLoadComponent calling `this.load`, which always sees the subclass's
    // current implementation/closure, not whatever was captured when a load started.
    const loadRef = (0, react_1.useRef)(load);
    loadRef.current = load;
    const performLoad = (0, react_1.useCallback)((newProps, oldProps) => {
        loadSeqStarted.current += 1;
        const seq = loadSeqStarted.current;
        setLoading(true);
        const callback = (stateUpdate) => {
            if (!mountedRef.current)
                return;
            if (seq < loadSeqCompleted.current)
                return;
            loadSeqCompleted.current = seq;
            setState((s) => (Object.assign(Object.assign({}, s), stateUpdate)));
            if (seq === loadSeqStarted.current) {
                setLoading(false);
            }
        };
        loadRef.current(newProps, oldProps, callback);
    }, []);
    (0, react_1.useEffect)(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    const isFirstRun = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            performLoad(props, {});
        }
        else {
            const oldProps = prevPropsRef.current;
            if (isLoadNeeded(props, oldProps)) {
                performLoad(props, oldProps);
            }
        }
        prevPropsRef.current = props;
    }, 
    // isLoadNeeded/performLoad are read via refs/are stable, so only `props` needs to be a real
    // dependency here -- matching componentWillReceiveProps, which runs on every props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props]);
    const forceLoad = (0, react_1.useCallback)(() => {
        performLoad(propsRef.current, propsRef.current);
    }, [performLoad]);
    return { state, loading, forceLoad };
}
exports.useAsyncLoad = useAsyncLoad;
