import type {
  FieldHandler,
  FieldRenderContext,
  FieldValidationContext,
  ExtractConfigFromHandler,
  FieldName,
  FieldConfig,
  ExtractPropertyNamesOfType,
} from "../types";
import type { Schema as YupSchema } from "yup";
import { Constructor } from "../types";

type ExtrapolateConfig<
  Config extends FieldConfig,
  AlwaysKeys extends keyof TranslatableConfig<Config>,
  MaybeKeys extends keyof TranslatableConfig<Config>
> = Config &
  {
    [P in AlwaysKeys]?: string;
  } &
  {
    [P in MaybeKeys]?: string | boolean;
  };

type TranslatableConfig<Config extends FieldConfig> = Pick<
  Config,
  ExtractPropertyNamesOfType<
    // Never allow name and type to be translated.
    Required<Omit<Config, "name" | "type">>,
    string
  >
>;

/**
 * This class decorator allows a class to have properties automatically generated at runtime.
 *
 * Eg: To automatically generate a `label` property for a class "InputHandler", use:
 *   withAutoProps(InputHandler, ["label"])
 */
export default function withAutoProps<
  HandlerConstructor extends Constructor<FieldHandler>,
  HandlerInstance extends InstanceType<HandlerConstructor>,
  HandlerInstanceConfig extends ExtractConfigFromHandler<HandlerInstance>,
  AlwaysKey extends keyof TranslatableConfig<HandlerInstanceConfig> & string,
  MaybeKey extends keyof TranslatableConfig<HandlerInstanceConfig> & string,
  Config extends ExtrapolateConfig<HandlerInstanceConfig, AlwaysKey, MaybeKey>
>(
  constructor: HandlerConstructor,
  alwaysKeys: AlwaysKey[] = [],
  maybeKeys: MaybeKey[] = []
): new (...args: ConstructorParameters<HandlerConstructor>) => FieldHandler<
  Config
> {
  function override(config: Config, nameParts: FieldName[]) {
    let overrides: Config = alwaysKeys.reduce((overrides, key) => {
      if (typeof overrides[key] !== "string") {
        return { ...overrides, [key]: generate(nameParts, key) };
      }
      return overrides;
    }, config);

    overrides = maybeKeys.reduce((overrides, key) => {
      // For the life of me, I can't figure out why, but overrides[key] === true throws a TS error here.
      if ((overrides[key] as unknown) === true) {
        return { ...overrides, [key]: generate(nameParts, key) };
      }
      return overrides;
    }, overrides);
    return overrides;
  }
  return class extends constructor {
    render(config: Config, context: FieldRenderContext) {
      const parts = context.parents.concat([config.name]);
      return super.render(override(config, parts), context);
    }
    buildYupSchema(
      config: Config,
      context: FieldValidationContext
    ): YupSchema<unknown> | false {
      const parts = context.parents.concat([config.name]);
      return super.buildYupSchema(override(config, parts), context);
    }
  };
}

function generate(parts: FieldName[], prefix: string) {
  return `${prefix}.${parts.filter((p) => typeof p === "string").join(".")}`;
}
