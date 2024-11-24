function isSimpleMethod(method: string): boolean {
  return ["GET", "HEAD", "POST"].includes(method.toUpperCase());
}
