// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlAdmin: "http://localhost:3000/admin",
  urlFlagger: "http://localhost:3002/flag",
  urlProject: "http://localhost:3000/projects",
  urlLogin: "http://localhost:3000/login",
  urlRegister: "http://localhost:3000/register",
  urlAnalyse: "http://localhost:3004/analyse"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
