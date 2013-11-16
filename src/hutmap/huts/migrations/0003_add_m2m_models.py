# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'HutType'
        db.create_table(u'huts_huttype', (
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=100, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['HutType'])

        # Adding model 'Designation'
        db.create_table(u'huts_designation', (
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=100, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['Designation'])

        # Adding model 'System'
        db.create_table(u'huts_system', (
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=100, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['System'])

        # Adding model 'AccessType'
        db.create_table(u'huts_accesstype', (
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=100, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['AccessType'])

        # Adding model 'Service'
        db.create_table(u'huts_service', (
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=100, primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'huts', ['Service'])

        # Deleting field 'HutSuggestion.types'
        db.delete_column(u'huts_hutsuggestion', 'types')

        # Deleting field 'HutSuggestion.access_no_snow'
        db.delete_column(u'huts_hutsuggestion', 'access_no_snow')

        # Deleting field 'HutSuggestion.systems'
        db.delete_column(u'huts_hutsuggestion', 'systems')

        # Deleting field 'HutSuggestion.optional_services'
        db.delete_column(u'huts_hutsuggestion', 'optional_services')

        # Deleting field 'HutSuggestion.services'
        db.delete_column(u'huts_hutsuggestion', 'services')

        # Deleting field 'HutSuggestion.designations'
        db.delete_column(u'huts_hutsuggestion', 'designations')

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

        # Deleting field 'Hut.types'
        db.delete_column(u'huts_hut', 'types')

        # Deleting field 'Hut.access_no_snow'
        db.delete_column(u'huts_hut', 'access_no_snow')

        # Deleting field 'Hut.systems'
        db.delete_column(u'huts_hut', 'systems')

        # Deleting field 'Hut.optional_services'
        db.delete_column(u'huts_hut', 'optional_services')

        # Deleting field 'Hut.services'
        db.delete_column(u'huts_hut', 'services')

        # Deleting field 'Hut.designations'
        db.delete_column(u'huts_hut', 'designations')

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

        # Deleting field 'HutEdit.types'
        db.delete_column(u'huts_hutedit', 'types')

        # Deleting field 'HutEdit.access_no_snow'
        db.delete_column(u'huts_hutedit', 'access_no_snow')

        # Deleting field 'HutEdit.systems'
        db.delete_column(u'huts_hutedit', 'systems')

        # Deleting field 'HutEdit.optional_services'
        db.delete_column(u'huts_hutedit', 'optional_services')

        # Deleting field 'HutEdit.services'
        db.delete_column(u'huts_hutedit', 'services')

        # Deleting field 'HutEdit.designations'
        db.delete_column(u'huts_hutedit', 'designations')

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


    def backwards(self, orm):
        # Deleting model 'HutType'
        db.delete_table(u'huts_huttype')

        # Deleting model 'Designation'
        db.delete_table(u'huts_designation')

        # Deleting model 'System'
        db.delete_table(u'huts_system')

        # Deleting model 'AccessType'
        db.delete_table(u'huts_accesstype')

        # Deleting model 'Service'
        db.delete_table(u'huts_service')

        # Adding field 'HutSuggestion.types'
        db.add_column(u'huts_hutsuggestion', 'types',
                      self.gf('huts.model_fields.ListField')(default=None),
                      keep_default=False)

        # Adding field 'HutSuggestion.access_no_snow'
        db.add_column(u'huts_hutsuggestion', 'access_no_snow',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutSuggestion.systems'
        db.add_column(u'huts_hutsuggestion', 'systems',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutSuggestion.optional_services'
        db.add_column(u'huts_hutsuggestion', 'optional_services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutSuggestion.services'
        db.add_column(u'huts_hutsuggestion', 'services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutSuggestion.designations'
        db.add_column(u'huts_hutsuggestion', 'designations',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

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

        # Adding field 'Hut.types'
        db.add_column(u'huts_hut', 'types',
                      self.gf('huts.model_fields.ListField')(default=None),
                      keep_default=False)

        # Adding field 'Hut.access_no_snow'
        db.add_column(u'huts_hut', 'access_no_snow',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Hut.systems'
        db.add_column(u'huts_hut', 'systems',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Hut.optional_services'
        db.add_column(u'huts_hut', 'optional_services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Hut.services'
        db.add_column(u'huts_hut', 'services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Hut.designations'
        db.add_column(u'huts_hut', 'designations',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

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

        # Adding field 'HutEdit.types'
        db.add_column(u'huts_hutedit', 'types',
                      self.gf('huts.model_fields.ListField')(default=None),
                      keep_default=False)

        # Adding field 'HutEdit.access_no_snow'
        db.add_column(u'huts_hutedit', 'access_no_snow',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutEdit.systems'
        db.add_column(u'huts_hutedit', 'systems',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutEdit.optional_services'
        db.add_column(u'huts_hutedit', 'optional_services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutEdit.services'
        db.add_column(u'huts_hutedit', 'services',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'HutEdit.designations'
        db.add_column(u'huts_hutedit', 'designations',
                      self.gf('huts.model_fields.ListField')(null=True, blank=True),
                      keep_default=False)

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


    models = {
        u'huts.accesstype': {
            'Meta': {'object_name': 'AccessType'},
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '100', 'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'huts.agency': {
            'Meta': {'object_name': 'Agency'},
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
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
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
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
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hut_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hut_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'huts.hutedit': {
            'Meta': {'object_name': 'HutEdit'},
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
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
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hutedit_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hutedit_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
            'updated': ('django.db.models.fields.DateField', [], {'auto_now': 'True', 'blank': 'True'}),
            'user_email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'user_notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        },
        u'huts.hutsuggestion': {
            'Meta': {'object_name': 'HutSuggestion'},
            'access_no_snow': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.AccessType']", 'null': 'True', 'symmetrical': 'False'}),
            'agency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Agency']", 'null': 'True', 'blank': 'True'}),
            'alternate_names': ('huts.model_fields.ListField', [], {'null': 'True', 'blank': 'True'}),
            'altitude_meters': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'backcountry': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_hut_min': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'capacity_max': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'country': ('huts.model_fields.CountryField', [], {'max_length': '2'}),
            'created': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'designations': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.Designation']", 'null': 'True', 'symmetrical': 'False'}),
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
            'hut_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
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
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'no_snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'open_summer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'open_winter': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'optional_services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'optional_huts_hutsuggestion_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'overnight': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'photo_credit_name': ('django.db.models.fields.CharField', [], {'max_length': '150', 'null': 'True', 'blank': 'True'}),
            'photo_credit_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'photo_url': ('django.db.models.fields.URLField', [], {'max_length': '250', 'null': 'True', 'blank': 'True'}),
            'private': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'region': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['huts.Region']", 'null': 'True', 'blank': 'True'}),
            'reservations': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'restriction': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'services': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'huts_hutsuggestion_set'", 'null': 'True', 'to': u"orm['huts.Service']"}),
            'show_satellite': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'show_topo': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'snow_min_km': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'structures': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'systems': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.System']", 'null': 'True', 'symmetrical': 'False'}),
            'types': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['huts.HutType']", 'null': 'True', 'symmetrical': 'False'}),
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