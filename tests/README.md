# Jargon
## Tests
It is assumed that the reader has familiarized themselves with the 
content presented in [services](../services).

The following instructions are intended to aid the developer in carrying
out tests (units, API routes and system integration).

## Contents
* [Installation](#installation)
* [Procedure](#procedure)
* [Testing Policies](#testing-policies)

## Installation
From the `tests` directory (the same directory in which this `README.md` is located), 
execute the installation script:

```bash
    $ ./install.sh
```

This will install all dependencies needed to carry out testing for every
service.

> __Note__: Reccurring programming environments/frameworks (i.e. nodejs) package 
> dependency lists are stored in one shared file in the root of the `tests` 
> directory. Life is just better this way.

## Procedure
From the `tests` directory, execute the test script to execute all levels 
of tests, from unit to API routing to inter-service communication tests (where 
any such tests exist):

```bash
    $ ./test.sh
```

Appropriate output will be displayed displaying the status of the tests. A (positive)
non-zero exit status will be returned if any test fails.

## Testing Policies
Please see [Testing Policy](../documentation/testing-policy-latest.pdf) for more
information on the testing policies.

