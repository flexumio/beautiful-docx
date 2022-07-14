import { DeepPartial } from '../utils';
import { defaultExportOptions, DocxExportOptions, PageFormat, PageOrientation } from './optionsConfig';
import merge from 'ts-deepmerge';
import { userOptionsSchema } from './schema';

export class OptionsBuilder {
  private _userInputOptionsSchema = userOptionsSchema;
  public options: DocxExportOptions;

  constructor() {
    this.options = defaultExportOptions;
  }

  public mergeOptions(userInputOptions?: DeepPartial<DocxExportOptions>) {
    if (userInputOptions === undefined) {
      return this.options;
    }

    this._userInputOptionsSchema.parse(userInputOptions);

    this.options = merge(this.options, userInputOptions);

    return this.options;
  }
}
