"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRow = void 0;
const docx_1 = require("docx");
const Cell_1 = require("./Cell");
class TableRow {
    constructor(element, isHeader, exportOptions) {
        this.isHeader = isHeader;
        this.type = 'table-row';
        this.children = [];
        this.children = [];
        for (const child of element.children) {
            if (child.type !== 'element') {
                continue;
            }
            switch (child.tagName) {
                case 'th':
                case 'td':
                    this.children.push(...new Cell_1.Cell(child, exportOptions, isHeader).getContent());
                    break;
                default:
                    throw new Error(`Unsupported row element: ${child.tagName}`);
            }
        }
        this.options = { tableHeader: this.isHeader, children: [] };
    }
    transformToDocx() {
        return [
            new docx_1.TableRow(Object.assign(Object.assign({}, this.options), { children: this.children.flatMap(i => i.transformToDocx()) })),
        ];
    }
    getContent() {
        return [this];
    }
    get cellCount() {
        return this.children.length;
    }
}
exports.TableRow = TableRow;
