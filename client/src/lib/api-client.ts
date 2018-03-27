import { ApiQueryRequest, ApiQueryResponse, Arg, IncomingRequest, deepFreeze, ErrorResponse, HumanError } from '../common/lib';

async function request(url: string, sessionToken: string | null, json: object | object[]) {
  const headers: { [k: string]: string } = {
    'Content-Type': 'application/json',
  };

  if (sessionToken !== null) {
    headers['x-session-token'] = sessionToken;
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: new Headers(headers),
  });

  if (response.status >= 400) {
    const json: ErrorResponse = await response.json();

    if (json.status !== 'Error') throw new Error('Invalid response');

    const error: Error = new Error(json.message);

    if (json.title) {
      (error as HumanError).title = json.title;
    }

    return Promise.reject(error);
  }

  return deepFreeze(await response.json());
}

export function ApiClient() {
  return {
    async getApi<TApi>(apiName: string): Promise<(sessionToken: string | null) => TApi> {
      const apiQueryRequest: ApiQueryRequest = { apiName };

      let baseUrl = '';

      if (window.location.port === '4444') {
        baseUrl = 'http://localhost:8084';
      }

      const apiQueryResponse: ApiQueryResponse = await request(`${baseUrl}/api/query`, null, apiQueryRequest);

      const api: { [methodName: string]: (...args: Arg[]) => Promise<Arg> } = {};

      return (sessionToken: string | null) => {
        function generateProxy(methodName: string) {
          return (...args: Arg[]) => {
            const req: IncomingRequest = { apiName, methodName, args };

            return request(`${baseUrl}/api/invoke`, sessionToken, req);
          };
        }

        apiQueryResponse.methods.forEach((methodName) => {
          api[methodName] = generateProxy(methodName);
        });

        return (api as any) as TApi;
      };
    },
  };
}
