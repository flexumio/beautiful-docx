declare module 'himalaya' {
  export type Styles = {
    [k: string]: string;
  };

  export interface Attribute {
    key: string;
    value?: string;
  }

  export type Element = {
    type: 'element';
    tagName: string;
    children: [Node];
    attributes: [Attribute];
  };

  export type Comment = {
    type: 'comment';
    content: string;
  };

  export type Text = {
    type: 'text';
    content: string;
  };

  export type Node = Element | Comment | Text;

  function parse(content: string): Node[];
}
