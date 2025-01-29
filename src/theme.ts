// import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

// export const myCustomTheme: CustomThemeConfig = {
//     name: 'my-custom-theme',
//     properties: {
// 		// =~= Theme Properties =~=
// 		"--theme-font-family-base": `system-ui`,
// 		"--theme-font-family-heading": `system-ui`,
// 		"--theme-font-color-base": "0 0 0",
// 		"--theme-font-color-dark": "255 255 255",
// 		"--theme-rounded-base": "9999px",
// 		"--theme-rounded-container": "8px",
// 		"--theme-border-base": "1px",
// 		// =~= Theme On-X Colors =~=
// 		"--on-primary": "255 255 255",
// 		"--on-secondary": "255 255 255",
// 		"--on-tertiary": "255 255 255",
// 		"--on-success": "0 0 0",
// 		"--on-warning": "var(--color-secondary-400)",
// 		"--on-error": "0 0 0",
// 		"--on-surface": "255 255 255",
// 		// =~= Theme Colors  =~=
// 		// primary | #ca1616
// 		"--color-primary-50": "247 220 220", // #f7dcdc
// 		"--color-primary-100": "244 208 208", // #f4d0d0
// 		"--color-primary-200": "242 197 197", // #f2c5c5
// 		"--color-primary-300": "234 162 162", // #eaa2a2
// 		"--color-primary-400": "218 92 92", // #da5c5c
// 		"--color-primary-500": "202 22 22", // #ca1616
// 		"--color-primary-600": "182 20 20", // #b61414
// 		"--color-primary-700": "152 17 17", // #981111
// 		"--color-primary-800": "121 13 13", // #790d0d
// 		"--color-primary-900": "99 11 11", // #630b0b
// 		// secondary | #343531
// 		"--color-secondary-50": "225 225 224", // #e1e1e0
// 		"--color-secondary-100": "214 215 214", // #d6d7d6
// 		"--color-secondary-200": "204 205 204", // #cccdcc
// 		"--color-secondary-300": "174 174 173", // #aeaead
// 		"--color-secondary-400": "113 114 111", // #71726f
// 		"--color-secondary-500": "52 53 49", // #343531
// 		"--color-secondary-600": "47 48 44", // #2f302c
// 		"--color-secondary-700": "39 40 37", // #272825
// 		"--color-secondary-800": "31 32 29", // #1f201d
// 		"--color-secondary-900": "25 26 24", // #191a18
// 		// tertiary | #c31b28
// 		"--color-tertiary-50": "246 221 223", // #f6dddf
// 		"--color-tertiary-100": "243 209 212", // #f3d1d4
// 		"--color-tertiary-200": "240 198 201", // #f0c6c9
// 		"--color-tertiary-300": "231 164 169", // #e7a4a9
// 		"--color-tertiary-400": "213 95 105", // #d55f69
// 		"--color-tertiary-500": "195 27 40", // #c31b28
// 		"--color-tertiary-600": "176 24 36", // #b01824
// 		"--color-tertiary-700": "146 20 30", // #92141e
// 		"--color-tertiary-800": "117 16 24", // #751018
// 		"--color-tertiary-900": "96 13 20", // #600d14
// 		// success | #27c475
// 		"--color-success-50": "223 246 234", // #dff6ea
// 		"--color-success-100": "212 243 227", // #d4f3e3
// 		"--color-success-200": "201 240 221", // #c9f0dd
// 		"--color-success-300": "169 231 200", // #a9e7c8
// 		"--color-success-400": "104 214 158", // #68d69e
// 		"--color-success-500": "39 196 117", // #27c475
// 		"--color-success-600": "35 176 105", // #23b069
// 		"--color-success-700": "29 147 88", // #1d9358
// 		"--color-success-800": "23 118 70", // #177646
// 		"--color-success-900": "19 96 57", // #136039
// 		// warning | #f7e3e3
// 		"--color-warning-50": "254 251 251", // #fefbfb
// 		"--color-warning-100": "253 249 249", // #fdf9f9
// 		"--color-warning-200": "253 248 248", // #fdf8f8
// 		"--color-warning-300": "252 244 244", // #fcf4f4
// 		"--color-warning-400": "249 235 235", // #f9ebeb
// 		"--color-warning-500": "247 227 227", // #f7e3e3
// 		"--color-warning-600": "222 204 204", // #decccc
// 		"--color-warning-700": "185 170 170", // #b9aaaa
// 		"--color-warning-800": "148 136 136", // #948888
// 		"--color-warning-900": "121 111 111", // #796f6f
// 		// error | #bb3030
// 		"--color-error-50": "245 224 224", // #f5e0e0
// 		"--color-error-100": "241 214 214", // #f1d6d6
// 		"--color-error-200": "238 203 203", // #eecbcb
// 		"--color-error-300": "228 172 172", // #e4acac
// 		"--color-error-400": "207 110 110", // #cf6e6e
// 		"--color-error-500": "187 48 48", // #bb3030
// 		"--color-error-600": "168 43 43", // #a82b2b
// 		"--color-error-700": "140 36 36", // #8c2424
// 		"--color-error-800": "112 29 29", // #701d1d
// 		"--color-error-900": "92 24 24", // #5c1818
// 		// surface | #1f1e1e
// 		"--color-surface-50": "221 221 221", // #dddddd
// 		"--color-surface-100": "210 210 210", // #d2d2d2
// 		"--color-surface-200": "199 199 199", // #c7c7c7
// 		"--color-surface-300": "165 165 165", // #a5a5a5
// 		"--color-surface-400": "98 98 98", // #626262
// 		"--color-surface-500": "31 30 30", // #1f1e1e
// 		"--color-surface-600": "28 27 27", // #1c1b1b
// 		"--color-surface-700": "23 23 23", // #171717
// 		"--color-surface-800": "19 18 18", // #131212
// 		"--color-surface-900": "15 15 15", // #0f0f0f

