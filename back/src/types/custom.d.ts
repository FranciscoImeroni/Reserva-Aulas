import * as express from 'express';
import { SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userEmail?: string; // Agregamos la propiedad userEmail a la sesión
  }
}

declare module 'express' {
  interface Request {
    session?: SessionData; // Extendemos la interfaz Request
  }
}