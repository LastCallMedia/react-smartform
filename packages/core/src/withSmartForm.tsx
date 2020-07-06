import React from "react";
import useSmartForm, {
  UseSmartFormOptions,
  UseSmartFormResult,
} from "./useSmartForm";
import { Schema } from "./types";
import Registry from "./Registry";

type Diff<A, B> = Omit<A, keyof B>;

export type WithSmartFormProps = UseSmartFormResult;

export default function withSmartForm<P extends WithSmartFormProps>(
  Component: React.ComponentType<P>,
  options: Partial<UseSmartFormOptions>
): React.FunctionComponent<
  Diff<P, WithSmartFormProps> & Partial<UseSmartFormOptions>
> {
  function WithSmartForm(
    props: Diff<P, UseSmartFormResult> & Partial<UseSmartFormOptions>
  ) {
    const smartFormOptions = { ...options, ...props };
    if (!isValidIsh(smartFormOptions)) {
      throw new Error(
        `Missing schema or registry properties. These properties must be given as properties to the component, or passed into withSmartForm()`
      );
    }
    const smartProps = useSmartForm(smartFormOptions);
    const p = { ...props, ...smartProps } as P;
    return <Component {...p} />;
  }
  WithSmartForm.displayName = `WithSmartForm(${getDisplayName(Component)})`;

  return WithSmartForm;
}

function getDisplayName(Component: { displayName?: string; name?: string }) {
  return Component.displayName || Component.name || "Component";
}

function isValidIsh(options: {
  schema?: unknown;
  registry?: unknown;
}): options is { schema: Schema; registry: Registry } {
  if (!Array.isArray(options.schema)) {
    return false;
  }
  if (!options.registry || !(options.registry instanceof Registry)) {
    return false;
  }
  return true;
}
