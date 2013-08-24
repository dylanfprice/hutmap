from shovel import task
import base64
import mimetypes
import os
import subprocess
import urllib2

@task
def data_uri(path, css=None):
  """
  Turns image at given path into a data uri.

  path: file path or url to image
  css: a css class name. If provided, print out a css snippet instead of the
       straight uri.
  """
  handle = None
  if path.startswith('http'):
    handle = urllib2.urlopen(path)
  else:
    handle = open(path, "rb")

  encoded = base64.standard_b64encode(handle.read())
  type = mimetypes.guess_type(path)[0]
  data_uri = "data:" + type + ";base64," + encoded

  if css:
    print('.{0} {{'.format(css))
    print('  display: inline-block;')
    print('  background-image: url("{0}");'.format(data_uri))
    print('  width: 100%;')
    print('  height: 100%;')
    print('  background-repeat: no-repeat;')
    print('}')
  else:
    print(data_uri)

@task
def compress_jpeg(path):
  """
  Turns jpeg at given path into a compressed, progressive jpeg. WARNING:
  overwrites original image

  path: file path
  """
  original_size = os.path.getsize(path)
  temp_file = '/tmp/decompressed.jpg'
  subprocess.check_call(['djpeg', path], stdout=open(temp_file, 'w'))
  subprocess.check_call(['cjpeg', '-optimize', '-progressive', temp_file], stdout=open(path, 'w'))
  compressed_size = os.path.getsize(path)
  print('Successfully compressed {}.'.format(path))
  print('original size: {} \t compressed size: {}'.format(original_size, compressed_size))

