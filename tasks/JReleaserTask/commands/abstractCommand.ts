import { CommandResponse, ICommand } from '.';
import { ITaskContext } from '../context';
import * as toolrunner from 'azure-pipelines-task-lib/toolrunner';

export abstract class AbstractCommand implements ICommand {
  options: string[] = [];

  constructor(protected toolrunner: toolrunner.ToolRunner) {}

  async run(ctx: ITaskContext): Promise<CommandResponse> {
    this.setupCommon(ctx);
    this.initialize(ctx);
    return await this.exec();
  }

  private setupCommon(ctx: ITaskContext): void {
    for (const arg of ctx.customArguments.split(' ')) {
      this.options.push(arg);
    }
  }

  public initialize(ctx: ITaskContext): void {
    this.setup(ctx);
  }

  protected buildOptions(ctx: ITaskContext, optionMapping: { [key: string]: string }): void {
    for (const key in optionMapping) {
      if (ctx[key]) {
        this.options.push(optionMapping[key]);
      }
    }
  }

  protected abstract setup(ctx: ITaskContext): void;

  abstract exec(): Promise<CommandResponse>;
}