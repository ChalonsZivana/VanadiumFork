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

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------

// import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const defaultTheme: CustomThemeConfig = {
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

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------

import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const saintValentinTheme: CustomThemeConfig = {
    name: 'saint-valentin-theme',
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
		"--on-secondary": "0 0 0",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #b000c7 
		"--color-primary-50": "243 217 247", // #f3d9f7
		"--color-primary-100": "239 204 244", // #efccf4
		"--color-primary-200": "235 191 241", // #ebbff1
		"--color-primary-300": "223 153 233", // #df99e9
		"--color-primary-400": "200 77 216", // #c84dd8
		"--color-primary-500": "176 0 199", // #b000c7
		"--color-primary-600": "158 0 179", // #9e00b3
		"--color-primary-700": "132 0 149", // #840095
		"--color-primary-800": "106 0 119", // #6a0077
		"--color-primary-900": "86 0 98", // #560062
		// secondary | #d260b4 
		"--color-secondary-50": "248 231 244", // #f8e7f4
		"--color-secondary-100": "246 223 240", // #f6dff0
		"--color-secondary-200": "244 215 236", // #f4d7ec
		"--color-secondary-300": "237 191 225", // #edbfe1
		"--color-secondary-400": "224 144 203", // #e090cb
		"--color-secondary-500": "210 96 180", // #d260b4
		"--color-secondary-600": "189 86 162", // #bd56a2
		"--color-secondary-700": "158 72 135", // #9e4887
		"--color-secondary-800": "126 58 108", // #7e3a6c
		"--color-secondary-900": "103 47 88", // #672f58
		// tertiary | #1b3969 
		"--color-tertiary-50": "221 225 233", // #dde1e9
		"--color-tertiary-100": "209 215 225", // #d1d7e1
		"--color-tertiary-200": "198 206 218", // #c6ceda
		"--color-tertiary-300": "164 176 195", // #a4b0c3
		"--color-tertiary-400": "95 116 150", // #5f7496
		"--color-tertiary-500": "27 57 105", // #1b3969
		"--color-tertiary-600": "24 51 95", // #18335f
		"--color-tertiary-700": "20 43 79", // #142b4f
		"--color-tertiary-800": "16 34 63", // #10223f
		"--color-tertiary-900": "13 28 51", // #0d1c33
		// success | #b9bd19 
		"--color-success-50": "245 245 221", // #f5f5dd
		"--color-success-100": "241 242 209", // #f1f2d1
		"--color-success-200": "238 239 198", // #eeefc6
		"--color-success-300": "227 229 163", // #e3e5a3
		"--color-success-400": "206 209 94", // #ced15e
		"--color-success-500": "185 189 25", // #b9bd19
		"--color-success-600": "167 170 23", // #a7aa17
		"--color-success-700": "139 142 19", // #8b8e13
		"--color-success-800": "111 113 15", // #6f710f
		"--color-success-900": "91 93 12", // #5b5d0c
		// warning | #d67349 
		"--color-warning-50": "249 234 228", // #f9eae4
		"--color-warning-100": "247 227 219", // #f7e3db
		"--color-warning-200": "245 220 210", // #f5dcd2
		"--color-warning-300": "239 199 182", // #efc7b6
		"--color-warning-400": "226 157 128", // #e29d80
		"--color-warning-500": "214 115 73", // #d67349
		"--color-warning-600": "193 104 66", // #c16842
		"--color-warning-700": "161 86 55", // #a15637
		"--color-warning-800": "128 69 44", // #80452c
		"--color-warning-900": "105 56 36", // #693824
		// error | #15d7e4 
		"--color-error-50": "220 249 251", // #dcf9fb
		"--color-error-100": "208 247 250", // #d0f7fa
		"--color-error-200": "197 245 248", // #c5f5f8
		"--color-error-300": "161 239 244", // #a1eff4
		"--color-error-400": "91 227 236", // #5be3ec
		"--color-error-500": "21 215 228", // #15d7e4
		"--color-error-600": "19 194 205", // #13c2cd
		"--color-error-700": "16 161 171", // #10a1ab
		"--color-error-800": "13 129 137", // #0d8189
		"--color-error-900": "10 105 112", // #0a6970
		// surface | #f97be8 
		"--color-surface-50": "254 235 252", // #feebfc
		"--color-surface-100": "254 229 250", // #fee5fa
		"--color-surface-200": "254 222 249", // #fedef9
		"--color-surface-300": "253 202 246", // #fdcaf6
		"--color-surface-400": "251 163 239", // #fba3ef
		"--color-surface-500": "249 123 232", // #f97be8
		"--color-surface-600": "224 111 209", // #e06fd1
		"--color-surface-700": "187 92 174", // #bb5cae
		"--color-surface-800": "149 74 139", // #954a8b
		"--color-surface-900": "122 60 114", // #7a3c72
		
	}
}