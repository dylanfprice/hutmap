from cStringIO import StringIO
from PIL import Image, ImageFile
import urllib2

def retrieve_and_resize(url, width, height):
    if url:
        url = urllib2.urlopen(url)
        im = StringIO(url.read())
        image = Image.open(im)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image.thumbnail((width, height), Image.ANTIALIAS)
        resized_image = StringIO()
        try:
            image.save(resized_image, 'JPEG', optimize=True, progressive=True)
        except IOError:
            ImageFile.MAXBLOCK = max(image.size)**2
            image.save(resized_image, 'JPEG', optimize=True, progressive=True)
        resized_image.seek(0)
        return resized_image
