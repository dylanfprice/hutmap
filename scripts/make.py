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
  subcommand = 'all'
  if len(sys.argv) >= 3:
    subcommand = sys.argv[2]

  if command == 'build':
    if subcommand == 'all' or subcommand == 'js':
      build.build_js()
      print('Successfully compiled js.')
    if subcommand == 'all' or subcommand == 'css':
      build.build_css()
      print('Successfully copied css.')
  elif command == 'generate':
    if subcommand == 'all' or subcommand == 'soy':
      generate.js.generate_soy()
      print('Successfully generated templates.js')
    if subcommand == 'all' or subcommand == 'models':
      generate.js.generate_models(config.MODEL_LIST)
      print('Successfully generated models.js')
    if subcommand == 'all' or subcommand == 'deps':
      generate.js_test.generate_deps()
      print('Successfully generated deps.js')
    if subcommand == 'all' or subcommand == 'alltests':
      generate.js_test.generate_alltests()
      print('Successfully generated alltests.js')
    if subcommand == 'all' or subcommand == 'readme':
      generate.docs.generate_readme()
      print('Successfully generated README.md')
  else:
    print_unknown_command(command)
    print_help()

