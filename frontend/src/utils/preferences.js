const POMODORO_KEY = "taskmind_pomodoro_minutes";
const DEFAULT_POMODORO_MINUTES = 25;

export function getPomodoroMinutes() {
    const stored = Number(localStorage.getItem(POMODORO_KEY));
    return stored > 0 ? stored : DEFAULT_POMODORO_MINUTES;
}

export function setPomodoroMinutes(minutes) {
    localStorage.setItem(POMODORO_KEY, String(minutes));
}

export { DEFAULT_POMODORO_MINUTES };
