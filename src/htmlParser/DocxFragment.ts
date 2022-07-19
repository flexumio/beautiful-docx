export interface DocxFragment<T> {
  content: T[];
  getContent(): T[];
}
