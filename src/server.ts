require ('dotenv').config ()
var opbeat = require ('opbeat').start ()
import { Server } from './app/server'
import { MandrillSupplier } from './app/suppliers/mandrill/mandrill.supplier'
import { NexmoSupplier } from './app/suppliers/nexmo/nexmo.supplier'
import { Config } from './config'

// Create a new server and pass the required supplier and server port.
new Server (
  parseInt (Config.port),
  new NexmoSupplier,
  new MandrillSupplier
)
