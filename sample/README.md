# artillery-plugin-loadbalancer sample

## Usage

### Setup

Link `artillery-plugin-loadbalancer` for this sample repository's package.json using [`npm link`](https://docs.npmjs.com/cli/link.html)

```
# create symlink at first
cd artillery-plugin-loadbalancer/
npm link

# link created symlink to this sample repository
cd sample/
npm link artillery-plugin-loadbalancer
```

### Load Test

At first, run containers:

```
docker-compose pull
docker-compose up --build
```

Check the running containers:

```
docker-compose ps
```

output:

```
docker-compose ps
           Name                    Command         State           Ports
---------------------------------------------------------------------------------
sample_backend-service-1_1   /go/backend-service   Up      0.0.0.0:8080->8080/tcp
sample_backend-service-2_1   /go/backend-service   Up      0.0.0.0:8081->8080/tcp
```

Send gRPC request to gateway-service:

```
(cd backend-service && make run-client)
```

output:

```
2019/09/28 14:38:18 backend.Hello() message=success:<status_code:"0" >
```

containers' log:

```
backend-service_1  | time="2019-09-28T05:38:18Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:88" request=
```

### Load Test

Run the load test with:

```
npm install
DEBUG=plugin:loadbalancer npm run start
```

You can see that the requests are equally distributed in 'roundrobin' strategy:

```
backend-service-1_1  | time="2020-03-01T13:52:20Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:83" request="id:1 name:\"Alice\" "
backend-service-2_1  | time="2020-03-01T13:52:20Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:83" request="id:2 name:\"Bob\" "
backend-service-1_1  | time="2020-03-01T13:52:21Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:83" request="id:1 name:\"Alice\" "
backend-service-2_1  | time="2020-03-01T13:52:21Z" level=info msg="Hello()" func="main.(*backendServer).Hello" file="/app/main.go:83" request="id:2 name:\"Bob\" "
```
