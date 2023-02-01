# **api-test**

## **Introduction**

> Need to test your API performance in a hurry? **api-test** is a fast and user friendly cli that uses [api-benchmark](https://www.npmjs.com/package/api-benchmark) to help diagnose & monitor API issues. Just add JSON, and you're ready to go!

---

## **How do I get started?**

> - #### Install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) | `npm install -g npm`
> - #### Install [api-test](https://github.com/jbrinkman/api-test) with npm | `npm install -g api-test`
> - #### Initialize api-test in a project. See [walkthrough](#initializing-api-test-walkthrough) below.
> - #### **Update the testplan.json & testconfig.json files** inside the api-tests folder. See [template readme](./src/template/readme.md) for examples.
> - #### You may need to tune your machine to remove any OS limits in terms of opening and quickly recycling sockets.
>
> ```
> Linux and Mac OS X
> sudo sysctl -w kern.maxfiles=25000
> sudo sysctl -w kern.maxfilesperproc=24500
> sudo sysctl -w kern.ipc.somaxconn=20000
> ulimit -S -n 20000
> ```

---

## **Initializing api-test walkthrough**

> - #### Chose a project or create a new folder to house your api test files.
> - #### Use the api-test cli to initialize api-test in inside the project folder | `api-test init`
> - #### The init will create an api-tests folder that has a [template readme](./src/template/readme.md) with example testplan.json & testconfig.json files.
> - #### Run api-test to create example results based on the template | `api-test`
> - #### The results of the initial run will be in a new folder in `./api-test/results`. Open the folder to view the default api-benchmark results.
> - #### Now you're ready to create your own api tests. Checkout the [template readme](./src/template/readme.md) for more information.

---

## **Using the Api-Test cli**

### Basic Commands

| Command         | Description                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `api-test init` | Initialize the `api-test` folder with the sample test configuration and test plan if the folder does not already exist. |
| `api-test run`  | Runs tests using default testplan.json and testconfig.json                                                              |
| `api-test`      | Show api-test help information                                                                                          |

### Global Options

| Command     | Description                    |
| ----------- | ------------------------------ |
| `--version` | Show api-test version number   |
| `--help`    | Show api-test help information |

### Init Command

> #### Options
>
> | Options              | Description                         | Data Type |
> | -------------------- | ----------------------------------- | --------- |
> | `-d` <br/> `--debug` | Logs the init process for api-test. | string    |
>
> #### Examples
>
> | Init Debug Example |  |
> | --- | --- |
> | Input | `api-test init -d` <br> `api-test init --debug` |
> | Example Output | **Intializing Api-Tests** <br> **Api Tests Config Exists** <br> true <br> <br> **User Path** <br> '/Users/UserName/Propelled/TestFiles/api-tests' <br> <br> **Template Path** <br> '/Users/UserName/FolderName/fs-api-test/dist/template' |

### Run Command

> #### Options
>
> | Options                             | Description                                                                                                                                                        | Data Type |
> | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
> | `-c` <br> `--testconfig`            | Choose your **test configuration** file                                                                                                                            | string    |
> | `-p` <br> `--testplan`              | Use a specific **test plan** file                                                                                                                                  | string    |
> | `-s` <br> `--samples`               | The number of times to execute a single test <br> [default=20]                                                                                                     | number    |
> | `-r` <br> `--runmode`               | Can be 'sequence' or 'parallel'. <br> [default='sequence']                                                                                                         | string    |
> | `-m` <br> `--maxConcurrentRequests` | When runMode='parallel' it is the maximum number of concurrent requests allowed. <br> [default=100]                                                                | string    |
> | `-o` <br> `--open`                  | Open flag automatically opens the latest benchmark results in the default browser when the test is complete                                                        | boolean   |
> | `-d` <br> `--debug`                 | Run in debug mode. This will log information about the tests in the console.                                                                                       | boolean   |
> | `-t` <br> `--trace`                 | Trace flag enables additional console logging with trace information. Will tell you what methods are being called and what data is being passed into each function | boolean   |
> | `-w` <br> `--whatif`                | Whatif flag shows debug information without actually executing the tests                                                                                           | boolean   |

> #### Examples

> | Example                             | Description                                                                                                                                                                                        |
> | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `api-test run -d -s 42 `            | Run in debug mode with a different **sample size**. In this example, the new sample size is 42.                                                                                                    |
> | `api-test run -r parallel `         | Change the run mode to **run tests concurrently**. Options are 'sequence' (default) or 'parallel'.                                                                                                 |
> | `api-test run -o -d `               | Run in debug mode and then **automatically open results in browser**                                                                                                                               |
> | `api-test run -m 30 -t `            | Change the **max number of concurrent requests**. In this example, the new max is 30. The trace flag will **log the methods** as they are called and show what data is being passed to each method |
> | `api-test run -c mytestconfig.json` | Use **mytestconfig.json** as the testconfig file                                                                                                                                                   |
> | `api-test run -p mytestplan.json`   | Use **mytestplan.jdon** as the testplan file                                                                                                                                                       |

### Input Data Hierarchy:

- Data in a testplan overrides data from the testconfig file. This is currently relevant only for header information. For more on creating testplans and testconfig files see the [template readme](./src/template/readme.md).
- Command line input **overrides default data**, including and data in testfconfig & testplan files. This remains true even if you're inputing a specific testplan and/or testconfig at the same time.

> #### Example: `api-test run -c mytestconfig.json -p mytestplan.json -s 77 `
>
> ##### This will result in the expected sample size being 77 even if it was set to a different value inside the config or test plan files.

## Customizing Route & Options

Api-test allows users to adjust a variety of route and option object variables. This can be done by customizing the testconfig, testplan, and/or using command line input.

### Route Object

| Name               | Description                                                                                                                                          | Test Plan | Test Config | Command Line |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- | ------------ |
| method             | (String, default 'get'): Http verb.                                                                                                                  | Yes       | No          | No           |
| route              | (String): the route to benchmark                                                                                                                     | Yes       | No          | No           |
| headers            | (Object): the headers to send. In case of function (that has to return an object) it will be evaulated for each request.                             | Yes       | Yes         | No           |
| data               | (Object): the data sent with the request. In case of function (that has to return an object) it will be evaulated for each request.                  | Yes       | No          | No           |
| expectedStatusCode | (Number, default null): if it is a number, generates an error when the status code of the response is different                                      | Yes       | No          | No           |
| maxMean            | (Number, default null): if it is a number, generates an error when the mean value for a benchmark cycle is more than the expected value              | Yes       | Yes         | No           |
| maxSingleMean      | (Number, default null): if it is a number, generates an error when the mean across all the concurrent requests value is more than the expected value | Yes       | Yes         | No           |

## Options Object

| Name                  | Description                                                                                                                                                     | Test Plan | Test Config | Command Line |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- | ------------ |
| debug                 | (Boolean, default false): Displays some info on the console.                                                                                                    | Yes       | Yes         | Yes          |
| runMode               | (String, default 'sequence'): Can be 'sequence' (each request is made after receiving the previous response) or 'parallel' (all requests are made in parallel). | No        | Yes         | Yes          |
| maxConcurrentRequests | (Number, default 100): When in runMode='parallel' it is the maximum number of concurrent requests are made.                                                     | No        | Yes         | Yes          |
| minSamples            | (Number, default 20): The minimum sample size required to perform statistical analysis.                                                                         | No        | Yes         | Yes          |
| global            | (Boolean, default false): If true, then resolve plugins using the global package directory, otherwise use the api-test application directory location to begin package resolution. Package resolution iterates through each parent directory until it finds a node_modules directory with the named plugin or it reaches the drive root.                                                                        | No        | Yes         | Yes          |

## Plug-Ins

### Currently Supported:

- processTestResults
- getAuthorization

### Referencing Plugins

References go in the `plugins` element of the testconfig.json file. Users can chose to load all plugins or to explicity import a subset of plugins.

| Name                 | Format                                                                      | Description                                                                                                              |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| processTestResults   | plugins: [{import: "processTestResults", from: "@someorg/my-test-plugins"}] | allows user to plug into the system and get notified when test results are available.                                    |
| getAuthorization     | plugins: [{import: "getAuthorization", from: "@someorg/my-test-plugins"}]   | allows user to add authorization header information (ie: tokens) needed to conduct tests on their API                    |
| default (import all) | plugins: ["@someorg/my-test-plugins"]                                       | uses the default imports to load all plugins contained in the package (it assumes that the package only exports plugins) |
