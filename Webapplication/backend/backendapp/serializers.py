from rest_framework import fields, serializers
from backendapp.models import Layer2, VNFs, SFCs



class Layer2Serializer(serializers.ModelSerializer):
    #Network = serializers.JSONField()
    class Meta:
        model = Layer2
        fields = ('NetworkID','Network', )


class VNFsSerializer(serializers.ModelSerializer):
    #Network = serializers.JSONField()
    class Meta:
        model = VNFs
        fields = ('NetworkID','Network', )

class SFCsSerializer(serializers.ModelSerializer):
    #Network = serializers.JSONField()
    class Meta:
        model = SFCs
        fields = ('SFCListID','SFCList', )


