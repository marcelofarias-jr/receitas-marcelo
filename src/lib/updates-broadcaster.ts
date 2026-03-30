type Controller = ReadableStreamDefaultController<Uint8Array>;

const clients = new Set<Controller>();
const encoder = new TextEncoder();

export function addClient(controller: Controller) {
  clients.add(controller);
}

export function removeClient(controller: Controller) {
  clients.delete(controller);
}

export function broadcastUpdate() {
  for (const controller of clients) {
    try {
      controller.enqueue(encoder.encode("data: update\n\n"));
    } catch {
      clients.delete(controller);
    }
  }
}
