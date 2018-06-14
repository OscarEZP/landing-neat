# Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve --configuration staging` for a dev server using the staging API's. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If you use `ng serve --configuration prod --prod` remember the build will take more time because has several compress and optimization task associated, also the API's path will be directed to production environment. If you want to probe production optimization without using the API's of prod, just add --prod to the first command (staging one)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build --configuration staging` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production --prod` flag for a production build.

## Running unit tests

Run `npm run test --coverage` to execute the unit tests via Jest (https://facebook.github.io/jest/).

It will generate a folder named coverage, inside there you will find a folder named lcov-report and you will open the index.html in any browser to see the actual coverage of the project.

## Generate documentation of the project

First install compodoc global using this command: `npm install -g @compodoc/compodoc`

Run `npm run compodoc` to execute the script and generate an auto documentation which could rendered and opened automatically in a browser in the port :8080


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
