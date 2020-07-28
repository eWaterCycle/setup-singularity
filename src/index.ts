import path from "path";
import { homedir, cpus } from "os";

import { info, getInput, addPath, setFailed } from "@actions/core";
import { exec } from "@actions/exec";
import { cp } from "@actions/io";
import { downloadTool, extractTar, find, cacheDir } from "@actions/tool-cache";

async function installSingularityVersion(versionSpec: string) {
  info("Downloading singularity tarball...");
  let downloadUrl = `https://github.com/hpcng/singularity/releases/download/v${versionSpec}/singularity-${versionSpec}.tar.gz`;
  const archivePath = await downloadTool(downloadUrl, undefined);
  info(
    `Successfully downloaded singularity tarball ${downloadUrl} to ${archivePath}`
  );

  info("Extracting singularity...");
  const extractDir = path.join(homedir(), "go", "src", "github.com", "hpcng");
  await extractTar(archivePath, extractDir);
  const extPath = path.join(extractDir, "singularity");
  info(`Successfully extracted singularity to ${extPath}`);

  info(`Configuring in ${extPath}`);
  const prefixDir = path.join(extPath, "prefix");
  await exec("./mconfig", ["-p", prefixDir, "--without-suid"], {
    cwd: extPath,
  });
  const buildDir = path.join(extPath, "builddir");
  info(`Compiling in ${buildDir}`);
  const jn = cpus().length.toString();
  await exec("make", ["-j", jn], { cwd: buildDir });

  info(`Installing to ${prefixDir}`);
  await exec("make install", [], { cwd: buildDir });

  info("Adding to the cache ...");
  const cachedDir = await cacheDir(prefixDir, "singularity", versionSpec);
  info(`Successfully cached singularity to ${cachedDir}`);
  return cachedDir;
}

async function main() {
  const versionSpec = getInput("singularity-version");
  info(`Setup singularity version spec ${versionSpec}`);
  // TODO check if already installed

  let cachedDir = find("singularity", versionSpec);
  if (cachedDir) {
    info(`Found in cache @ ${cachedDir}`);
  } else {
    cachedDir = await installSingularityVersion(versionSpec);
  }
  const binDir = path.join(cachedDir, "bin");
  addPath(binDir);
  info("Added singularity to the path");
  info(`Successfully setup singularity version ${versionSpec}`);
}

main()
  .then((msg) => {
    console.log(msg);
  })
  .catch((err) => {
    setFailed(err.message);
  });
