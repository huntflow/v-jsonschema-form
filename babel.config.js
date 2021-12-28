// module.exports = {
//   presets: [
//     [
//       '@vue/cli-plugin-babel/preset',
//       {
//         useBuiltIns: false
//       }
//     ]
//   ],
//   env: {
//     test: {
//       presets: [
//         [
//           '@vue/cli-plugin-babel/preset',
//           {
//             targets: {
//               node: 'current'
//             }
//           }
//         ]
//       ],
//       plugins: ['require-context-hook']
//     }
//   }
// };

module.exports = (api) => {
  // base config for rollup
  const babelPresetEnv = ['@vue/cli-plugin-babel/preset', { useBuiltIns: false }];
  const config = {
    presets: [babelPresetEnv],
    plugins: []
  };

  // jest tests
  if (api.env('test')) {
    // tests are run in a node environment, not a browser
    babelPresetEnv[1] = { targets: { node: 'current' } };
    config.plugins.push('require-context-hook');
  }

  return config;
};
