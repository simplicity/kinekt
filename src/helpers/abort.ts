export function abort(reason: string): never {
  throw new Error(`Aborting. Reason: ${reason}`);
}
