# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Region'
        db.create_table(u'huts_region', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('region', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50)),
            ('created', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'huts', ['Region'])

        # Adding model 'Designation'
        db.create_table(u'huts_designation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['Designation'])

        # Adding model 'System'
        db.create_table(u'huts_system', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['System'])

        # Adding model 'AccessType'
        db.create_table(u'huts_accesstype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['AccessType'])

        # Adding model 'HutType'
        db.create_table(u'huts_huttype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['HutType'])

        # Adding model 'Service'
        db.create_table(u'huts_service', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['Service'])

        # Adding model 'Hut'
        db.create_table(u'huts_hut', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
            ('location', self.gf('django.contrib.gis.db.models.fields.PointField')(spatial_index=False)),
            ('altitude_meters', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('location_accuracy', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('show_satellite', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('show_topo', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('location_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('country', self.gf('huts.model_fields.CountryField')(max_length=2)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('region', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Region'], null=True, blank=True)),
            ('agency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Agency'], null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('alternate_names', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, blank=True)),
            ('hut_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('photo_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, blank=True)),
            ('photo_credit_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('backcountry', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('open_summer', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('open_winter', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('no_snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_snow_min_km', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('structures', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('overnight', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('capacity_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_person', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_person_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_person_occupancy_min', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_occupancy_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_hut', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_hut_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_hut_occupancy_max', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_occupancy_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('has_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('has_optional_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('is_restricted', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('restriction', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('reservations', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('locked', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('private', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('discretion', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('published', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'huts', ['Hut'])

        # Adding M2M table for field designations on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_designations')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('designation', models.ForeignKey(orm[u'huts.designation'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'designation_id'])

        # Adding M2M table for field systems on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_systems')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('system', models.ForeignKey(orm[u'huts.system'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'system_id'])

        # Adding M2M table for field access_no_snow on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_access_no_snow')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('accesstype', models.ForeignKey(orm[u'huts.accesstype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'accesstype_id'])

        # Adding M2M table for field types on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_types')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('huttype', models.ForeignKey(orm[u'huts.huttype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'huttype_id'])

        # Adding M2M table for field services on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'service_id'])

        # Adding M2M table for field optional_services on 'Hut'
        m2m_table_name = db.shorten_name(u'huts_hut_optional_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hut', models.ForeignKey(orm[u'huts.hut'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hut_id', 'service_id'])

        # Adding model 'HutSuggestion'
        db.create_table(u'huts_hutsuggestion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
            ('location', self.gf('django.contrib.gis.db.models.fields.PointField')(spatial_index=False)),
            ('altitude_meters', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('location_accuracy', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('show_satellite', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('show_topo', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('location_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('country', self.gf('huts.model_fields.CountryField')(max_length=2)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('region', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Region'], null=True, blank=True)),
            ('agency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Agency'], null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('alternate_names', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, blank=True)),
            ('hut_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('photo_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, blank=True)),
            ('photo_credit_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('backcountry', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('open_summer', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('open_winter', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('no_snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_snow_min_km', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('structures', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('overnight', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('capacity_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_person', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_person_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_person_occupancy_min', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_occupancy_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_hut', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_hut_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_hut_occupancy_max', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_occupancy_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('has_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('has_optional_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('is_restricted', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('restriction', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('reservations', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('locked', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('private', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('discretion', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('user_email', self.gf('django.db.models.fields.EmailField')(max_length=75, blank=True)),
            ('user_notes', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal(u'huts', ['HutSuggestion'])

        # Adding M2M table for field designations on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_designations')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('designation', models.ForeignKey(orm[u'huts.designation'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'designation_id'])

        # Adding M2M table for field systems on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_systems')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('system', models.ForeignKey(orm[u'huts.system'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'system_id'])

        # Adding M2M table for field access_no_snow on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_access_no_snow')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('accesstype', models.ForeignKey(orm[u'huts.accesstype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'accesstype_id'])

        # Adding M2M table for field types on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_types')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('huttype', models.ForeignKey(orm[u'huts.huttype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'huttype_id'])

        # Adding M2M table for field services on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'service_id'])

        # Adding M2M table for field optional_services on 'HutSuggestion'
        m2m_table_name = db.shorten_name(u'huts_hutsuggestion_optional_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutsuggestion', models.ForeignKey(orm[u'huts.hutsuggestion'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutsuggestion_id', 'service_id'])

        # Adding model 'HutEdit'
        db.create_table(u'huts_hutedit', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
            ('location', self.gf('django.contrib.gis.db.models.fields.PointField')(spatial_index=False)),
            ('altitude_meters', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('location_accuracy', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('show_satellite', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('show_topo', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('location_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('country', self.gf('huts.model_fields.CountryField')(max_length=2)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('region', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Region'], null=True, blank=True)),
            ('agency', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Agency'], null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('alternate_names', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('hut_url', self.gf('django.db.models.fields.URLField')(max_length=250, blank=True)),
            ('hut_references', self.gf('huts.model_fields.ListField')(null=True, blank=True)),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('photo_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('photo_credit_name', self.gf('django.db.models.fields.CharField')(max_length=150, blank=True)),
            ('photo_credit_url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('backcountry', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('open_summer', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('open_winter', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('no_snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_snow_min_km', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('snow_min_km', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('structures', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('overnight', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('capacity_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('capacity_hut_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_person', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_person_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_person_occupancy_min', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_person_occupancy_min', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('is_fee_hut', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_min', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('fee_hut_max', self.gf('django.db.models.fields.FloatField')(null=True, blank=True)),
            ('is_fee_hut_occupancy_max', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('fee_hut_occupancy_max', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('has_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('has_optional_services', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('is_restricted', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('restriction', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('reservations', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('locked', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('private', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('discretion', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('user_email', self.gf('django.db.models.fields.EmailField')(max_length=75, blank=True)),
            ('user_notes', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('hut', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', to=orm['huts.Hut'])),
        ))
        db.send_create_signal(u'huts', ['HutEdit'])

        # Adding M2M table for field designations on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_designations')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('designation', models.ForeignKey(orm[u'huts.designation'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'designation_id'])

        # Adding M2M table for field systems on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_systems')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('system', models.ForeignKey(orm[u'huts.system'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'system_id'])

        # Adding M2M table for field access_no_snow on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_access_no_snow')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('accesstype', models.ForeignKey(orm[u'huts.accesstype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'accesstype_id'])

        # Adding M2M table for field types on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_types')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('huttype', models.ForeignKey(orm[u'huts.huttype'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'huttype_id'])

        # Adding M2M table for field services on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'service_id'])

        # Adding M2M table for field optional_services on 'HutEdit'
        m2m_table_name = db.shorten_name(u'huts_hutedit_optional_services')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('hutedit', models.ForeignKey(orm[u'huts.hutedit'], null=False)),
            ('service', models.ForeignKey(orm[u'huts.service'], null=False))
        ))
        db.create_unique(m2m_table_name, ['hutedit_id', 'service_id'])

        # Adding model 'Agency'
        db.create_table(u'huts_agency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
            ('created', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateField')(auto_now=True, blank=True)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['huts.Agency'], null=True, blank=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=250, null=True, blank=True)),
            ('phone', self.gf('django.db.models.fields.BigIntegerField')(null=True, blank=True)),
            ('email', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
        ))
        db.send_create_signal(u'huts', ['Agency'])


    def backwards(self, orm):
        # Deleting model 'Region'
        db.delete_table(u'huts_region')

        # Deleting model 'Designation'
        db.delete_table(u'huts_designation')

        # Deleting model 'System'
        db.delete_table(u'huts_system')

        # Deleting model 'AccessType'
        db.delete_table(u'huts_accesstype')

        # Deleting model 'HutType'
        db.delete_table(u'huts_huttype')

        # Deleting model 'Service'
        db.delete_table(u'huts_service')

        # Deleting model 'Hut'
        db.delete_table(u'huts_hut')

        # Removing M2M table for field designations on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_designations'))

        # Removing M2M table for field systems on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_systems'))

        # Removing M2M table for field access_no_snow on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_access_no_snow'))

        # Removing M2M table for field types on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_types'))

        # Removing M2M table for field services on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_services'))

        # Removing M2M table for field optional_services on 'Hut'
        db.delete_table(db.shorten_name(u'huts_hut_optional_services'))

        # Deleting model 'HutSuggestion'
        db.delete_table(u'huts_hutsuggestion')

        # Removing M2M table for field designations on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_designations'))

        # Removing M2M table for field systems on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_systems'))

        # Removing M2M table for field access_no_snow on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_access_no_snow'))

        # Removing M2M table for field types on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_types'))

        # Removing M2M table for field services on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_services'))

        # Removing M2M table for field optional_services on 'HutSuggestion'
        db.delete_table(db.shorten_name(u'huts_hutsuggestion_optional_services'))

        # Deleting model 'HutEdit'
        db.delete_table(u'huts_hutedit')

        # Removing M2M table for field designations on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_designations'))

        # Removing M2M table for field systems on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_systems'))

        # Removing M2M table for field access_no_snow on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_access_no_snow'))

        # Removing M2M table for field types on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_types'))

        # Removing M2M table for field services on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_services'))

        # Removing M2M table for field optional_services on 'HutEdit'
        db.delete_table(db.shorten_name(u'huts_hutedit_optional_services'))

        # Deleting model 'Agency'
        db.delete_table(u'huts_agency')


    models = {
        u'huts.accesstype': {
            'Meta': {'object_name': 'AccessType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
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
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.hut': {
            'Meta': {'object_name': 'Hut'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hut_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
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
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hut_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'huts.hutedit': {
            'Meta': {'object_name': 'HutEdit'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hutedit_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hutedit_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.hutsuggestion': {
            'Meta': {'object_name': 'HutSuggestion'},
            'access_no_snow': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.AccessType']", 'null': 'True', 'blank': 'True'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.Designation']", 'null': 'True', 'blank': 'True'}),
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
            'optional_services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'optional_huts_hutsuggestion_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'services': ('huts.model_fields.UnhelpfulManyToManyField', [], {'blank': 'True', 'related_name': "u'huts_hutsuggestion_set'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('huts.model_fields.UnhelpfulManyToManyField', [], {'symmetrical': 'False', 'to': u"orm['huts.System']", 'null': 'True', 'blank': 'True'}),
            'types': ('huts.model_fields.UnhelpfulManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
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