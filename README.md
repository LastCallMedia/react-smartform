React SmartForm
===============

This project makes it easy to produce highly dynamic forms in React. "Smart" forms may be defined in a simple, declarative configuration format, which will be run through various "builders" in order to build up the final form.

Example:
```yaml
- name: howManyThings
  label: "How many things do you want to enter?"
  type: select
  options: ["1", "2", "3"]
  required: true
- name: things
  label: "Thing"
  type: array
  count: "ref('howManyThings')"
  of:
    - name: thingName
      type: text
      required: true
```

Project Goals
-------------

This project is guided by a few principals:

* Forms should be defined in a declarative syntax. No javascript code should be required when defining a form.
* Prefer implementing complex behavior in decorators so that novel elements can reuse that behavior ad-hoc.  As an example, conditional visibility is implemented as an element decorator that can be used by any element.
* Forms should follow strong conventions for defining translation strings.
* Translation should be a first class citizen.

Development
-----------

This project is a monorepo.  To get started on development, you can run `yarn install` from the repository root. This will install dependencies for all of the packages.
