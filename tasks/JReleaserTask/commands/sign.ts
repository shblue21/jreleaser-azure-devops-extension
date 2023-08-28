import { CommandResponse } from '.';
import * as toolrunner from 'azure-pipelines-task-lib/toolrunner';
import * as tasks from 'azure-pipelines-task-lib/task';
import { ITaskContext } from '../context';
import { AbstractDistributionModelCommand } from './abstractDistributionModelCommand';

export class JReleaserSign extends AbstractDistributionModelCommand {
  constructor(toolrunner: toolrunner.ToolRunner) {
    super(toolrunner);
  }

  protected setup(ctx: ITaskContext): void {
    this.options.unshift('sign');
  }

  exec(): Promise<CommandResponse> {
    for (const option of this.options) {
      this.toolrunner.arg(option);
    }
    tasks.debug(`Running JReleaser with options: ${this.options.join(' ')}`);

    const runnerResult = this.toolrunner.execSync();
    if (runnerResult.code === 0) {
      return Promise.resolve(new CommandResponse(0));
    } else {
      return Promise.reject(new CommandResponse(1, `Failed to initialize JReleaser. Exit code: ${runnerResult.code}`));
    }
  }
}
