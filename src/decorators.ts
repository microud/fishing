import 'reflect-metadata';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import { REQUEST_BASEURL_MARKUP, REQUEST_METHOD_PARAMETERS } from './constants';
import * as FormData from 'form-data';

type RequestBodyType = 'text' | 'xml' | 'json' | 'form';

function SetParameter(parameter: any) {
  return (
    target: object,
    propertyKey: string | symbol,
    paramIndex: number,
  ) => {
    const params =
      Reflect.getMetadata(REQUEST_METHOD_PARAMETERS, target[propertyKey]) || [];
    params.push({
      index: paramIndex,
      ...parameter,
    });
    Reflect.defineMetadata(REQUEST_METHOD_PARAMETERS, params, target[propertyKey]);
  };
}

export function FishRequest(config: AxiosRequestConfig): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originMethod = descriptor.value;

    axios.interceptors.request.use(value => {
      return value;
    });

    axios.interceptors.response.use(value => {
      return value;
    });

    descriptor.value = async function (...args: any[]) {
      let headers, params, data, response;

      const baseURL = Reflect.getMetadata(REQUEST_BASEURL_MARKUP, target);
      if (baseURL) {
        axios.defaults.baseURL = this[baseURL];
      }

      const parameters = Reflect.getMetadata(REQUEST_METHOD_PARAMETERS, originMethod) || [];
      for (const parameter of parameters) {
        switch (parameter.type) {
          case 'response':
            response = parameter;
            if (parameter.dataType) {
              config.responseType = parameter.dataType;
            }
            break;
          case 'header':
            headers = headers ? Object.assign(headers, args[parameter.index]) : args[parameter.index];
            break;
          case 'param':
            const urlParams = args[parameter?.index];
            for (const key of Object.keys(urlParams)) {
              config.url = config.url.replace(`:${key}`, String(urlParams[key]));
            }
            break;
          case 'query':
            params = args[parameter.index];
            break;
          case 'body':
            data = args[parameter.index];
            switch (parameter.contentType) {
              case 'form':
                const formData = new FormData();
                for (const key of Object.keys(data)) {
                  formData.append(key, data[key]);
                }

                data = formData;
                headers = headers ? Object.assign(headers, formData.getHeaders()) : formData.getHeaders();
                break;
              default:

            }
            break;
        }
      }

      try {
        const result = await axios({
          ...config,
          params,
          headers,
          data,
        });

        if (!response) {
          return result;
        }

        args[response.index] = result;
        return originMethod(...args).bind(this);
      } catch (e) {
        console.log(e);
      }
    };
  };
}

function JudgeAndRequest(urlOrConfig: string | AxiosRequestConfig, config: AxiosRequestConfig): MethodDecorator {
  if (typeof urlOrConfig === 'string') {
    config.url = urlOrConfig;
  } else {
    config = Object.assign(urlOrConfig, config);
  }

  return FishRequest(config);
}

export function FishGet(config?: AxiosRequestConfig): MethodDecorator;
export function FishGet(url: string, config?: AxiosRequestConfig): MethodDecorator;
export function FishGet(urlOrConfig?: string | AxiosRequestConfig, config?: AxiosRequestConfig): MethodDecorator {
  return JudgeAndRequest(urlOrConfig, config || {
    method: 'GET',
  });
}

export function FishPost(config?: AxiosRequestConfig): MethodDecorator;
export function FishPost(url: string, config?: AxiosRequestConfig): MethodDecorator;
export function FishPost(urlOrConfig?: string | AxiosRequestConfig, config?: AxiosRequestConfig): MethodDecorator {
  return JudgeAndRequest(urlOrConfig, config || {
    method: 'POST',
  });
}

export function FishPut(config?: AxiosRequestConfig): MethodDecorator;
export function FishPut(url: string, config?: AxiosRequestConfig): MethodDecorator;
export function FishPut(urlOrConfig?: string | AxiosRequestConfig, config?: AxiosRequestConfig): MethodDecorator {
  return JudgeAndRequest(urlOrConfig, config || {
    method: 'PUT',
  });
}

export function FishDelete(config?: AxiosRequestConfig): MethodDecorator;
export function FishDelete(url: string, config?: AxiosRequestConfig): MethodDecorator;
export function FishDelete(urlOrConfig?: string | AxiosRequestConfig, config?: AxiosRequestConfig): MethodDecorator {
  return JudgeAndRequest(urlOrConfig, config || {
    method: 'DELETE',
  });
}

export function FishPond(): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(REQUEST_BASEURL_MARKUP, propertyKey, target);
  };
}

export function FishHeaders(): ParameterDecorator {
  return SetParameter({
    type: 'header',
  });
}

export function FishParams(): ParameterDecorator {
  return SetParameter({
    type: 'param',
  });
}

export function FishQuery(): ParameterDecorator {
  return SetParameter({
    type: 'query',
  });
}

export function FishBody(contentType?: RequestBodyType): ParameterDecorator {
  return SetParameter({
    type: 'body',
    contentType,
  });
}

export function FishResponse(dataType: ResponseType): ParameterDecorator {
  return SetParameter({
    type: 'response',
    dataType,
  });
}
