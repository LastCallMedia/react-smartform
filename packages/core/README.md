Smartform for React
===================

This project allows you to build forms for React applications by defining a group of element handlers (collectively referred to as a "registry"), and defining the forms using a declarative syntax that the handlers turn into React elements.

Field Handlers
--------------
In SmartForm, Field Handlers are classes that know how to construct form elements of a particular `type`. Field handlers should implement the `FieldHandler` interface. 

Field handler classes may also be "decorated" with any of the decorators in the [`decorators`](./src/decorators) directory. Decorators intercept calls to the field handler methods, and perform manipulations on the configuration or the return value of the methods. As an example, the `withVisibility` decorator allows complex conditions to control the element's visibility in the form.

The Registry
------------
Before using SmartForm, you must define a registry. A registry is a group of `FieldHandler` instances, and it determines what elements SmartForm will be able to build for you. This module comes with two "built in" field types you can start with, but you will need to define many of your own handlers.

Example:
```js
// registry.js
import {ArrayHandler, ContainerHandler, Registry,} from "@lastcall/react-smartform";
export const registry = new Registry([
    new ArrayHandler(),
    new ContainerHandler(),
    new InputHandler(),
]);

export default registry;
```

The Builder
-----------
Once you have a registry populated with field handlers, you will want to construct a `SchemaBuilder` to generate forms:

Example:
```js
// builder.js
import {SchemaBuilder} from "@lastcall/react-smartform";
import registry from "./registry";

export default const builder = new SchemaBuilder(registry);
```

The builder can be used to build forms, in combination with the `SmartForm` component. Example:
```jsx
// myform.js
import builder from "./builder";
import {SmartForm} from "@lastcall/react-smartform";

const fields = [
    {
        "name": "isAwesome",
        "type": "input",
    }
];

// This is a normal React component.
// @todo: This example doesn't actually work yet.
function MyForm() {
    return (
        <SmartForm builder={builder} schema={fields} />
    )
}
```
 
