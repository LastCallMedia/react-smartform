import {ReactFieldVisitor, ReactFieldVisitorContext} from "../react";
import {resolveFieldName} from "../util";
import {compile} from 'expression-eval'
import {FieldConfig} from "../types";

export default class ReactVisibilityDecorator implements ReactFieldVisitor {
    inner: ReactFieldVisitor
    constructor(inner: ReactFieldVisitor) {
        this.inner = inner
    }
    visits(): string[] {
        return this.inner.visits()
    }
    visit(config: FieldConfig, context: ReactFieldVisitorContext) {
        if(config.when) {
            if(!compile(config.when)(getEvalContext(context))) {
                return;
            }
        }
        return this.inner.visit(config, context);
    }
}

export function getEvalContext(context: ReactFieldVisitorContext) {
    return {
        ref: (name: string) => {
            return context.form.watch(resolveFieldName(context.parents, name))
        },
        Number(value: unknown) {
            return Number(value)
        },
        String(value: unknown) {
            return String(value)
        }
    }
}




