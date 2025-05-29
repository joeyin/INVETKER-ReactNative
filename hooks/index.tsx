import * as React from "react";

export function useToggle(initialValue = false) {
  const [state, setState] = React.useState(initialValue);

  function toggle() {
    setState(!state);
  }

  function on() {
    setState(true);
  }

  function off() {
    setState(false);
  }

  return {
    toggle,
    on,
    off,
    state,
  };
}
