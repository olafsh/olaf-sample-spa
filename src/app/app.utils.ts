import {ConfigModel} from "./olaf-sdk/config.model";
import {setStyles} from "./olaf-sdk/olaf.utils";
import {OLAFService} from "./olaf-sdk/olaf.service";
import {firstValueFrom} from "rxjs";

export function configFactory(OLAFService: OLAFService, configDeps: (() => Function)[]) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      firstValueFrom(
        OLAFService.fetchConfig()
      )
        .then((config: ConfigModel) => {
          // set config
          OLAFService.config = config;
          // set styles
          setStyles(config.styles);
          // return other promises
          return Promise.all(configDeps.map((dep) => dep())); // configDeps received from the outside world
        })
        .then(() => {
          resolve({});
        })
        .catch(() => {
          reject();
        });
    });
  };
}

export function verifyTokenFactory(OLAFService: OLAFService) {
  return (): Promise<any> => {
    return new Promise((resolve: any) => {
      OLAFService.verifyToken().subscribe({
        next: () => {
          OLAFService.isAuthenticated = true;
        }
      }).add(resolve);
    });
  };
}
