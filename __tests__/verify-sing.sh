#!/bin/sh

if [ -z "$1" ]; then
  echo "Must supply singularity version argument"
  exit 1
fi

sing_version="$(singularity --version)"
echo "Found singularity version '$sing_version'"
if [ -z "$(echo $sing_version | grep $1)" ]; then
  echo "Unexpected version"
  exit 1
fi
