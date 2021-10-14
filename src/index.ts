import path from "path";
import { cpus, arch, homedir } from "os";

import {
  info,
  getInput,
  addPath,
  setFailed,
  exportVariable,
} from "@actions/core";
import { exec } from "@actions/exec";
import {
  downloadTool,
  extractTar,
  find,
  cacheDir,
  IToolRelease,
  getManifestFromRepo,
  findFromManifest,
} from "@actions/tool-cache";

const TOKEN = getInput("token");
const AUTH = `token ${TOKEN}`;
const MANIFEST_REPO_OWNER = "eWaterCycle";
const MANIFEST_REPO_NAME = "singularity-versions";

async function findReleaseFromManifest(
  semanticVersionSpec: string,
  architecture: string
): Promise<IToolRelease | undefined> {
  const manifest: IToolRelease[] = await getManifestFromRepo(
    MANIFEST_REPO_OWNER,
    MANIFEST_REPO_NAME,
    AUTH,
    "main"
  );
  return await findFromManifest(
    semanticVersionSpec,
    true,
    manifest,
    architecture
  );
}

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
  const extPath = path.join(extractDir, `singularity-${versionSpec}`);
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

  let installDir = find("singularity", versionSpec);
  if (installDir) {
    info(`Found in cache @ ${installDir}`);
  } else {
    info(`Version ${versionSpec} was not found in the local cache`);
    const foundRelease = await findReleaseFromManifest(versionSpec, arch());
    if (foundRelease && foundRelease.files && foundRelease.files.length > 0) {
      info(
        `Binary build of version ${versionSpec} is available for downloading`
      );
      const downloadUrl = foundRelease.files[0].download_url;
      info(`Download from "${downloadUrl}"`);
      const archive = await downloadTool(downloadUrl, undefined, AUTH);
      info("Extract downloaded archive");
      const extPath = await extractTar(archive);
      info("Adding to the cache ...");
      installDir = await cacheDir(extPath, "singularity", versionSpec);
      info(`Successfully cached singularity to ${installDir}`);
    } else {
      info(
        `Binary build of version ${versionSpec} is not available for downloading`
      );
      installDir = await installSingularityVersion(versionSpec);
    }
  }
  const binDir = path.join(installDir, "bin");
  addPath(binDir);
  exportVariable("SINGULARITY_ROOT", installDir);
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
