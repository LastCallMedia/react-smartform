import {
  Constructor,
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
} from "../types";

export type MarkupRenderFunction<C extends FieldConfig> = (
  config: C,
  context: FieldRenderContext
) => React.ReactElement;

export default abstract class MarkupHandler<C extends FieldConfig>
  implements FieldHandler<C> {
  types: string[];
  renderer: MarkupRenderFunction<C>;
  constructor(types: string[], render: MarkupRenderFunction<C>) {
    this.types = types;
    this.renderer = render;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: C, context: FieldRenderContext): React.ReactElement {
    return this.renderer(config, context);
  }
  buildYupSchema(): false {
    return false;
  }
}

export function makeMarkupHandler<C extends FieldConfig>(
  types: string[],
  render: MarkupRenderFunction<C>
): Constructor<FieldHandler<C>> {
  return class extends MarkupHandler<C> {
    constructor() {
      super(types, render);
    }
  };
}
