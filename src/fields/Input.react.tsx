import React from 'react';
import {ReactFieldVisitor, ReactFieldVisitorContext} from "../react";
import InputConfig from "./Input.config";
import {makeElementName, makeElementId, makeElementLabel} from "../util";

export default class ReactInputVisitor implements ReactFieldVisitor<InputConfig> {
    visits(): string[] {
        return ['input']
    }
    visit(config: InputConfig, context: ReactFieldVisitorContext): React.ReactElement {
        const name = makeElementName(context.parents.concat([config.name]));
        const id = makeElementId(context.parents.concat(config.name))
        const label = makeElementLabel(context.parents.concat(config.name), 'label');
        return (
            <div key={config.name}>
                <label htmlFor={id}>{label}</label>
                <input
                    id={id}
                    name={name}
                    placeholder={config.placeholder ? makeElementLabel(context.parents.concat(config.name), 'placeholder'): undefined}
                    type={config.inputType || 'text'}
                    ref={context.form.register()}
                />
            </div>

        )
    }
}
