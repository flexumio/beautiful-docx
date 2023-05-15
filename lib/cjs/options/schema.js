"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userOptionsSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
const optionsSchema = zod_1.z.object({
    page: zod_1.z.object({
        orientation: zod_1.z.nativeEnum(types_1.PageOrientation),
        size: zod_1.z.object({
            height: zod_1.z.number().positive(),
            width: zod_1.z.number().positive(),
        }),
        margins: zod_1.z.object({
            top: zod_1.z.number().positive(),
            right: zod_1.z.number().positive(),
            bottom: zod_1.z.number().positive(),
            left: zod_1.z.number().positive(),
        }),
        number: zod_1.z.boolean(),
    }),
    font: zod_1.z.object({
        baseSize: zod_1.z.number().positive(),
        baseFontFamily: zod_1.z.string(),
        headersFontFamily: zod_1.z.string(),
        headersSizes: zod_1.z.object({
            h1: zod_1.z.number().positive(),
            h2: zod_1.z.number().positive(),
            h3: zod_1.z.number().positive(),
            h4: zod_1.z.number().positive(),
        }),
    }),
    verticalSpaces: zod_1.z.number().nonnegative(),
    table: zod_1.z.object({
        cellMargins: zod_1.z.object({
            left: zod_1.z.number().positive(),
            right: zod_1.z.number().positive(),
            top: zod_1.z.number().positive(),
            bottom: zod_1.z.number().positive(),
        }),
    }),
});
exports.userOptionsSchema = optionsSchema.deepPartial().strict();
