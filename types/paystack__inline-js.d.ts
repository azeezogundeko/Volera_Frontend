declare module '@paystack/inline-js' {
  export interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    // Add other known options here
  }

  export interface PaystackCallbacks {
    onSuccess?: (transaction: any) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
    onLoad?: (response: any) => void;
  }

  export class Paystack {
    constructor(options?: PaystackOptions);
    open(): void;
    resumeTransaction(accessCode: string, callbacks?: PaystackCallbacks): void;
    newTransaction(options: PaystackOptions & PaystackCallbacks): void;
    checkout(options: PaystackOptions & PaystackCallbacks): void;
  }

  export default Paystack;
}
