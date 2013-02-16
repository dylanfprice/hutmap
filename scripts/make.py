#!/usr/bin/python

import sys
import build
import generate

if __name__ == '__main__':
  command = sys.argv[1]
  if command == 'build':
    build.build_js()
    print('Successfully compiled js.')
    build.build_css()
    print('Successfully copied css.')
  elif command == 'generate':
    generate.js.generate_soy()
    print('Successfully generated templates.js')
    generate.js.generate_models()
    print('Successfully generated models.js')
    generate.js_test.generate_deps()
    print('Successfully generated deps.js')
    generate.js_test.generate_alltests()
    print('Successfully generated alltests.js')
    generate.docs.generate_readme()
    print('Successfully generated README.md')
  else:
    print('Unknown command: {0}'.format(command))

