declare module 'machina' {
    // Minimal declaration so TypeScript doesn't complain
    export class Fsm {
      constructor(options: any);
      handle(event: string, payload?: any): void;
      transition(newState: string, ...args: any[]): void;
      // Add more methods as needed
    }
  
    export default {
      Fsm: typeof Fsm
    };
  }
  