import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}
async function initGit(options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  const resultGitAdd = await execa('git add', ['.'], {
    cwd: options.targetDirectory,
  });

  if (resultGitAdd.failed) {
    return Promise.reject(new Error('Failed to add files to git'));
  }

  const resultGitCommit = await execa('git commit', ['-m "Service Initialized"'], {
    cwd: options.targetDirectory,
  });

  if (resultGitCommit.failed) {
    return Promise.reject(new Error('Failed to commit files to master branch'));
  }

  return;
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.resolve(
    __dirname,
    '../templates',
    options.template.toLowerCase()
  );

  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      // Rename the gitignore file for .gitignore and init git repo
      task: () => fs.renameSync(`${options.targetDirectory}/gitignore`, `${options.targetDirectory}/.gitignore`, initGit(options)),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  console.log(('\n'),
    chalk.bgRed.white
      ` Happy Coding Soltivorian ! `, chalk('🦄'), ('\n')
  );
  return true;
}