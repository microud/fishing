import { FishGet, FishParams, FishPond, FishQuery } from '../src';
import { QueryWeatherDto } from './request.dto';
import { AxiosResponse } from 'axios';
import { createServer } from './server';
import { Server } from 'http';
import { AddressInfo } from 'net';

class TestParamGetParamsDto {
  param: string;
}

class TestGetWithQueryDto {
  foo: string;
  hello: string;
}

class GetTest {

  @FishPond()
  public baseUrl: string;

  @FishGet('/simple/get')
  async testSimpleGetMethod(): Promise<AxiosResponse> { return; }

  @FishGet('/param/:param/get')
  async testParamGetMethod(
    @FishParams() params: TestParamGetParamsDto,
  ): Promise<AxiosResponse> { return; }

  @FishGet('/query/get')
  async testGetWithQueryMethod(
    @FishQuery() query: TestGetWithQueryDto,
  ): Promise<AxiosResponse> { return; }
}

describe('test get method', () => {
  let server: Server;
  let test: GetTest;

  beforeAll(async () => {
    server = await createServer();
    test = new GetTest();
    const address = server.address() as AddressInfo;
    test.baseUrl = `http://${address.address}:${address.port}`;
  }, 10000);

  afterAll(() => {
    server.close();
  });

  it('should response the correct status of ok', async () => {
    const { data } = await test.testSimpleGetMethod();

    expect(data.status).toBe('ok');
  });

  it('should accept param and response with it', async () => {
    const param = 'hello';
    const { data } = await test.testParamGetMethod({
      param,
    });

    expect(data.status).toBe('ok');
    expect(data.param).toBe(param);
  });

  it('should return back all query attributes', async () => {
    const query = {
      foo: 'bar',
      hello: 'world',
    };

    const { data } = await test.testGetWithQueryMethod(query);

    expect(data.status).toBe('ok');
    expect(data.query).toEqual(query);
  });
});
