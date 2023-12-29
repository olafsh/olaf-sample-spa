import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, Subscription, throwError} from "rxjs";
import {ConfigModel} from "./config.model";
import {
  bufferToBase64UrlEncoded,
  createQueryParams,
  createRandomString,
  fetchObservable,
  parseQueryResult,
  sha256
} from "./olaf.utils";
import {AuthModel} from "./auth.model";

@Injectable({
  providedIn: 'root'
})
export class OLAFService {
  CONFIG_PATH = "/config/app/";
  ACCESS_TOKEN_PATH = "/o/token/";
  VERIFY_TOKEN_PATH = "/o/verify-token/";

  private AUTHORIZE_PATH = "/o/authorize/";
  private LOGOUT_PATH = "/o/logout/";
  private AUTHORIZE_STORAGE_KEY = "olaf.auth.o";
  private ACCESS_TOKEN_STORAGE_KEY = "olaf.auth.token";

  private CONFIG_STORAGE_KEY = "olaf.config";
  private CONFIG_TTL = 3600;

  config$$: BehaviorSubject<ConfigModel | undefined> = new BehaviorSubject<ConfigModel | undefined>(undefined);
  isAuthenticated$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get config(): ConfigModel | undefined {
    return this.config$$.value;
  }

  set config(config: ConfigModel) {
    this.config$$.next(config);
    localStorage.setItem(this.CONFIG_STORAGE_KEY, JSON.stringify(config));
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$$.value;
  }

  set isAuthenticated(value: boolean) {
    this.isAuthenticated$$.next(value);
  }

  constructor() {
  }

  private setAuthToLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/expiresIn in local storage to keep user logged in between page refreshes
    console.log(auth);
    if (auth && auth.access_token) {
      localStorage.setItem(this.ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      return JSON.parse(localStorage.getItem(this.ACCESS_TOKEN_STORAGE_KEY) ?? "");
    } catch (error) {
      return undefined;
    }
  }

  public async buildAuthorizeUrl(): Promise<string> {
    const config = this.config;
    if (config === undefined) {
      return "";
    }
    const codeVerifier = createRandomString();
    const codeChallengeBuffer = await sha256(codeVerifier);
    const codeChallenge = bufferToBase64UrlEncoded(codeChallengeBuffer);
    const redirectUrl = `${config.redirect_url}`;
    // authorize params
    const params = {
      client_id: config.client_id,
      response_type: "code",
      redirect_uri: redirectUrl,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };
    // generate authorize url
    const authorizeUrl = `${config.api_endpoint}${this.AUTHORIZE_PATH}?${createQueryParams(params)}`;
    // save data to session storage
    const authorizeStorageParams = {
      code_verifier: codeVerifier,
      redirect_uri: params.redirect_uri,
    };
    sessionStorage.setItem(this.AUTHORIZE_STORAGE_KEY, JSON.stringify(authorizeStorageParams));
    // return generated authorize url
    return authorizeUrl;
  }

  public async loginWithRedirect() {
    return await this.buildAuthorizeUrl();
  }

  logout(): Subscription | Observable<any> | undefined {
    const config = this.config
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    const headers = new Headers({
      Authorization: `Bearer ${auth.access_token}`,
    });
    return fetchObservable("POST", `${config?.api_endpoint}${this.LOGOUT_PATH}`, null, headers, true).subscribe({
      next: () => {
        localStorage.removeItem(this.ACCESS_TOKEN_STORAGE_KEY);
        window.location.href = window.location.origin;
      },
    });
  }

  verifyTokenHttp(auth: AuthModel): Observable<any> {
    const config = this.config;
    const headers = new Headers({
      Authorization: `Bearer ${auth.access_token}`,
    });
    return fetchObservable("POST", `${config?.api_endpoint}${this.VERIFY_TOKEN_PATH}`, null, headers).pipe(
      catchError((response: Response) => {
        return of("skip");
      })
    );
  }

  verifyToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }
    return this.verifyTokenHttp(auth).pipe(
      map((data: any) => {
        if (data === "skip") {
          return false;
        }
        this.isAuthenticated = true;
        return data;
      })
    );
  }

  handleRedirectCallback(): Observable<any> {
    // get params
    const queryStringFragments = window.location.href.split("?").slice(1);
    if (queryStringFragments.length === 0) {
      // remove authorize data from session storage
      sessionStorage.removeItem(this.AUTHORIZE_STORAGE_KEY);
      return throwError(() => "There are no query params available for parsing.");
    }
    const {code} = parseQueryResult(queryStringFragments.join(""));
    // get authorize data
    let authorizeData = JSON.parse(sessionStorage.getItem(this.AUTHORIZE_STORAGE_KEY) ?? "");
    // remove authorize data from session storage
    sessionStorage.removeItem(this.AUTHORIZE_STORAGE_KEY);
    // authorize data should have a `code_verifier` to do PKCE
    if (!authorizeData || !authorizeData.code_verifier) {
      return throwError(() => "Invalid state");
    }
    // get access token
    return this.getAccessToken(authorizeData.code_verifier, code).pipe(
      map((data: any) => {
        if (data != null && "error" in data) {
          return data;
        }
        // save access token
        const auth: AuthModel = new AuthModel(data);
        return this.setAuthToLocalStorage(auth);
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAccessToken(code_verifier: string, code: string | undefined) {
    const config = this.config;
    const body = {
      client_id: config?.client_id,
      grant_type: "authorization_code",
      redirect_uri: config?.redirect_url,
      code_verifier,
      code,
    };
    return fetchObservable("POST", `${config?.api_endpoint}${this.ACCESS_TOKEN_PATH}`, JSON.stringify(body));
  }

  getRefreshToken(token: string): Observable<any> {
    const config = this.config;
    const body = {
      refresh_token: token,
      client_id: config?.client_id,
      grant_type: "refresh_token",
    };
    return fetchObservable("POST", `${config?.api_endpoint}${this.ACCESS_TOKEN_PATH}`, JSON.stringify(body));
  }
}