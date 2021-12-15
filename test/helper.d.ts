/// <reference types="node" />
import * as tap from 'tap';
export declare type Test = typeof tap['Test']['prototype'];
declare function config(): Promise<{}>;
declare function build(
  t: Test,
): Promise<
  import('fastify').FastifyInstance<
    import('http').Server,
    import('http').IncomingMessage,
    import('http').ServerResponse,
    import('fastify').FastifyLoggerInstance
  >
>;
export { config, build };