// 	}
// }

import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const myCustomTheme: CustomThemeConfig = {
  name: "my-custom-theme",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `system-ui`,
    "--theme-font-family-heading": `system-ui`,
    "--theme-font-color-base": "0 0 0",
    "--theme-font-color-dark": "255 255 255",
    "--theme-rounded-base": "9999px",
    "--theme-rounded-container": "8px",
    "--theme-border-base": "1px",
    // =~= Theme On-X Colors =~=
    "--on-primary": "255 255 255",
    "--on-secondary": "255 255 255",
    "--on-tertiary": "0 0 0",
    "--on-success": "0 0 0",
    "--on-warning": "0 0 0",
    "--on-error": "255 255 255",
    "--on-surface": "255 255 255",
    // =~= Theme Colors  =~=
    // primary | #e637c0
    "--color-primary-50": "251 225 246", // #fbe1f6
    "--color-primary-100": "250 215 242", // #fad7f2
    "--color-primary-200": "249 205 239", // #f9cdef
    "--color-primary-300": "245 175 230", // #f5afe6
    "--color-primary-400": "238 115 211", // #ee73d3
    "--color-primary-500": "230 55 192", // #e637c0
    "--color-primary-600": "207 50 173", // #cf32ad
    "--color-primary-700": "173 41 144", // #ad2990
    "--color-primary-800": "138 33 115", // #8a2173
    "--color-primary-900": "113 27 94", // #711b5e
    // secondary | #343531
    "--color-secondary-50": "225 225 224", // #e1e1e0
    "--color-secondary-100": "214 215 214", // #d6d7d6
    "--color-secondary-200": "204 205 204", // #cccdcc
    "--color-secondary-300": "174 174 173", // #aeaead
    "--color-secondary-400": "113 114 111", // #71726f
    "--color-secondary-500": "52 53 49", // #343531
    "--color-secondary-600": "47 48 44", // #2f302c
    "--color-secondary-700": "39 40 37", // #272825
    "--color-secondary-800": "31 32 29", // #1f201d
    "--color-secondary-900": "25 26 24", // #191a18
    // tertiary | #c31b28
    "--color-tertiary-50": "246 221 223", // #f6dddf
    "--color-tertiary-100": "243 209 212", // #f3d1d4
    "--color-tertiary-200": "240 198 201", // #f0c6c9
    "--color-tertiary-300": "231 164 169", // #e7a4a9
    "--color-tertiary-400": "213 95 105", // #d55f69
    "--color-tertiary-500": "195 27 40", // #c31b28
    "--color-tertiary-600": "176 24 36", // #b01824
    "--color-tertiary-700": "146 20 30", // #92141e
    "--color-tertiary-800": "117 16 24", // #751018
    "--color-tertiary-900": "96 13 20", // #600d14
    // success | #27c475
    "--color-success-50": "223 246 234", // #dff6ea
    "--color-success-100": "212 243 227", // #d4f3e3
    "--color-success-200": "201 240 221", // #c9f0dd
    "--color-success-300": "169 231 200", // #a9e7c8
    "--color-success-400": "104 214 158", // #68d69e
    "--color-success-500": "39 196 117", // #27c475
    "--color-success-600": "35 176 105", // #23b069
    "--color-success-700": "29 147 88", // #1d9358
    "--color-success-800": "23 118 70", // #177646
    "--color-success-900": "19 96 57", // #136039
    // warning | #f7e3e3
    "--color-warning-50": "254 251 251", // #fefbfb
    "--color-warning-100": "253 249 249", // #fdf9f9
    "--color-warning-200": "253 248 248", // #fdf8f8
    "--color-warning-300": "252 244 244", // #fcf4f4
    "--color-warning-400": "249 235 235", // #f9ebeb
    "--color-warning-500": "247 227 227", // #f7e3e3
    "--color-warning-600": "222 204 204", // #decccc
    "--color-warning-700": "185 170 170", // #b9aaaa
    "--color-warning-800": "148 136 136", // #948888
    "--color-warning-900": "121 111 111", // #796f6f
    // error | #da362b
    "--color-error-50": "249 225 223", // #f9e1df
    "--color-error-100": "248 215 213", // #f8d7d5
    "--color-error-200": "246 205 202", // #f6cdca
    "--color-error-300": "240 175 170", // #f0afaa
    "--color-error-400": "229 114 107", // #e5726b
    "--color-error-500": "218 54 43", // #da362b
    "--color-error-600": "196 49 39", // #c43127
    "--color-error-700": "164 41 32", // #a42920
    "--color-error-800": "131 32 26", // #83201a
    "--color-error-900": "107 26 21", // #6b1a15
    // surface | #e12dba
    "--color-surface-50": "251 224 245", // #fbe0f5
    "--color-surface-100": "249 213 241", // #f9d5f1
    "--color-surface-200": "248 203 238", // #f8cbee
    "--color-surface-300": "243 171 227", // #f3abe3
    "--color-surface-400": "234 108 207", // #ea6ccf
    "--color-surface-500": "225 45 186", // #e12dba
    "--color-surface-600": "203 41 167", // #cb29a7
    "--color-surface-700": "169 34 140", // #a9228c
    "--color-surface-800": "135 27 112", // #871b70
    "--color-surface-900": "110 22 91", // #6e165b
  },
};
