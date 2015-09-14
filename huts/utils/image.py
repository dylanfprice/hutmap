from cStringIO import StringIO
from PIL import Image, ImageFile
import urllib2

def retrieve_and_resize(url, width = None, height = None, quality = 95):
    if url:
        url = urllib2.urlopen(url)
        im = StringIO(url.read())
        image = Image.open(im)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        if width and height:
            image.thumbnail((width, height), Image.ANTIALIAS)
        elif width:
            image.thumbnail((width, width), Image.ANTIALIAS)
        resized_image = StringIO()
        try:
            image.save(resized_image, 'JPEG', optimize=True, progressive=True, quality=quality)
        except IOError:
            ImageFile.MAXBLOCK = max(image.size)**2
            image.save(resized_image, 'JPEG', optimize=True, progressive=True, quality=quality)
        resized_image.seek(0)
        return resized_image
