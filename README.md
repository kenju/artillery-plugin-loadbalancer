# artillery-plugin-loadbalancer

[![npm version](https://badge.fury.io/js/artillery-plugin-loadbalancer.svg)](https://badge.fury.io/js/artillery-plugin-loadbalancer)

Load Balance your request to multiple targets for [Artillery.io](https://artillery.io/)

## Usage

### Install the plugin

```sh
# if `artillery` is installed globally
npm install -g artillery-plugin-loadbalancer
```

### Define your scenario

#### .proto file

```proto
syntax = "proto3";

package backend.services.v1;

service HelloService {
    rpc Hello (HelloRequest) returns (HelloResponse) {
    }
}

message HelloRequest {
    int32 id = 1;
    string name = 2;
}

message HelloResponse {
    string message = 1;
}
```

#### scenario file

Add `config.plugins.loadbalancer` settings as follows:

```yml
# my-scenario.yml
config:
  target: 127.0.0.1:8080
  phases:
    - duration: 10 #sec
      arrivalRate: 1
  plugins:
    loadbalancer:
      strategy: roundrobin
      targets:
        - target: 127.0.0.1:8080
        - target: 127.0.0.1:8081
  engines:
    grpc:
      protobufDefinition:
        filepath: protobuf-definitions/backend/services/v1/hello.proto
        package: backend.services.v1
        service: HelloService
      protoLoaderConfig:
        includeDirs: [ './protobuf-definitions' ]

scenarios:
  - name: test backend-service
    engine: grpc
    flow:
      - Hello:
          id: 1
          name: Alice
      - Hello:
          id: 2
          name: Bob
```

### Run the scenario

```
artillery run my-scenario.yml
```

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
