type Handler = (payload: any) => void;

export class EventBus {
  private handlers: Record<string, Handler[]> = {};

  constructor() {
    if (typeof window !== "undefined") {
      this.startListening();
    }
  }

  on(event: string, handler: Handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  off(event: string, handler: Handler) {
    const arr = this.handlers[event];
    if (!arr) return;
    this.handlers[event] = arr.filter(h => h !== handler);
  }

  emitToParent(event: string, payload?: any) {
    window.parent?.postMessage({ event, payload }, "*");
  }

  emitToIframe(iframe: HTMLIFrameElement, event: string, payload?: any) {
    iframe.contentWindow?.postMessage({ event, payload }, "*");
  }

  private startListening() {
    window.addEventListener("message", (e) => {
      const { event, payload } = e.data || {};
      if (!event || !this.handlers[event]) return;
      this.handlers[event].forEach(h => h(payload));
    });
  }
}
