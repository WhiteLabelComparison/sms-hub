import * as dotEnv from 'dotenv';
dotEnv.config();

import { Server } from './app/server';
import { MandrillSupplier } from './app/suppliers/mandrill/mandrill.supplier';
import { NexmoSupplier } from './app/suppliers/nexmo/nexmo.supplier';
import { Config } from './config';

// Create a new server and pass the required supplier and server port.
new Server(
    Config.port,
    new NexmoSupplier(),
    new MandrillSupplier(),
);

function handler() {
  // run clean up
  process.kill(process.pid);
}

process.on('SIGINT', handler);
