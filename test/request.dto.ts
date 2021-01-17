import ReadableStream = NodeJS.ReadableStream;

export class QueryWeatherDto {
  stationId: number | string;
}

export class QueryBilibiliRankingDto {
  rid: number | string;
}

export class SmMsAccountDto {
  username: string;
  password: string;
}

export class SmMsGetTokenResponseDto {
  success: boolean;
  code: string;
  message: string;
  data: {
    token: string;
  };
  RequestId: string;
}

export class SmMsUploadHeaders {
  Authorization: string;
  'Content-Type'?: string;
}

export class SmMsUploadFormData {
  smfile: ReadableStream;
  format: 'json' | 'xml';
}
