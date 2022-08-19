import { entries } from "lodash";
import { defineAsyncComponent, type App } from "vue";

const components = import.meta.glob("./*.vue");

export default function install(app: App<Element>) {
  for (const [key, value] of entries(components)) {
    const name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
    app.component(name, defineAsyncComponent(value as any));
  }
}
