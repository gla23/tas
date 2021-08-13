export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("state");
    if (serializedState === null) return undefined;
    const state = JSON.parse(serializedState);
    return state;
  } catch (err) {
    console.error("Session storage load error: ", err);
    return undefined;
  }
};
export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("state", serializedState);
  } catch (err) {
    console.error("Session storage save error: ", err);
  }
};
