export function saveState(key, state) {
    const stateAsString = JSON.stringify(state);
    localStorage.setItem(key, stateAsString)
}

// и вот вам функция для получения сохранённого объекта в памяти браузера:
export function restoreState(key, defaultState) {
    const stateAsString = localStorage.getItem(key);
    if (stateAsString !== null) defaultState = JSON.parse(stateAsString);
    return defaultState;
}