from django import forms

from huts.fields import PointFormField
from huts.models import Hut, HutEdit, HutSuggestion
from huts.widgets import PointWidget


class HutCommonForm(forms.ModelForm):
    class Meta:
        pass


class HutForm(HutCommonForm):
    class Meta(HutCommonForm.Meta):
        model = Hut


class HutSuggestionForm(HutCommonForm):
    class Meta(HutCommonForm.Meta):
        model = HutSuggestion
        fields = (
            'location',
            'country',
            'state',
            'name',
            'types',
        )


class HutEditForm(HutCommonForm):
    class Meta(HutCommonForm.Meta):
        model = HutEdit
