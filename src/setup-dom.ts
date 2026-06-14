import { Window } from 'happy-dom';

const windowInstance = new Window();

// Assign standard DOM globals
globalThis.window = windowInstance as any;
globalThis.document = windowInstance.document as any;
globalThis.navigator = windowInstance.navigator as any;
globalThis.Event = windowInstance.Event as any;
globalThis.CustomEvent = windowInstance.CustomEvent as any;
globalThis.MouseEvent = windowInstance.MouseEvent as any;
globalThis.Image = windowInstance.Image as any;
