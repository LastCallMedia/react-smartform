import React from 'react'
import {ContainerConfig} from "./Container.config";
import {ReactFieldVisitor, ReactFieldVisitorContext} from "../react";

export default class ReactContainerVisitor implements ReactFieldVisitor<ContainerConfig> {
    visits(): string[] {
        return ['container']
    }
    visit(config: ContainerConfig, context: ReactFieldVisitorContext): React.ReactElement {
        return (
            <div key={config.name} className={config.className}>
                {context.visitor.visitSchema(config.of, {...context})}
            </div>
        )
    }
}
