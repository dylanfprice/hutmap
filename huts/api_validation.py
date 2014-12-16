from collections import defaultdict

from django.utils.text import capfirst

from tastypie.validation import Validation


class HutValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = defaultdict(list)

        for field in bundle.obj._meta.fields:
            required_and_not_provided = (
                not field.blank and (
                    field.name not in bundle.data or
                    bundle.data[field.name] is None or
                    bundle.data[field.name] == ''
                )
            )
            if required_and_not_provided:
                errors[field.name].append('{} is required'.format(capfirst(field.verbose_name)))

        return errors
