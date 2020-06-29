import type {
  FieldHandler,
  FieldConfig,
  FieldRenderContext,
  FieldValidationContext,
} from "./types";
import type { Schema as YupSchema } from "yup";

export default abstract class BaseFieldHandler<C extends FieldConfig>
  implements FieldHandler<C> {
  abstract handles(): string[];
  abstract render(config: C, context: FieldRenderContext): React.ReactElement;
  abstract buildYupSchema(
    config: C,
    context: FieldValidationContext
  ): YupSchema<unknown>;
  getTranslationKeys() {
    return [];
  }
}
