import {
  FieldConfig,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
} from "../types";

type MarkupRenderFunction<C extends FieldConfig> = (
  config: C,
  context: FieldRenderContext
) => React.ReactElement;

abstract class MarkupHandler<C extends FieldConfig> implements FieldHandler<C> {
  types: string[];
  renderer: MarkupRenderFunction<C>;
  constructor(types: string[], render: MarkupRenderFunction<C>) {
    this.types = types;
    this.renderer = render;
  }
  handles(): string[] {
    return this.types;
  }
  render(config: C, context: FieldRenderContext) {
    return this.renderer(config, context);
  }
  buildYupSchema(config: C, context: FieldValidationContext): false {
    return false;
  }
}

export default function makeMarkupHandler<C extends FieldConfig>(
  types: string[],
  render: MarkupRenderFunction<C>
) {
  return class extends MarkupHandler<C> {
    constructor() {
      super(types, render);
    }
  };
}
