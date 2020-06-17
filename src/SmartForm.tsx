import React from 'react'
import {useForm} from "react-hook-form";
import {Schema, SchemaHandler} from "./types";

type SmartFormProps = {
    handler: SchemaHandler
    schema: Schema
}
export default function SmartForm({handler, schema}: SmartFormProps) {
    const formContext = useForm();

    return (
        <form>{handler.getReactElement(schema, {form: formContext})}</form>
    )
}
