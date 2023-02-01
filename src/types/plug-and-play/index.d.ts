// Type definitions for plug-and-lay x.x
// Project: https://github.com/matteofigus/api-benchmark
// Definitions by: Joe Brinkman <https://github.com/jbrinkman>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'plug-and-play' {
  interface pnpOptions {
    args?: any
    chain?: any
    parent?: any
    plugins?: any[]
  }

  export function plugandplay(options?: pnpOptions): any
}
