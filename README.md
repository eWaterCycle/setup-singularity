# GitHub Action to setup singularity

![CI](https://github.com/eWaterCycle/setup-singularity/workflows/build-test/badge.svg)
![Validate versions](https://github.com/eWaterCycle/setup-singularity/workflows/Validate%20'setup-singularity'/badge.svg)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.3964181.svg)](https://doi.org/10.5281/zenodo.3964181)

To use [Singularity](https://sylabs.io/singularity/) containers in a workflow you need to install it first. This GitHub Action downloads, compiles and installs it for you.

## Inputs

### `singularity-version`

Version of singularity. See [releases page](https://github.com/hpcng/singularity/releases) for available versions. Versions lower then 3.6 need additional OS packages installed like `uuid-dev`.

## Outputs

### `installDir`

Location on runner where singularity was installed. The `<installDir>/bin` is added to PATH env var during action execution.

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
