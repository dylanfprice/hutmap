from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.views.generic import TemplateView, FormView
from djangular.core.urlresolvers import urls_by_namespace
from huts.forms import HutSuggestionForm, HutEditForm
from huts.models import Hut
import logging

logger = logging.getLogger(__name__)

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

class HutCommonMixin(object):
  template_name = 'forms/hut.html'

  def form_valid(self, form):
    form.save()
    return HttpResponse(status=201)

class HutSuggestionFormView(HutCommonMixin, FormView):
  form_class = HutSuggestionForm

class HutEditFormView(HutCommonMixin, FormView):
  form_class = HutEditForm

  def get_initial(self):
    pk = self.kwargs['pk']  
    hut = Hut.objects.get(pk=pk)
    initial = model_to_dict(hut)
    initial['hut'] = pk
    return initial


