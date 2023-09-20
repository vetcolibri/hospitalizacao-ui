import type { HttpClient } from "../http_client";

export class AlertAPI {
  readonly httpClient: HttpClient;
  readonly baseUrl: string;
  readonly resource: string;

  constructor(httpClient: HttpClient, baseUrl: string) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.resource = "alerts";
  }

  schedule(requestBody: any) {
    this.httpClient.post(
      `${this.baseUrl}/${this.resource}/schedule`,
      requestBody,
    );
  }

  disable(alertId: string) {
    this.httpClient.post(`${this.baseUrl}/${this.resource}/disable`, {
      alertId,
    });
  }
}
