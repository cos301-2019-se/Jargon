# Jargon
## Description
[Jargon](../) is a tool that streams opinionated data from a publicly available source
(such as [Twitter](https://twitter.com/)) about a certain topic, parses and analyzes 
the data, and presents the information in a dashboard for executives to view.

The project makes use of the [microservices](https://microservices.io/) architecture, 
and thus comprises of multiple (8 at the moment) independently deployable services.
More specifically, [docker](https://www.docker.com/) containers are used to facilitate 
this.

## Contents
* [Requirements](#requirements)
* [Installation](#installation)
* [Deployment](#deployment)
* [Usage](#usage)
* [Testing](#testing)
* [Travis-CI](#travis-ci)

## Requirements
* [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
* [Angular](https://angular.io/)
* [Python3](https://www.python.org/)
* [pip](https://pypi.org/project/pip/)
* [docker](https://www.docker.com/) (specidfically, `dockerd` and `docker-compose`)

## Installation
To install each service, simply execute the installation script found in the
`services` directory (the same directory where this `README.md` is located), with the
followng command:

```bash
    $ ./install.sh
```

This will install the necessary dependencies and will carry out the necessary 
compilation required for each service appropriately. The dependencies in particular
will require an active internet connection.

> __Note__: The sentiment analysis service (the neural network) has large
> dependencies, it could take up to an hour or two for the downloads to complete 
> depending on the internet connection strength.

Alternatively, each service can be individually installed by switching to the
relevant directory and executing the respective `install.sh`.

## Deployment

From the `services` directory, execute the startup script:

```bash
    $ ./run.sh
```

This will spin up a container for each service. All services are dockerized 
(docker containerized), thus starting the system only involves the 
deployment of each container. 

> __Note__: The sentiment analysis requires large downloads the first time a
> container is spun up for it. It can take up to an hour or two for the 
> downloads to complete depending on the internet connection strength.

> __Note__: The sentiment analysis service (the neural network) can take
> anywhere between 10 and 20 minutes on average to fully startup, depending on 
> the hardware and resources available.

Once each service has finished loading and is ready, the UI can 
then be viewed through the web browser at <http://localhost:4200/>.

## Usage
TODO link user manual here
TODO example photos and/or video here

## Testing
Please see [tests](../tests) for more information.

## Travis-CI
It is worth noting that Travis-CI configurations are already present within this
repository's root directory. One can make use of these configurations if they 
wish to make a live deployment of the system themselves.

