type Controller = ReadableStreamDefaultController<Uint8Array>;

const g = globalThis as typeof globalThis & {
  __recipeClients?: Set<Controller>;
};
if (!g.__recipeClients) {
  g.__recipeClients = new Set<Controller>();
}
const clients = g.__recipeClients;

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
