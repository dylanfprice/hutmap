from shovel import task
import base64
import urllib2
import mimetypes

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
