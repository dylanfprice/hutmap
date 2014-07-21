# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'HutSuggestion.photo'
        db.alter_column(u'huts_hutsuggestion', 'photo', self.gf('any_imagefield.models.fields.AnyImageField')(max_length=100, null=True))

        # Changing field 'HutEdit.photo'
        db.alter_column(u'huts_hutedit', 'photo', self.gf('any_imagefield.models.fields.AnyImageField')(max_length=100, null=True))

        # Changing field 'Hut.photo'
        db.alter_column(u'huts_hut', 'photo', self.gf('any_imagefield.models.fields.AnyImageField')(max_length=100, null=True))

    def backwards(self, orm):

        # Changing field 'HutSuggestion.photo'
        db.alter_column(u'huts_hutsuggestion', 'photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True))

        # Changing field 'HutEdit.photo'
        db.alter_column(u'huts_hutedit', 'photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True))

        # Changing field 'Hut.photo'
        db.alter_column(u'huts_hut', 'photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True))

    models = {
        u'huts.accesstype': {
            'Meta': {'object_name': 'AccessType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.agency': {
            'Meta': {'object_name': 'Agency'},
            'address': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'blank': 'True'})
        },
        u'huts.designation': {
            'Meta': {'object_name': 'Designation'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.hut': {
            'Meta': {'object_name': 'Hut'},
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
            'discretion': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_occupancy_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_occupancy_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'has_optional_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'has_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'hut_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_fee_hut': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_hut_occupancy_max': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person_occupancy_min': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_restricted': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_snow_min_km': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'location': ('django.contrib.gis.db.models.fields.PointField', [], {'spatial_index': 'False'}),
            'location_accuracy': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'location_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'locked': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hut_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('any_imagefield.models.fields.AnyImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hut_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'huts.hutedit': {
            'Meta': {'object_name': 'HutEdit'},
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
            'discretion': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_occupancy_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_occupancy_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'has_optional_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'has_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'hut': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'+'", 'to': u"orm['huts.Hut']"}),
            'hut_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_fee_hut': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_hut_occupancy_max': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person_occupancy_min': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_restricted': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_snow_min_km': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'location': ('django.contrib.gis.db.models.fields.PointField', [], {'spatial_index': 'False'}),
            'location_accuracy': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'location_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'locked': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hutedit_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('any_imagefield.models.fields.AnyImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hutedit_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.hutsuggestion': {
            'Meta': {'object_name': 'HutSuggestion'},
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
            'discretion': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_hut_occupancy_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_max': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_min': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'fee_person_occupancy_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'has_optional_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'has_services': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'hut_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_fee_hut': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_hut_occupancy_max': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_fee_person_occupancy_min': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_restricted': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_snow_min_km': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'location': ('django.contrib.gis.db.models.fields.PointField', [], {'spatial_index': 'False'}),
            'location_accuracy': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'location_references': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'locked': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hutsuggestion_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('any_imagefield.models.fields.AnyImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hutsuggestion_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.huttype': {
            'Meta': {'object_name': 'HutType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.region': {
            'Meta': {'object_name': 'Region'},
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'region': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'huts.service': {
            'Meta': {'object_name': 'Service'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.system': {
            'Meta': {'object_name': 'System'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['huts']
