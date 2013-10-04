from django.views.generic import TemplateView
from djangular.core.urlresolvers import urls_by_namespace
from huts.models import Hut

class DynamicTemplateView(TemplateView):
  folder = None

  def get_template_names(self):
    template = self.kwargs['template']
    return ['{}/{}.html'.format(self.folder, template)]


class BaseView(TemplateView):
  template_name = 'base.html'
  metadata = 'metadata/base.html'

  def get_context_data(self, **kwargs):
    context = super(TemplateView, self).get_context_data(**kwargs)
    context['metadata'] = self.metadata
    context['absolute_uri'] = self.request.build_absolute_uri()
    context['hut_urls'] = urls_by_namespace('huts')
    return context

