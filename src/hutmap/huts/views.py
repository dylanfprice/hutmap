from django.forms.models import model_to_dict
from django.http import HttpResponse, QueryDict
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

class HutCommonView(FormView):
    template_name = 'forms/hut.html'

    def get_form_kwargs(self):
        form_kwargs = super(HutCommonView, self).get_form_kwargs()
        # handle submissions of empty string on m2m fields
        if isinstance(form_kwargs.get('data', None), QueryDict):
            q = form_kwargs['data'].copy()
            for field in self.get_form_class()._meta.model._meta.many_to_many:
                if q.get(field.name, None) == '':
                    q.pop(field.name)

            form_kwargs['data'] = q

        return form_kwargs

    def form_valid(self, form):
        form.save()
        return HttpResponse(status=201)
