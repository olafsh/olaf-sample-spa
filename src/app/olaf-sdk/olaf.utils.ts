import {from, Observable, of, switchMap} from "rxjs";

export const getHost = () => {
  const result: RegExpMatchArray | null = location.origin.match(
    "http(s)?:\\/\\/(?<host>[A-Za-z0-9-.]*)((:\\d*))?(.*)?"
  );
  const groups = result ? result.groups : null;
  if (groups == null || !("host" in groups)) {
    return null;
  }
  return groups["host"];
};

export const setStyles = (styles: any) => {
  const _document = document.documentElement;
  styles.map((s: any) => {
    _document.style.setProperty(s["name"], String(s["value"]));
  });
}

export const getCrypto = () => {
  // ie 11.x uses msCrypto
  return (window.crypto || (window as any).msCrypto) as Crypto;
};

export const getCryptoSubtle = () => {
  const crypto = getCrypto();
  // safari 10.x uses webkitSubtle
  return crypto.subtle || (crypto as any).webkitSubtle;
};

export const createRandomString = () => {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let random = "";
  const randomValues = Array.from(getCrypto().getRandomValues(new Uint8Array(43)));
  randomValues.forEach((v) => (random += charset[v % charset.length]));
  return random;
};

export const sha256 = async (s: string) => {
  const digestOp: any = getCryptoSubtle().digest({name: "SHA-256"}, new TextEncoder().encode(s));
  // msCrypto (IE11) uses the old spec, which is not Promise based
  // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
  // Instead of returning a promise, it returns a CryptoOperation with a result property in it.
  // As a result, the various events need to be handled in the event that we're
  // working in IE11 (hence the msCrypto check). These events just call resolve
  // or reject depending on their intention.
  if ((window as any).msCrypto) {
    return new Promise((res, rej) => {
      digestOp.oncomplete = (e: any) => {
        res(e.target.result);
      };
      digestOp.onerror = (e: ErrorEvent) => {
        rej(e.error);
      };
      digestOp.onabort = () => {
        rej("The digest operation was aborted");
      };
    });
  }
  return await digestOp;
};

const urlEncodeB64 = (input: string) => {
  const b64Chars: { [index: string]: string } = {"+": "-", "/": "_", "=": ""};
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};

export const bufferToBase64UrlEncoded = (input: number[] | Uint8Array) => {
  const safeInput = new Uint8Array(input);
  return urlEncodeB64(window.btoa(String.fromCharCode(...Array.from(safeInput))));
};

export const createQueryParams = (params: any) => {
  return Object.keys(params)
    .filter((k) => typeof params[k] !== "undefined")
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};

export const parseQueryResult = (queryString: string) => {
  if (queryString.indexOf("#") > -1) {
    queryString = queryString.substr(0, queryString.indexOf("#"));
  }

  const queryParams = queryString.split("&");

  const parsedQuery: any = {};
  queryParams.forEach((qp) => {
    const [key, val] = qp.split("=");
    parsedQuery[key] = decodeURIComponent(val);
  });

  return {
    ...parsedQuery,
    expires_in: parseInt(parsedQuery.expires_in),
  };
};

export function fetchObservable<T>(
  method: string,
  url: string,
  body?: BodyInit | null,
  headers?: Headers | null,
  includeCredentials = false,
): Observable<any> {
  if (headers == null) {
    headers = new Headers({
      "Content-Type": "application/json",
    });
  }
  // !! for sending cookies and session data !!
  const credentials: RequestCredentials = includeCredentials ? "include" : "omit";
  return from(fetch(url, {method, headers, body, credentials})).pipe(
    switchMap((response) => {
      if (response.status === 201 || response.status === 204) {
        return of(null);
      } else if (response.status === 401) {
        throw response;
      }
      return response.json();
    })
  ) as Observable<T>;
}
