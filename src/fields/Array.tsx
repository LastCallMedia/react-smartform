import {FieldConfig, FieldHandler, ReactFieldHandlerContext, YupFieldHandlerContext} from "../types";
import {resolveFieldName} from "../util";
import React from "react";
import {Field} from "react-hook-form";

type UnnamedFieldConfig = Omit<FieldConfig, 'name'>
export default interface ArrayConfig extends FieldConfig {
    count: number|string
    of: UnnamedFieldConfig | FieldConfig[]
}



export default class ArrayHandler implements FieldHandler<ArrayConfig> {
    handles(): string[] {
        return ['array']
    }

    getReactElement(config: ArrayConfig, context: ReactFieldHandlerContext): React.ReactElement {
        const count = resolveCount(config.count, context);
        const {parents, handler} = context
        const children = Array.from(Array(count).keys()).map(i => {
            return Array.isArray(config.of)
                ? handler.getReactElement(config.of, {...context, parents: parents.concat([config.name, i])})
                : handler.getReactElement({...config.of, name: i} as FieldConfig, {...context, parents: parents.concat(config.name)})
        })
        return <React.Fragment key={config.name}>{children}</React.Fragment>
    }

    getYupSchema(config: ArrayConfig, context: YupFieldHandlerContext) {
        const {handler} = context
        const children = Array.isArray(config.of) ?
            handler.getYupSchema(config.of, context) :
            handler.getYupSchema({...config.of, name: 0} as FieldConfig, context);
        return context.yup.array().of(children);
    }
}

function resolveCount(spec: ArrayConfig['count'], context: ReactFieldHandlerContext): number {
    if(typeof spec === 'number') {
        return spec
    }
    const match = spec.match(/^value\((.*)\)$/);
    if(match) {
        const remoteField = resolveFieldName(context.parents, match[1]);
        const value = parseInt(context.form.watch(remoteField));
        return isNaN(value) ? 0 : value
    }
    throw new Error(`Unable to resolve count from '${spec}'`)
}
