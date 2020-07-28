# GitHub Action to setup singularity

![CI: Build](https://github.com/eWaterCycle/setup-singularity/workflows/build-test/badge.svg)
![CI: Validate](https://github.com/eWaterCycle/setup-singularity/workflows/Validate%20'setup-singularity'/badge.svg)

To use [Singularity](https://sylabs.io/singularity/) containers in a workflow you need to install it first. This GitHub Action compiles and installs for you.

## Inputs

### `singularity-version`

Version of singularity. See [releases page](https://github.com/hpcng/singularity/releases) for available versions.

## Example usage

```yaml
steps:
- uses: actions/checkout@v2
# setup-singularity action requires a go installation
- uses: actions/setup-go@v2
  with:
    go-version: '^1.14.6'
- uses: eWaterCycle/setup-singularity@v1
  with:
    singularity-version: 3.6.1
- name: Run a singularity container
  run: singularity run docker://alpine cat /etc/os-release
```

## Build

For developers of setup-singularity action.

Install deps with

```bash
npm install
```

Build dist with

```bash
npm run build
```