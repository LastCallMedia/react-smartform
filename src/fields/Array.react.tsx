import React from 'react'
import {ReactFieldVisitor, ReactFieldVisitorContext} from "../react";
import ArrayConfig from "./Array.config";
import {resolveFieldName} from "../util";


function resolveCount(spec: ArrayConfig['count'], context: ReactFieldVisitorContext): number {
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

export default class ReactArrayVisitor implements ReactFieldVisitor<ArrayConfig> {
    visits(): string[] {
        return ['array']
    }
    visit(config: ArrayConfig, context: ReactFieldVisitorContext): React.ReactElement {
        const count = resolveCount(config.count, context);
        const {parents, visitor} = context
        const children = Array.from(Array(count).keys()).map(i => {
            return Array.isArray(config.of)
                ? visitor.visitSchema(config.of, {...context, parents: parents.concat([config.name, i])})
                : visitor.visitField({...config.of, name: i}, {...context, parents: parents.concat(config.name)})
        })
        return <React.Fragment key={config.name}>{children}</React.Fragment>
    }
}
