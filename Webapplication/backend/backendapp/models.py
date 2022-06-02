from django.db import models
#from django.db.models.fields import json
from django.db.models.fields.json import JSONField

# Create your data models here.

class Layer2(models.Model):
    NetworkID = models.AutoField(primary_key=True)
    Network = JSONField()
    class Meta:
        get_latest_by = ["NetworkID"]
    


class VNFs(models.Model):
    NetworkID = models.AutoField(primary_key=True)
    Network = JSONField()
    class Meta:
        get_latest_by = ["NetworkID"]

class SFCs(models.Model):
    SFCListID = models.AutoField(primary_key=True)
    SFCList = JSONField()
    class Meta:
        get_latest_by = ["SFCListID"]
           
   


