import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

// Page unique sans routes : pas besoin du Router (navigation par ancres #work, #about…).
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
