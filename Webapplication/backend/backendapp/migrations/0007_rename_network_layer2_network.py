# Generated by Django 3.2.9 on 2021-11-19 17:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backendapp', '0006_alter_layer2_network'),
    ]

    operations = [
        migrations.RenameField(
            model_name='layer2',
            old_name='network',
            new_name='Network',
        ),
    ]