from django.views.generic import TemplateView
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
    return context

