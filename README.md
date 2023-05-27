# lcov-job-summary

This action writes LCOV coverage report summary to GitHub Actions Job Summary.

![Preview](https://user-images.githubusercontent.com/7447366/191450696-35d87c01-3cb9-4c35-b6b8-2132e9b05d64.png)

## Usage

See [action.yml](./action.yml).

`coverage/lcov.info` is used by default.

```yml
steps:
  - run: npm test -- --coverage
  - uses: livewing/lcov-job-summary@v1.1.0
```

### Specify LCOV report file

```yml
steps:
  - uses: livewing/lcov-job-summary@v1.1.0
    with:
      lcov: path/to/lcov.info
```

## License

[MIT License](./LICENSE)
