from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from backendapp.models import Layer2
from backendapp.serializers import Layer2Serializer

from backendapp.models import VNFs
from backendapp.serializers import VNFsSerializer

from backendapp.models import SFCs
from backendapp.serializers import SFCsSerializer


from django.core.files.storage import default_storage

# Create your views here.

# API to access and store underlay network data
@csrf_exempt
def layer2Api(request,id=0):
    if request.method=='GET':
        layer2lenght = Layer2.objects.order_by('NetworkID').count()
        layer2s = Layer2.objects.order_by('NetworkID')[(layer2lenght -1):layer2lenght]
        layer2_serializer = Layer2Serializer(layer2s, many=True)
        return JsonResponse(layer2_serializer.data, safe=False)
    elif request.method=='POST':
        layer2_data=JSONParser().parse(request)
        layer2_serializer = Layer2Serializer(data=layer2_data)
        if layer2_serializer.is_valid():
            layer2_serializer.save()
            return JsonResponse("Added Successfully!!" , safe=False)
        return JsonResponse("Failed to Add.",safe=False)
    elif request.method=='DELETE':
        layer2=Layer2.objects.first()
        layer2.delete()
        return JsonResponse("Deleted", safe=False)    
    

# API to access and store overlay network data
@csrf_exempt
def vnfsApi(request,id=0):
    if request.method=='GET':
        vnfslenght = VNFs.objects.order_by('NetworkID').count()
        vnfss = VNFs.objects.order_by('NetworkID')[(vnfslenght -1):vnfslenght]
        vnfs_serializer = VNFsSerializer(vnfss, many=True)
        return JsonResponse(vnfs_serializer.data, safe=False)
    elif request.method=='POST':
        vnfs_data=JSONParser().parse(request)
        vnfs_serializer = VNFsSerializer(data=vnfs_data)
        if vnfs_serializer.is_valid():
            vnfs_serializer.save()
            return JsonResponse("Added Successfully!!" , safe=False)
        return JsonResponse("Failed to Add.",safe=False)
    elif request.method=='DELETE':
        vnfs=VNFs.objects.first()
        vnfs.delete()
        return JsonResponse("Deleted", safe=False)    


# API to access and store SFC data
@csrf_exempt
def sfcsApi(request,id=0):
    if request.method=='GET':
        sfcslenght = SFCs.objects.order_by('SFCListID').count()
        sfcss = SFCs.objects.order_by('SFCListID')[(sfcslenght -1):sfcslenght]
        sfcs_serializer = SFCsSerializer(sfcss, many=True)
        return JsonResponse(sfcs_serializer.data, safe=False)
    elif request.method=='POST':
        sfcs_data=JSONParser().parse(request)
        sfcs_serializer = SFCsSerializer(data=sfcs_data)
        if sfcs_serializer.is_valid():
            sfcs_serializer.save()
            return JsonResponse("Added Successfully!!" , safe=False)
        return JsonResponse("Failed to Add.",safe=False)
    elif request.method=='DELETE':
        sfcs=SFCs.objects.first()
        sfcs.delete()
        return JsonResponse("Deleted", safe=False)    
    
    