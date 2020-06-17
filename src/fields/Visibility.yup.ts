import {FieldConfig} from "../types";
import {YupFieldVisitor, YupFieldVisitorContext} from "../yup";
import * as yup from 'yup'
import {parse, eval as evalExpr} from 'expression-eval'
import {Expression, BinaryExpression, LogicalExpression, CallExpression, Identifier, Literal} from 'jsep'
import set from 'lodash/set'
import get from 'lodash/get'


export default class YupVisibilityDecorator implements YupFieldVisitor {
    inner: YupFieldVisitor
    constructor(inner: YupFieldVisitor) {
        this.inner = inner
    }
    visits(): string[] {
        return this.inner.visits();
    }
    visit(config: FieldConfig, context: YupFieldVisitorContext): yup.Schema<any> {
        let schema = this.inner.visit(config, context);
        if(config.when) {
            const ast = parse(config.when);
            const refs = extractRefs(ast);
            schema = yup.mixed().when(refs, {
                is: (...values) => {
                    // Extract values from our values array into an object we can descend into.
                    const packed = refs.reduce((p, fieldName, i) => {
                        set(p, fieldName, values[i])
                        return p
                    }, {})

                    return !!evalExpr(ast, getEvalContext(packed));
                },
                then: schema
            })
        }
        return schema
    }
}

/**
 * Extract the arguments for any ref() calls in the expression.
 */
function extractRefs(ast: Expression): string[] {
    switch (ast.type) {
        case 'CallExpression':
            const callee = extractCallee(ast);
            if(callee === 'ref') {
                return (ast as CallExpression).arguments.reduce((refs, arg) => {
                    refs.push(extractValue(arg).toString());
                    return refs
                }, [] as string[])
            }
            return ([] as string[]).concat(...(ast as CallExpression).arguments.map(a => extractRefs(a)))
        case 'LogicalExpression':
            return ([] as string[]).concat(
                extractRefs((ast as LogicalExpression).left),
                extractRefs((ast as LogicalExpression).right)
            )
        case 'BinaryExpression':
            return ([] as string[]).concat(
                extractRefs((ast as BinaryExpression).left),
                extractRefs((ast as BinaryExpression).right)
            )
        case 'Literal':
            return []
        default:
            throw new Error(`Unhandled Type: ${ast.type}`)
    }
}

/**
 * Extract the function name from a call expression.
 */
function extractCallee(ast: Expression) {
    switch(ast.type) {
        case 'CallExpression':
            return extractIdentifier((ast as CallExpression).callee)
        default:
            throw new Error(`Unable to extract callee from ${ast.type}`)
    }
}

/**
 * Extract an identifier value for any Identifier expression.
 */
function extractIdentifier(ast: Expression) {
    switch(ast.type) {
        case 'Identifier':
            return (ast as Identifier).name
        default:
            throw new Error(`Unable to extract identifier from ${ast.type}`)
    }
}

/**
 * Extract literal values for any literal expression.
 */
function extractValue(ast: Expression) {
    switch(ast.type) {
        case 'Literal':
            return (ast as Literal).value
        default:
            throw new Error(`Unable to extract value from ${ast.type}`)
    }
}


export function getEvalContext(refValues: {}) {
    return {
        ref: (path: string) => {
            return get(refValues, path);
        },
        Number(value: unknown) {
            return Number(value)
        },
        String(value: unknown) {
            return String(value)
        }
    }
}
