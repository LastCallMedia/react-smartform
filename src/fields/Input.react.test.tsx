import React from 'react'
import ReactVisitor from "../react";
import ReactInputVisitor from "./Input.react";
import {render} from '@testing-library/react'
import {useFormContext, FormContext} from "react-hook-form";
import SmartForm from "../SmartForm";

describe('Input', function() {
    const visitor = new ReactVisitor([
        new ReactInputVisitor(),
    ]);

    it('Should render', () => {
        const schema = [
            {type: 'input', name: 'mynumber', inputType: 'number'},
            {type: 'input', name: 'mytext', inputType: 'text'},
        ];
        const {container} = render(<SmartForm visitor={visitor} schema={schema} />)
        expect(container.querySelectorAll('input[type="number"][name="mynumber"]')).toHaveLength(1);
        expect(container.querySelectorAll('input[type="text"][name="mytext"]')).toHaveLength(1);
    })
});
