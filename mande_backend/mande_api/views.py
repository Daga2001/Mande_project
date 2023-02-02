from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken, AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework import status
from mande_api.serializers import UserSerializer, GpsLocationSerializer, AddressSerializer, WorkerSerializer, WorkerImgSerializer, ReceiptImgSerializer, JobSerializer, ClientSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.settings import api_settings
from rest_framework.decorators import permission_classes, authentication_classes
from .models import Address, Client, Gps_location, Job, History, Receipt, Service, User, Payment_Method, Worker_img_data, Worker_Job, Worker
import requests
import json
from datetime import datetime, timedelta, date
from django.template import loader
from django.shortcuts import render
from django.http import HttpResponse
import random
from weasyprint import HTML, CSS
from dateutil.relativedelta import relativedelta
from random import randrange, uniform
import hashlib

# Create your views here.

# creacion de usuarios

class CreateUserAdminView(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = UserSerializer

# creacion de direcciones

class CreateAddress(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = AddressSerializer

# creacion de ubicación GPS

class CreateGpsLocation(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = GpsLocationSerializer

# Método para mostrar todos los trabajadores

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_workers(request):
    user = Token.objects.get(key=request.auth.key).user
    if user.type == "Client":
        trabajadores = Worker.objects.all()
        serializer = WorkerSerializer(trabajadores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else: 
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Método para subir o actualizar imagenes al sistema

@api_view(['POST', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_images(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        if user.type == "Worker":
            dataBody = {
                "idc_img_data": request.data["idc_img_data"],   
                "prof_img_data": request.data["prof_img_data"],
                "worker_id": user.uid
            }
            serializer = WorkerImgSerializer(data=dataBody, many=False)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                worker_img_data = Worker_img_data(**validated_data)
                worker_img_data.save()
                serializer_response = WorkerImgSerializer(worker_img_data)
                return Response(serializer_response.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": True, "error_cause": "an image is duplicated"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif user.type == "Client":
            dataBody = {
                "receipt_data": request.data["receipt_data"],   
                "client_id": user.uid
            }
            serializer = ReceiptImgSerializer(data=dataBody)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                receipt = Receipt(**validated_data)
                receipt.save()
                serializer_response = ReceiptImgSerializer(receipt)
                return Response(serializer_response.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": True, "error_cause": "an image is duplicated"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else: 
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    elif request.method == "PUT":
        if user.type == "Worker":
            try:
                worker_img_data = Worker_img_data.objects.get(worker_id=user.uid)
            except Worker_img_data.DoesNotExist:
                return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
            dataBody = {
                "idc_img_data": request.data["idc_img_data"],   
                "prof_img_data": request.data["prof_img_data"],
                "worker_id": user.uid
            }
            serializer = WorkerImgSerializer(
                worker_img_data, data=dataBody, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif user.type == "Client":
            try:
                receipt_data = Receipt.objects.get(client_id=user.uid)
            except Receipt.DoesNotExist:
                return Response({"error": True}, status=status.HTTP_404_NOT_FOUND)
            dataBody = {
                "receipt_data": request.data["receipt_data"],   
                "client_id": user.uid
            }
            serializer = ReceiptImgSerializer(
                receipt_data, data=dataBody, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        else: 
            return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({"error": True, "error_cause": "Invalid request method!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Método para actualizar la ubicación gps del trabajador

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_location_usr(request):
    if request.method == "PUT":
        try:
            user = Token.objects.get(key=request.auth.key).user
        except User.DoesNotExist:
            return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        try:
            locationGps = Gps_location.objects.get(uid=user.uid)
        except Gps_location.DoesNotExist:
            return Response({"error": True, "error_cause": 'Location does not exist'}, status=status.HTTP_404_NOT_FOUND)
        reqBody = {
            "uid": user.uid,
            "latitude": request.data["latitude"],
            "longitude": request.data["longitude"]
        }
        serializer = GpsLocationSerializer(
            locationGps, data=reqBody, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": "Invalid request method!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Clase para crear un trabajo

class CreateJob(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = JobSerializer

# Método para actualizar datos del usuario

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    request.data["type"] = user.type
    serializer = UserSerializer(
        user, data=request.data, context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Método para actualizar datos del trabajador y cliente

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_worker_cli(request, type):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client" and type == "client":
        request.data["user"] = user
        try:
            client = Client.objects.get(user=user)
        except:
            return Response({"error": True, "error_cause": 'Client does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ClientSerializer(
            client, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif user.type == "Worker" and type == "worker":
        request.data["user"] = user
        password = request.data["password"]
        hashedPass = hashlib.sha256()
        hashedPass.update(password.encode())
        fPass = hashedPass.hexdigest()
        request.data["password"] = fPass
        try:
            worker = Worker.objects.get(user=user)
        except:
            return Response({"error": True, "error_cause": 'Worker does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WorkerSerializer(
            worker, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({ "error": True, "error_cause": "The user has an invalid role!" }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Método para comparar 1 cadenas de texto encriptada con una no encriptada

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def compare_sha256(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if 'encrypted' not in request.data or 'str' not in request.data:
        return Response({"error": True, "error_cause": 'The request body should include encrypted and str fields!'}, status=status.HTTP_404_NOT_FOUND)
    else:
        encrypted = request.data["encrypted"]
        str = request.data["str"]
        hashStr = hashlib.sha256()
        hashStr.update(str.encode())
        hexStr = hashStr.hexdigest()
        return Response({"answer": encrypted == hexStr}, status=status.HTTP_200_OK)
