/* eslint-disable no-undef */
declare let chrome: any;

export function extFetch(
  url: RequestInfo | URL,
  preFn = "json",
  init?: RequestInit | undefined
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { type: "fetch", url, init, preFn },
        (res: any) => {
          resolve(res);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
