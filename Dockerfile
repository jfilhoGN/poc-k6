FROM golang:1.19-alpine as builder
WORKDIR "$GOPATH"/src/go.k6.io/k6
COPY . .
RUN apk --no-cache add git &&\
    go install go.k6.io/xk6/cmd/xk6@latest &&\
    xk6 build --with github.com/grafana/xk6-output-prometheus-remote@latest &&\
    cp k6 "$GOPATH"/bin/k6
FROM alpine:3.13
RUN apk add --no-cache ca-certificates && \
    adduser -D -u 12345 -g 12345 k6
COPY --from=builder /go/bin/k6 /usr/bin/k6
USER 12345
ENTRYPOINT ["k6"]
CMD [""]