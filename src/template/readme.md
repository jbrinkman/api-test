# **api-tests - TEMPLATE INFORMATION**

### For information about using api-test, go to the [main README](../../README.md).

---

### **Creating a testconfig.json file**

---

Test configurations define the settings used for all of the tests in an associated testplan. The service and baseEndpoint are only configurable in the configuration file. All other settings can be defined on individual tests or from the command line.

Here are a few example testconfig.json files to get you started. The examples use the [reqres](https://reqres.in/) api. You will need to customize the service [ex: http://localhost:5001] and base endpoint ["/myBaseEndpoint"] to match the api you want to test.

---

#### _Example 1_

- Execute tests against an api running on localhost. Debug is turned on. Headers are used. These headers will be used for every individual test defined in the testplan.

```json
{
  "service": {
    "local": "http://localhost:5001"
  },
  "baseEndpoint": "/yourEndpointHere",
  "headers": {
    "accept": "*/*",
    "user-agent": "api-test"
  },
  "testplan": "testplan.json",
  "debug": true
}
```

#### _Example 2_

- Execute tests against a live site. Debug is turned off. This example uses [reqres](https://reqres.in/). NOTE: For numbers where |n|<1, be sure to include the leading zero. [Use 0.42 not .42]

```json
{
  "service": {
    "reqres": "https://reqres.in"
  },
  "baseEndpoint": "/api",
  "testplan": "testplan.json",
  "debug": false,
  "runMode": "sequence",
  "maxMean": 0.8,
  "maxSingleMean": 1.1
}
```

#### _Example 3_

- Execute tests against a live site and import all of the plugins in the specified package. Debug is turned off. This example uses [reqres](https://reqres.in/). NOTE: For numbers where |n|<1, be sure to include the leading zero. [Use 0.42 not .42]

```json
{
  "service": {
    "reqres": "https://reqres.in"
  },
  "baseEndpoint": "/api",
  "testplan": "testplan.json",
  "debug": false,
  "runMode": "sequence",
  "maxMean": 0.8,
  "maxSingleMean": 1.1,
  "plugins": ["@your-org/your-package"]
}
```

---

### **Creating a testplan.json file**

Test plans contain the information `api-test` needs to create an endpoint for api-benchmark tests. Test plans can include definitions for one or more tests (i.e. an array of test definitions). All testss must contain a name, method, path, and may also contain additonal parameter data.

```json
[
  {
    "name": "string",
    "method": "HttpMethod",
    "path": "string",
    "header": "Record<string,any>",
    "data": "Array<Record<string,any>>"
  }
]
```

> Below are a few example testplans to get you started. These examples use the following test configuration.

```json
{
  "service": {
    "reqres": "https://reqres.in"
  },
  "baseEndpoint": "/api",
  "headers": {
    "accept": "application/json",
    "user-agent": "api-test"
  },
  "testplan": "testplan.json",
  "debug": true,
  "plugins": []
}
```

---

#### _GET request with no parameters_

```json
[
  {
    "name": "getResourceList",
    "method": "get",
    "path": "/unknown"
  }
]
```

#### _GET request with headers_

```json
[
  {
    "name": "getResourceList",
    "method": "get",
    "headers": {
      "accept": "*/*"
    },
    "path": "/unknown"
  }
]
```

#### _GET request with 1 parameter_

```json
[
  {
    "name": "getUserList",
    "method": "get",
    "path": "/users?page=${data.page}",
    "data": [{ "page": 1 }]
  }
]
```

#### _GET request with multiple parameters_\*\*\_

> NOTE: For numbers where |n|<1, be sure to include the leading zero. [Use 0.42 not .42]

```json
[
  {
    "name": "getUserList",
    "method": "get",
    "path": "/users?page=${data.page}",
    "data": [{ "page": 1, "maxMean": 0.8, "maxSingleMean": 1.1 }]
  }
]
```

#### _POST requests must include a body in the data._\*\*\_

```json
[
  {
    "name": "createUser",
    "method": "post",
    "path": "/users",
    "data": [{ "body": { "name": "Jane Generic", "job": "Very Generic Manager" } }]
  }
]
```

#### _Multiple data sets for single test_

- A test can include multiple sets of data. This GET request test will test 3 different users.

```json
[
  {
    "name": "getSingleUser",
    "method": "get",
    "path": "/users/{data.userId}",
    "data": [{ "userId": 1 }, { "userId": 2 }, { "userId": 3 }]
  }
]
```

- **A test plan can include multiple tests. This test plan includes all the tests mentioned above.**

```json
[
  {
    "name": "getResourceList",
    "method": "get",
    "path": "/unknown"
  },
  {
    "name": "getResourceList",
    "method": "get",
    "headers": {
      "accept": "*/*",
      "authorization": "Bearer ${token}"
    },
    "path": "/unknown"
  },
  {
    "name": "getUserList",
    "method": "get",
    "path": "/users?page=${data.page}",
    "data": [{ "page": 1 }]
  },
  {
    "name": "getSingleUser",
    "method": "get",
    "path": "/users/{data.userId}",
    "data": [{ "userId": 1 }, { "userId": 2 }, { "userId": 3 }]
  },
  {
    "name": "createUser",
    "method": "post",
    "path": "/users",
    "data": [{ "body": { "name": "Jane Generic", "job": "Very Generic Manager" } }, { "body": { "name": "Gerald Regularguy", "job": "Very Regular Coder" } }]
  }
]
```

---
