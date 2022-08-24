/* eslint-disable no-undef */
declare let chrome: any;

export function testSendMsg() {
  chrome.runtime.sendMessage({ type: "hello" }, (res: unknown) => {
    console.log("sendMessage res :>> ", res);
  });
}

export function extFetch(
  url: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "fetch", url, init },
      (res: Response) => {
        resolve(res);
      }
    );
  });
}
