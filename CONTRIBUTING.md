# Contributing Guide

When contributing to this repository, please first discuss the change you wish
to make via issue, email, or any other method with the owners of this repository
before making any changes. This way we can guide you through the process and
give feedback.

## 🍽️ Pull Request Process

You can contribute changes to this repo by opening a pull request:

1. After forking this repository to your Git account, make the proposed changes on your forked branch.
2. Run tests and linting locally.
3. Commit your changes and push them to your forked repository.
4. Navigate to the main project repository and select the _Pull Requests_ tab.
5. Click the _New pull request_ button, then select the option "Compare across forks"
6. Leave the base branch set to main. Set the compare branch to your forked branch, and open the pull request.
7. Once your pull request is created, ensure that all checks have passed and that your branch has no conflicts with the base branch. If there are any issues, resolve these changes in your local repository, and then commit and push them to git.
8. Similarly, respond to any reviewer comments or requests for changes by making edits to your local repository and pushing them to Git.
9. Once the pull request has been reviewed, those with write access to the branch will be able to merge your changes into the project repository.

If you need more information on the steps to create a pull request, you can find a detailed walkthrough in the [Github documentation][pull-requests-docs].


## 🏁 Quick Start

### Prerequisites

The following are required to run the application in development or in production environment:

- [Node.js](https://nodejs.org/en/download) v20.11.0 or greater.
- [Docker](https://docs.docker.com/engine/install), v2.10 or greater.

### Generate Secret Key

Before you continue, you need to create `.env` file (you can duplicate `.env.example`) and
fill the `application secret key` with some random string. To generate a secret key, use
the following command:

```sh
pnpm generate-key
```

### Up and Running

1. Install dependencies: `pnpm install`
2. Prepare environment: `pnpm pre-dev`
3. Run database migration: `pnpm db:migrate`
4. Run database seeder: `pnpm db:seed`
5. Start development: `pnpm dev`

Application will run at `http://localhost:8030`

## 🧑🏻‍💻 Development

TODO

### Publish Docker Image

```sh
echo $GH_TOKEN | docker login ghcr.io --username CHANGEME --password-stdin
```

### Running Docker Image

```sh
docker run --rm -it --name trusty --env-file .env -p 8030:8030 ghcr.io/riipandi/trusty:edge
```

### Simple Load Testing

Using [`hey`](https://github.com/rakyll/hey) to perform a load testing:

```sh
hey -n 1000 -c 200 -z 30s -m GET -T "application/json" https://localhost:8030/api/health
```

Using [`drill`](https://github.com/fcsonline/drill) to perform a load testing:

```sh
I=1000 C=10 drill -s --benchmark benchmark.yml --tags post_auth
```

Using [`vegeta`](https://github.com/tsenart/vegeta) to perform a load testing:

```sh
echo "GET http://localhost:8030/api" | vegeta attack -duration=5s | tee benchmark-results.bin | vegeta report

# With authentication
echo "GET http://localhost:8030/api/users" | \
 vegeta attack -duration=5s -header "Authorization: Token ${JWT_TOKEN}" | \
 tee benchmark-results.bin | vegeta report
```

[pull-requests-docs]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
