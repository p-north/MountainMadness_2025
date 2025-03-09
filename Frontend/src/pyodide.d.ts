declare module "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.mjs" {
  export function loadPyodide(options: { indexURL: string }): Promise<any>;
}