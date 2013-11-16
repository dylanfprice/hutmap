# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'HutSuggestion.restriction'
        db.alter_column(u'huts_hutsuggestion', 'restriction', self.gf('django.db.models.fields.CharField')(default='', max_length=100))

        # Changing field 'HutSuggestion.hut_url'
        db.alter_column(u'huts_hutsuggestion', 'hut_url', self.gf('django.db.models.fields.URLField')(default='', max_length=250))

        # Changing field 'HutSuggestion.photo_credit_name'
        db.alter_column(u'huts_hutsuggestion', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(default='', max_length=150))

        # Changing field 'HutSuggestion.name'
        db.alter_column(u'huts_hutsuggestion', 'name', self.gf('django.db.models.fields.CharField')(default='Unknown', max_length=100))

        # Changing field 'HutEdit.restriction'
        db.alter_column(u'huts_hutedit', 'restriction', self.gf('django.db.models.fields.CharField')(default='', max_length=100))

        # Changing field 'HutEdit.hut_url'
        db.alter_column(u'huts_hutedit', 'hut_url', self.gf('django.db.models.fields.URLField')(default='', max_length=250))

        # Changing field 'HutEdit.photo_credit_name'
        db.alter_column(u'huts_hutedit', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(default='', max_length=150))

        # Changing field 'HutEdit.name'
        db.alter_column(u'huts_hutedit', 'name', self.gf('django.db.models.fields.CharField')(default='Unknown', max_length=100))

        # Changing field 'Hut.restriction'
        db.alter_column(u'huts_hut', 'restriction', self.gf('django.db.models.fields.CharField')(default='', max_length=100))

        # Changing field 'Hut.hut_url'
        db.alter_column(u'huts_hut', 'hut_url', self.gf('django.db.models.fields.URLField')(default='', max_length=250))

        # Changing field 'Hut.photo_credit_name'
        db.alter_column(u'huts_hut', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(default='', max_length=150))

        # Changing field 'Hut.name'
        db.alter_column(u'huts_hut', 'name', self.gf('django.db.models.fields.CharField')(default='Unknown', max_length=100))

        # Changing field 'Agency.email'
        db.alter_column(u'huts_agency', 'email', self.gf('django.db.models.fields.CharField')(default='', max_length=100))

    def backwards(self, orm):

        # Changing field 'HutSuggestion.restriction'
        db.alter_column(u'huts_hutsuggestion', 'restriction', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'HutSuggestion.hut_url'
        db.alter_column(u'huts_hutsuggestion', 'hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True))

        # Changing field 'HutSuggestion.photo_credit_name'
        db.alter_column(u'huts_hutsuggestion', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, null=True))

        # Changing field 'HutSuggestion.name'
        db.alter_column(u'huts_hutsuggestion', 'name', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'HutEdit.restriction'
        db.alter_column(u'huts_hutedit', 'restriction', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'HutEdit.hut_url'
        db.alter_column(u'huts_hutedit', 'hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True))

        # Changing field 'HutEdit.photo_credit_name'
        db.alter_column(u'huts_hutedit', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, null=True))

        # Changing field 'HutEdit.name'
        db.alter_column(u'huts_hutedit', 'name', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Hut.restriction'
        db.alter_column(u'huts_hut', 'restriction', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Hut.hut_url'
        db.alter_column(u'huts_hut', 'hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True))

        # Changing field 'Hut.photo_credit_name'
        db.alter_column(u'huts_hut', 'photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, null=True))

        # Changing field 'Hut.name'
        db.alter_column(u'huts_hut', 'name', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Agency.email'
        db.alter_column(u'huts_agency', 'email', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

    models = {
        u'huts.accesstype': {
            'Meta': {'object_name': 'AccessType'},
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.agency': {
            'Meta': {'object_name': 'Agency'},
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.BigIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'})
        },
        u'huts.designation': {
            'Meta': {'object_name': 'Designation'},
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.hut': {
            'Meta': {'object_name': 'Hut'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hut_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hut_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'huts.hutedit': {
            'Meta': {'object_name': 'HutEdit'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hutedit_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hutedit_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.hutsuggestion': {
            'Meta': {'object_name': 'HutSuggestion'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hutsuggestion_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hutsuggestion_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.huttype': {
            'Meta': {'object_name': 'HutType'},
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
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
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.system': {
            'Meta': {'object_name': 'System'},
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['huts']