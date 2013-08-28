#!/usr/bin/python

import codecs
import sys

with open(sys.argv[1], 'r') as infile:
  with open(sys.argv[2], 'w') as outfile:
    outfile.write(codecs.BOM_UTF8)
    for line in infile:
      outfile.write(line)
