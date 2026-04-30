import axios from 'axios';
import { File } from 'docx';
import { DocumentBuilder } from './DocumentBuilder';
import { HtmlParser } from './htmlParser';
import { defaultExportOptions } from './options';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const imageBuffer = fs.readFileSync(path.join(__dirname, '../example/test-icon.png'));

describe('DocumentBuilder', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: imageBuffer });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return File', async () => {
    const exampleText = fs.readFileSync('./example/exampleText.html', 'utf8');

    const content = await new HtmlParser(defaultExportOptions).parse(exampleText);

    const instance = new DocumentBuilder(defaultExportOptions);

    expect(instance.build(content)).toBeInstanceOf(File);
  });
});
