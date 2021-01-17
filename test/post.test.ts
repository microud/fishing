import { FishBody, FishGet, FishParams, FishPond, FishPost, FishQuery } from '../src';
import { QueryWeatherDto } from './request.dto';
import { AxiosResponse } from 'axios';
import { createServer } from './server';
import { Server } from 'http';
import { AddressInfo } from 'net';
import ReadableStream = NodeJS.ReadableStream;
import { createReadStream } from 'fs';

class TestSimplePostBodyDto {
  method: string;
  hello: string;
}

class TestUploadPostBodyDto {
  first: ReadableStream;
  second: ReadableStream;
  firstName: string;
  secondName: string;
}

class PostTest {

  @FishPond()
  public baseUrl: string;

  @FishPost('/simple/post')
  async testSimplePostMethod(
    @FishBody('json') body: TestSimplePostBodyDto,
  ): Promise<AxiosResponse> { return; }

  @FishPost('/upload/post')
  async testUploadPostMethod(
    @FishBody('form') body: TestUploadPostBodyDto,
  ): Promise<AxiosResponse> { return; }
}

describe('test get method', () => {
  let server: Server;
  let test: PostTest;

  beforeAll(async () => {
    server = await createServer();
    test = new PostTest();
    const address = server.address() as AddressInfo;
    test.baseUrl = `http://${address.address}:${address.port}`;
  }, 10000);

  afterAll(() => {
    server.close();
  });

  it('should post a request and get response with body', async () => {
    const body = {
      hello: 'world',
      method: 'post',
    };
    const { data } = await test.testSimplePostMethod(body);

    expect(data.body).toEqual(body);
  });

  it('should upload two file', async () => {
    const body: TestUploadPostBodyDto = {
      first: createReadStream('./package.json'),
      firstName: 'first.json',
      second: createReadStream('./package.json'),
      secondName: 'second.json',
    };

    const { data } = await test.testUploadPostMethod(body);

    expect(body.firstName).toEqual(data.body.firstName);
    expect(body.secondName).toEqual(data.body.secondName);
  });

});
