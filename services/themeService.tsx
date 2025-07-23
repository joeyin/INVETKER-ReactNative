type ThemeCallback = (theme: string) => void;

class ThemeService {
  current: string = "light";
  listeners: Record<string, ThemeCallback[]> = {};

  changeTheme(theme: string) {
    this.current = theme;
    this.emit("themeChanged", theme);
  }

  on(event: string, callback: ThemeCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: ThemeCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }

  emit(event: string, payload: string) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb(payload));
  }
}

export default new ThemeService();
