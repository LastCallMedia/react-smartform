import SmartFormSchemaHandler from "../index";
import ContainerHandler from "./Container";
import InputHandler from "./Input";
import {Schema} from "../types";
import {render} from "@testing-library/react";
import SmartForm from "../SmartForm";
import React from "react";


describe('ContainerHandler', function() {
    const schemaHandler = new SmartFormSchemaHandler([
        new ContainerHandler(),
        new InputHandler()
    ])
    const renderSchema = (schema: Schema) => render(<SmartForm handler={schemaHandler} schema={schema} />)

    it('Should render container items', () => {
        const {container, debug} = renderSchema([
            {
                type: 'container',
                name: 'myarr',
                className: 'container1',
                of: [
                    {name: 'text', type: 'input', inputType: 'text'}
                ]
            }
        ]);
        expect(container.querySelector('div.container1 #text')).not.toBeNull()
    })
})
