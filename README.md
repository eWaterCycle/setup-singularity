# GitHub Action to setup singularity

[![CI](https://github.com/eWaterCycle/setup-singularity/workflows/build-test/badge.svg)](https://github.com/eWaterCycle/setup-singularity/actions?query=workflow%3Abuild-test)
[![Validate versions](https://github.com/eWaterCycle/setup-singularity/workflows/Validate%20'setup-singularity'/badge.svg)](https://github.com/eWaterCycle/setup-singularity/actions?query=workflow%3A%22Validate+%27setup-singularity%27%22)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.3964180.svg)](https://doi.org/10.5281/zenodo.3964180)

To use [Singularity](https://sylabs.io/singularity/) containers in a workflow you need to install it first. This GitHub Action downloads, compiles and installs it for you.

The setup will add the singularity executable to the PATH env var so it can be called in later steps.
It also sets `SINGULARITY_ROOT` env var to the location where singularity was installed.

## Inputs

### `singularity-version`

Version of singularity. See [releases page](https://github.com/hpcng/singularity/releases) for available versions. If a binary build of a version is available on [https://github.com/eWaterCycle/singularity-versions/releases](https://github.com/eWaterCycle/singularity-versions/releases) it is used otherwise the version is build during the action, which requires a [go](https://golang.org/) installation and takes significantly longer.

## Example usage

```yaml
steps:
- uses: actions/checkout@v2
- uses: eWaterCycle/setup-singularity@v7
  with:
    singularity-version: 3.8.3
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
