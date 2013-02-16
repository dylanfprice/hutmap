#!/usr/bin/python

import sys

import make.config as config
import make.build as build
import make.generate as generate

def print_unknown_command(command):
  print('Unknown command: {0}'.format(command))

def print_help():
  print('Usage: ./make.py <command>')
  print('    command is one of "build" or "generate"')


if __name__ == '__main__':
  if len(sys.argv) < 2:
    print_help()
    sys.exit(1)

  command = sys.argv[1]
  if command == 'build':
    build.build_js()
    print('Successfully compiled js.')
    build.build_css()
    print('Successfully copied css.')
  elif command == 'generate':
    generate.js.generate_soy()
    print('Successfully generated templates.js')
    generate.js.generate_models(config.MODEL_LIST)
    print('Successfully generated models.js')
    generate.js_test.generate_deps()
    print('Successfully generated deps.js')
    generate.js_test.generate_alltests()
    print('Successfully generated alltests.js')
    generate.docs.generate_readme()
    print('Successfully generated README.md')
  else:
    print_unknown_command(command)
    print_help()

