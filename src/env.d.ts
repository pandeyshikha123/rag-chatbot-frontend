// src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API_BASE?: string;
    // add other REACT_APP_ vars here if needed
  }
}
// Note: In a Create React App project, environment variables must be prefixed with REACT_APP_ to be accessible in the code.  This file provides type definitions for those variables.      