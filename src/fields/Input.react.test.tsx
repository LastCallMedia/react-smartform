import React from 'react'
import ReactSchemaVisitor from "../react";
import ReactInputVisitor from "./Input.react";
import {Schema} from "../types";
import {render} from '@testing-library/react'
import {useFormContext, FormContext} from "react-hook-form";
import SmartForm from "../SmartForm";

describe('Input', function() {
    const visitor = new ReactSchemaVisitor([
        new ReactInputVisitor(),
    ]);
    const renderSchema = (schema: Schema) => render(<SmartForm visitor={visitor} schema={schema} />)

    it('Should render', () => {
        const {container} = renderSchema([
            {type: 'input', name: 'mynumber', inputType: 'number'},
            {type: 'input', name: 'mytext', inputType: 'text'},
        ])
        expect(container.querySelectorAll('input[type="number"][name="mynumber"]')).toHaveLength(1);
        expect(container.querySelectorAll('input[type="text"][name="mytext"]')).toHaveLength(1);
    });

    it('Should optionally render with a placeholder', () => {
        const {getByPlaceholderText} = renderSchema([
            {type: 'input', name: 'mytext', placeholder: true},
        ])
        expect(getByPlaceholderText('placeholder.mytext')).not.toBeNull();
    });
});
