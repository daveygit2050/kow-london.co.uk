# kow-london.co.uk

<a href="https://github.com/daveygit2050/kow-london.co.uk/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/daveygit2050/kow-london.co.uk"></a>

Resources for the [kow-london.co.uk](https://kowlondon.co.uk) website.

## Development

Information pertaining to the development of the kow-london.co.uk website.

### Infrastructure

Site infrastructure is built with `terraform` and defined in the [infrastructure](./infrastructure) directory.

To spin up the infrastructure, run this with appropriate AWS credentials set:

    terraform init
    terraform apply

### Static site

Static site resources, including html, css and js files are stored in the [static](./static) directory.

To install dependencies to the [static/node_modules](./static/node_modules) directory:

    npm init

To run a [local development server](http://localhost:3000):

    npm start

To build a distributable package at [static/dist](./static/dist):

    npm run build

### Backend

Backend resources, such as python scripts, are stored in the [backend](./backend) directory.

To install dependencies:

    poetry install

To scrape tournament event data from [kowmasters.com](https://kowmasters.com) and export the result to the [static site config](./static/event-map/venues.json):

    poetry run python ./generate-events.py

## License

This code is open source software licensed under the [MIT License](./LICENSE).
