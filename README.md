# fastify-sample
| ![Statements](https://img.shields.io/badge/statements-78.76%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-83.33%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-68.75%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-78.76%25-red.svg?style=flat) | ![jscpd](https://raw.githubusercontent.com/inaiat/fastify-sample/main/assets/jscpd-badge.svg?sanitize=true)

**Fastify version 4 sample with functional approach**

This project is a small but feature complete application build with Fastify, native mongodb driver and papr (typesafe models for mongodb),
and it aims to show functional approach, dependency injection and type safe programming.

* Update 2022-07-14 -> This project is pure native ESM! :D

Useful links of libs that we use on this project:

1. NeverThrow (avoid throwing exceptions) -> https://github.com/supermacro/neverthrow
1. Papr (Typesafe schemas for mongodb ) -> https://plexinc.github.io/papr/#/
1. Awilix (Dependency Inejection) -> https://github.com/jeffijoe/awilix
1. Ava (Test Runner) -> https://github.com/avajs/ava
1. Fastify -> https://github.com/fastify/fastify


How to run:

```
git clone git@github.com:inaiat/fastify-sample.git
cd fastify-sample
docker run -d -p 27017:27017 mongo
yarn dev
```

If everything went well you can play here -> http://localhost:3000/docs
