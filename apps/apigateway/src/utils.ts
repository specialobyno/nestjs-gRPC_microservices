export const sleep = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 5000));
