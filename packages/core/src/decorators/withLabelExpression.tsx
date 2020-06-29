import {
  Constructor,
  ExtractConfigFromHandler,
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
} from "../types";
import { evaluateInRenderContext } from "../eval";

export interface LabelExpressionConfig {
  labelExpr?: string;
}

export default function withLabelExpression<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  HandlerInstanceConfig extends ExtractConfigFromHandler<HandlerInstance>,
  Config extends HandlerInstanceConfig & LabelExpressionConfig
>(constructor: HandlerConstructor): Constructor<FieldHandler<Config>> {
  // Ex: ref(foo) > 0 ? 'bar' : 'baz'
  return class extends constructor {
    render(config: Config, context: FieldRenderContext): React.ReactElement {
      const resolved = { ...config };
      if (config.labelExpr) {
        const override = evaluateInRenderContext(config.labelExpr, context);
        if (override && typeof override === "string") {
          Object.assign(resolved, {
            label: override,
          });
        }
      }
      return super.render(resolved, context);
    }
    buildYupSchema(config: Config, context: FieldValidationContext) {
      // For now, we're not even trying to evaluate label expressions for Yup fields.
      return super.buildYupSchema(config, context);
    }
  };
}
