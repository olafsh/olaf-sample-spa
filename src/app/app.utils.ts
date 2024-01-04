import {ConfigModel} from "./olaf-sdk/config.model";
import {setStyles} from "./olaf-sdk/olaf.utils";
import {OLAFService} from "./olaf-sdk/olaf.service";
import {firstValueFrom} from "rxjs";
import {resolve} from "@angular/compiler-cli";

export function configFactory(OLAFService: OLAFService, configDeps: (() => Function)[]) {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      if (OLAFService.config !== undefined) {
        // return other promises (configDeps received from the outside world)
        await Promise.all(configDeps.map((dep) => dep()));
        return resolve({});
      }
      firstValueFrom(
        OLAFService.fetchConfig()
      )
        .then(async (config: ConfigModel) => {
          // set config
          OLAFService.config = config;
          // return other promises (configDeps received from the outside world)
          await Promise.all(configDeps.map((dep) => dep()));
          return resolve({});
        })
        .catch(() => reject());
    });
  };
}

export function verifyTokenFactory(OLAFService: OLAFService) {
  return (): Promise<any> => {
    return new Promise((resolve: any) => {
      OLAFService.verifyToken().subscribe({
        next: (data) => {
          if (data !== undefined) {
            OLAFService.isAuthenticated = true;
          }
        }
      }).add(resolve);
    });
  };
}
