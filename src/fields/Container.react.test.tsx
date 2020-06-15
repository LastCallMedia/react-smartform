import ReactVisitor from "../react";
import ReactContainerVisitor from "./Container.react";
import ReactInputVisitor from "./Input.react";
import {Schema} from "../types";
import {render} from "@testing-library/react";
import SmartForm from "../SmartForm";
import React from "react";

describe('Container', function() {
    const visitor = new ReactVisitor([
        new ReactContainerVisitor(),
        new ReactInputVisitor()
    ]);
    function renderSchema(schema: Schema) {
        return render(<SmartForm visitor={visitor} schema={schema} />)
    }

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
