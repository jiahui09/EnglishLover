FROM golang:1.26-alpine AS build
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/englishlover-api ./cmd/api

FROM alpine:3.22
WORKDIR /app
COPY --from=build /out/englishlover-api /usr/local/bin/englishlover-api
COPY backend/migrations ./migrations
EXPOSE 8080
CMD ["englishlover-api"]
