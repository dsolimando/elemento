import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: 'dist/index.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  external: ['uhtml'], // List external dependencies
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
};
