import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'

const config = [
  {
    input: 'src/main.js',
    output: [
      {
        dir: 'build/',
        format: 'esm',
        preserveModules: true,
      },
    ],
    plugins: [
      // eslint({
      //   throwOnError: true,
      // }),
      // typescript({
      //   tsconfig: './tsconfig.json',
      // }),
      nodeResolve(),
      commonjs(),
      terser(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
      }),
    ],
  },
  // {
  //   input: 'src/main.js',
  //   output: [{ dir: 'build/type', format: 'es', preserveModules: true }],
  //   plugins: [dts()],
  // },
]
export default config
