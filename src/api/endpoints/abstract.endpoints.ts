export abstract class AbstractEndpoints {
  protected abstract baseURL: string;
  protected abstract version: string;

  setVersion(version: string) {
    this.version = version;
    return this;
  }

  getURL(): string {
    return `${this.version}/${this.baseURL}`;
  }
}
