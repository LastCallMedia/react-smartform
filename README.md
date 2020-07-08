React SmartForm
===============

This project is aimed at developers who are planning to implement multiple React forms following a single theme.  It aims to make building those forms simple by distilling the development down to two basic steps:

1. Building flexible, reusable input components (building an element "registry").
2. Composing a form from those elements using a simple, declarative syntax.

Once the elements have been defined, the same "registry" may be used to build as many forms as you need.

Example of a form written in JSON:
```json
[
  {
    "name": "howManyThings",
    "type": "number",
    "label": "How many things do you want to enter?",
  },
  {
    "name": "things",
    "type": "array",
    "count": "ref('howManyThings')",
    "of": {
      "type": "text",
      "label": "What Thing?",
      "required": true,
    }
  }
]
```

Given the above form definition, you can build a React form from it like so:
```tsx
import React from "react";
import {useSmartForm} from "@lastcall/react-smartform";
import {Button} from "@material-ui/core";
import {registry, Tree} from "@lastcall/react-smartform-material-ui";
// This is the JSON file with your form definition.
import formSchema from "./form";

export default function MyCoolForm() {
  const {fields, handleSubmit} = useSmartForm({
    formSchema,
    registry,
  });
  const submit = (values: object) => console.log(values);

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <Tree fields={fields} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

Project Goals
-------------

The principals behind this project are:

* Complexity should live in the element handlers, not in the form definition.
* The form definition should be 100% declarative (eg: No javascript code should be required to define the form). This makes it possible to refactor, replace, or extend the existing elements without changing the form definitions, and possible to change the form definition without changing the basic elements.
* Translation should be a first class citizen.
* It should be possible to understand the data produced by a form outside of React.  For example, given a form definition, we should be able to validate a single submission in a backend server process. 

Development
-----------

This project is a monorepo.  To get started on development, you can run `yarn install` from the repository root. This will install dependencies for all of the packages.
