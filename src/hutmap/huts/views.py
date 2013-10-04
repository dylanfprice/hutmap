import json
from django.views.generic import TemplateView
from django.http import HttpResponseBadRequest
from django.views.generic.detail import DetailView
from djangular.core.urlresolvers import urls_by_namespace
from huts.forms import HutForm
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


class HutFormView(DetailView):
  template_name = 'forms/hut.html'
  model = Hut

  def get_context_data(self, **kwargs):
    context = super(HutFormView, self).get_context_data(**kwargs)
    hut = self.get_object()
    context.update(hut_form=HutForm(instance=hut))
    return context

#  def post(self, request, *args, **kwargs):
#    if not request.is_ajax():
#      return HttpResponseBadRequest('Expected an XMLHttpRequest')
#    in_data = json.loads(request.body)
#    bound_contact_form = CheckoutForm(data={'subject': in_data.get('subject')})
#    # now validate 'bound_contact_form' and use it as in normal Django
