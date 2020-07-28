# GitHub Action to setup singularity

To use [Singularity](https://sylabs.io/singularity/) containers in a workflow you need to install it first. This GitHub Action compiles and installs for you.

## Inputs

### `singularity-version`

Version of singularity. See [releases page](https://github.com/hpcng/singularity/releases) for available versions.

## Example usage

```yaml
steps:
- uses: actions/checkout@v2
- uses: actions/setup-go@v2
  with:
    go-version: '^1.14.6'
- uses: eWaterCycle/setup-singularity
  with:
    singularity-version: 3.6.1
- name: Version of installed singularity
  run: singularity --version
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