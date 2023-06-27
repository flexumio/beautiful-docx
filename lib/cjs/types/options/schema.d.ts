import { z } from 'zod';
import { PageOrientation } from './types';
export declare const userOptionsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodObject<{
        orientation: z.ZodOptional<z.ZodNativeEnum<typeof PageOrientation>>;
        size: z.ZodOptional<z.ZodObject<{
            height: z.ZodOptional<z.ZodNumber>;
            width: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            height?: number | undefined;
            width?: number | undefined;
        }, {
            height?: number | undefined;
            width?: number | undefined;
        }>>;
        margins: z.ZodOptional<z.ZodObject<{
            top: z.ZodOptional<z.ZodNumber>;
            right: z.ZodOptional<z.ZodNumber>;
            bottom: z.ZodOptional<z.ZodNumber>;
            left: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        }, {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        }>>;
        number: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        number?: boolean | undefined;
        orientation?: PageOrientation | undefined;
        size?: {
            height?: number | undefined;
            width?: number | undefined;
        } | undefined;
        margins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    }, {
        number?: boolean | undefined;
        orientation?: PageOrientation | undefined;
        size?: {
            height?: number | undefined;
            width?: number | undefined;
        } | undefined;
        margins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    }>>;
    font: z.ZodOptional<z.ZodObject<{
        baseSize: z.ZodOptional<z.ZodNumber>;
        baseFontFamily: z.ZodOptional<z.ZodString>;
        headersFontFamily: z.ZodOptional<z.ZodString>;
        headersSizes: z.ZodOptional<z.ZodObject<{
            h1: z.ZodOptional<z.ZodNumber>;
            h2: z.ZodOptional<z.ZodNumber>;
            h3: z.ZodOptional<z.ZodNumber>;
            h4: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        }, {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        baseSize?: number | undefined;
        baseFontFamily?: string | undefined;
        headersFontFamily?: string | undefined;
        headersSizes?: {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        } | undefined;
    }, {
        baseSize?: number | undefined;
        baseFontFamily?: string | undefined;
        headersFontFamily?: string | undefined;
        headersSizes?: {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        } | undefined;
    }>>;
    verticalSpaces: z.ZodOptional<z.ZodNumber>;
    table: z.ZodOptional<z.ZodObject<{
        cellMargins: z.ZodOptional<z.ZodObject<{
            left: z.ZodOptional<z.ZodNumber>;
            right: z.ZodOptional<z.ZodNumber>;
            top: z.ZodOptional<z.ZodNumber>;
            bottom: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        }, {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        cellMargins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    }, {
        cellMargins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    }>>;
    ignoreIndentation: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    page?: {
        number?: boolean | undefined;
        orientation?: PageOrientation | undefined;
        size?: {
            height?: number | undefined;
            width?: number | undefined;
        } | undefined;
        margins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    } | undefined;
    font?: {
        baseSize?: number | undefined;
        baseFontFamily?: string | undefined;
        headersFontFamily?: string | undefined;
        headersSizes?: {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        } | undefined;
    } | undefined;
    verticalSpaces?: number | undefined;
    table?: {
        cellMargins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    } | undefined;
    ignoreIndentation?: boolean | undefined;
}, {
    page?: {
        number?: boolean | undefined;
        orientation?: PageOrientation | undefined;
        size?: {
            height?: number | undefined;
            width?: number | undefined;
        } | undefined;
        margins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    } | undefined;
    font?: {
        baseSize?: number | undefined;
        baseFontFamily?: string | undefined;
        headersFontFamily?: string | undefined;
        headersSizes?: {
            h1?: number | undefined;
            h2?: number | undefined;
            h3?: number | undefined;
            h4?: number | undefined;
        } | undefined;
    } | undefined;
    verticalSpaces?: number | undefined;
    table?: {
        cellMargins?: {
            left?: number | undefined;
            right?: number | undefined;
            top?: number | undefined;
            bottom?: number | undefined;
        } | undefined;
    } | undefined;
    ignoreIndentation?: boolean | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map