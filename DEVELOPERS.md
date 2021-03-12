
# Developer notes

To develop for a template itself, you need to create a `package.json` file in the template folder and add it to the gitignore list, as this file would overwrite the one created by create-react-app when used. This is as easy as follows:

```bash
git clone https://github.com/CartoDB/carto-react-template.git
cd carto-react-template
cp -R hygen/_templates/ template-sample-app/template/_templates
cp -R hygen/_templates/ template-skeleton/template/_templates
cd template-sample-app/template
ln -s package.dev.json package.json
cd template-skeleton/template
ln -s package.dev.json package.json
```

Then you are ready to install the dependencies executing `yarn` in the template folder and start the development server with `yarn start`.

## Testing the template generation

> ⚠️ Important: remember to synchronize the changes applied to your `template/package.json` with `template.json` and remove the `template/package.json` file before testing or execute `yarn clean` to clean it automatically.

You can test the template locally by calling `create-react-app` specifying the folder of this project:

```bash
npx create-react-app test-template --template file:./carto-react-template/template-sample-app
```

## Publishing the templates to npm

Follow these steps:

1. Open a new branch for the release, eg. release-v1.0.0-rc.2
2. For each template:
    - launch the app, with `yarn start`
    - test cypress locally, with `yarn cy:run`
    - manual review from browser (see errors & warnings)
    - from template root folder `yarn clean`
    - use create-react-app to build a project
    - test cra project result as a user, including hygen generators
3. Bump manually package version in package.json (root level --> package.json & inside template --> package.dev.json)
4. Update changelog: rename 'Unrelased' to new version, eg 1.0.0-rc.2 (2021-03-12)
5. Push branch to remote to run CI (all test green)
6. Execute the release command, for each template, from its **base folder**: `yarn release`. 

```bash
    cd template-sample-app
    yarn release
```
Before this command is executed, a prerelease hook will clean all unnecesary development files and folders and copy the latest hygen templates, before making the npm release.
7. After a succesful release, merge the PR and create a tag in github
8. Deploy the sample app template to firebase (if required)




## Deploying the sample app

The sample app corresponding to https://sample-app-react.carto.com/ is hosted in Firebase, so before deploying it you'll need to log into Firebase using:

```bash
cd template-sample-app/template
yarn firebase login
```

Then, just build the sample-app template and deploy it by executing:

```bash
cd template-sample-app/template
yarn build
yarn firebase deploy
```

### Updating supported browsers

This project supports [browserslist](https://github.com/browserslist/browserslist) and it has an unsupported browser page. In case of updating browserslist configuration, ensure to update the detection script by running:

```bash
yarn updateSupportedBrowsers
```

## Using locally the CARTO for React library

In order to work side by side with a local version of the `CARTO for React library` packages (available at https://github.com/CartoDB/carto-react`), follow these instructions:

```bash
git clone https://github.com/CartoDB/carto-react.git
cd react
yarn
yarn start
yarn link-all
```

Now that all packages are compiled, link them into `carto-react-template` with:

```bash
cd carto-react-template
cd template-sample-app/template
yarn link-carto-react
yarn start

cd template-skeleton/template
yarn link-carto-react
yarn start
```

From this moment, template-sample-app or template-skeleton will be using your local version of the library packages.