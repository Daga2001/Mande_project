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
from mande_api.serializers import UserSerializer, GpsLocationSerializer, HistorySerializerSimple, AddressSerializer, WorkerSerializer, WorkerImgSerializer, ReceiptImgSerializer, JobSerializer, ClientSerializer, WorkerJobSerializer, WorkerJobSerializerDetailedJob, WorkerJobSerializerDetailedWorker, PaymentMethodSerializer, ServiceSerializer, ServiceSerializerDetailed, HistorySerializer
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

# creacion de ubicaci??n GPS

class CreateGpsLocation(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = GpsLocationSerializer

# M??todo para mostrar todos los trabajadores

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_workers(request, jobid):
    user = Token.objects.get(key=request.auth.key).user
    if user.type == "Client":
        trabajadores = Worker_Job.objects.filter(jid=jobid)
        serializer = WorkerJobSerializerDetailedWorker(trabajadores, many=True)
        # se filtran a los trabajadores disponibles
        workersAvailable = []
        for worker in serializer.data:
            if worker["worker"]["available"]:
                user = User.objects.get(uid=worker["worker"]["user_id"])
                serializer_user = UserSerializer(user, many=False)
                worker["user"] = serializer_user.data
                workersAvailable.append(worker)
        return Response(workersAvailable, status=status.HTTP_200_OK)
    else: 
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# M??todo para subir o actualizar imagenes al sistema

@api_view(['POST', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def upload_images(request):
    try:
        user = User.objects.get(uid=request.data["uid"])
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "POST":
        if user.type == "Worker":
            dataBody = {
                "idc_img_data": idc_img,   
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
            idc_img = None
            if "idc_img_data" in request.data:
                idc_img = request.data["idc_img_data"]
            else:
                idc_img = worker_img_data.idc_img_data
            dataBody = {
                "idc_img_data": idc_img,   
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

# M??todo para actualizar la ubicaci??n gps del trabajador

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

# M??todo para que se pueda visualiza

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def view_location_usr(request):
    try:
        location = Gps_location.objects.get(pk=request.data["uid"])
    except Gps_location.DoesNotExist:
        return Response({"error": True, "error_cause": 'Location does not exist'}, status=status.HTTP_404_NOT_FOUND)
    serializer = GpsLocationSerializer(location, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Clase para crear un trabajo

class CreateJob(generics.CreateAPIView):
    permission_classes = [
        AllowAny]  # el allowAny no es permanente debe cambiarse en un futuro
    serializer_class = JobSerializer

# M??todo para actualizar datos del usuario

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
    
# M??todo para actualizar datos del trabajador y cliente

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
        hashedPhone = hashlib.sha256()
        hashedPhone.update(request.data["phone"].encode())
        hexPhone = hashedPhone.hexdigest()
        request.data["phone"] = hexPhone
        try:
            client = Client.objects.get(user=user)
        except Client.DoesNotExist:
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
        hashedPass = hashlib.sha256()
        hashedPass.update(request.data["password"].encode())
        hexPass = hashedPass.hexdigest()
        request.data["password"] = hexPass
        try:
            worker = Worker.objects.get(user=user)
        except Worker.DoesNotExist:
            return Response({"error": True, "error_cause": 'Worker does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if "only_password" in request.data:
            request.data["avg_rating"] = worker.avg_rating
            request.data["available"] = worker.available
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
    
# M??todo para comparar 1 cadenas de texto encriptada con una no encriptada

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

# M??todo para listar todos los trabajos disponibles

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_jobs(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker" or user.type == "Client":
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": "Invalid role!"}, status=status.HTTP_404_NOT_FOUND)

# M??todo para que el trabajador registre un trabajo (job)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def register_job(request):
    try:
        user = User.objects.get(uid=request.data["uid"])
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker":
        # Se verifica que el trabajo al que quiere inscribirse el trabajador exista.
        try:
            job = Job.objects.get(occupation=request.data["occupation"])
            reqBody = {
                "jid": job.jid,
                "worker_id": user.uid,
                "price": request.data["price"]
            }
            serializer = WorkerJobSerializer(data=reqBody, many=False)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Job.DoesNotExist:
            # si el trabajo no existe se crea uno
            serializer = JobSerializer(data=request.data, many=False)
            if serializer.is_valid():
                serializer.save()
                reqBody = {
                    "jid": serializer.data["jid"],
                    "worker_id": user.uid,
                    "price": request.data["price"]
                }
                serializer_response = WorkerJobSerializer(data=reqBody, many=False)
                if serializer_response.is_valid():
                    serializer_response.save()
                    return Response(    serializer_response.data, status=status.HTTP_200_OK)
                else:
                    return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": "Only workers can view all jobs available!"}, status=status.HTTP_404_NOT_FOUND)

# M??todo para listar todos los trabajos en los que est?? inscrito el trabajador

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_my_jobs(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker":
        jobs = Worker_Job.objects.filter(worker_id=user.uid)
        serializer = WorkerJobSerializerDetailedJob(jobs, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": "Only workers can view all jobs available!"}, status=status.HTTP_404_NOT_FOUND)

# M??todo para registrar un m??todo de pago

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def register_payment_method(request):
    try:
        user = User.objects.get(uid=request.data["uid"])
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    serializer = PaymentMethodSerializer()
    request.data["uid"] = user.uid
    request.data["funds"] = round(uniform(0, 100000),2)
    hashedNum = hashlib.sha256()
    hashedNum.update(request.data["num"].encode())
    hexNum = hashedNum.hexdigest()
    request.data["num"] = hexNum
    hashedCvv = hashlib.sha256()
    hashedCvv.update(request.data["cvv"].encode())
    hexCvv = hashedCvv.hexdigest()
    request.data["cvv"] = hexCvv
    serializer = PaymentMethodSerializer(data=request.data, many=False)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para que un usuario pueda visualizar sus m??todos de pago registrados en
# el sistema

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def view_my_payment_method(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    payment_methods = Payment_Method.objects.filter(uid=user.uid)
    serializer = PaymentMethodSerializer(payment_methods, many=True)
    nPayments = len(payment_methods)
    if nPayments > 0:
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": "User hasn't registered payment methods!"}, status=status.HTTP_404_NOT_FOUND)

# M??todo para que un cliente pueda solicitar un servicio

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def request_service(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        request.data["rating"] = None
        hashedNum = hashlib.sha256()
        hashedNum.update(request.data["card_num"].encode())
        hexNum = hashedNum.hexdigest()
        request.data["card_num"] = hexNum
        serializer = ServiceSerializer(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": 'Only clients can request a service!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para que un usuario se logee

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def login_user(request):
    try:
        user = User.objects.get(email=request.data["email"])
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        hashedPhone = hashlib.sha256()
        hashedPhone.update(request.data["phone"].encode())
        hexPhone = hashedPhone.hexdigest()

        print("user:",request.data)
        try:
            client = Client.objects.get(user = user, phone = hexPhone)
            token = Token.objects.get(user_id=user.uid)
            reqdata = {
                "token": token.key,
                "user": user.type
            }
            return Response({"answer": True, "description": reqdata }, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"answer": False, "description": 'Client does not exist'}, status=status.HTTP_404_NOT_FOUND)
    elif user.type == "Worker":
        hashedPassword = hashlib.sha256()
        hashedPassword.update(request.data["password"].encode())
        hexPassword = hashedPassword.hexdigest()
        try:
            worker = Worker.objects.get(user = user, password = hexPassword)
            token = Token.objects.get(user_id=user.uid)
            reqdata = {
                "token": token.key,
                "user": user.type
            }
            return Response({"answer": True, "description": reqdata }, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"answer": False, "description": 'Worker does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
# M??todo para que un usuario pueda conocer sus datos

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_my_data(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        client = Client.objects.get(user=user)
        serializer = UserSerializer(user, many=False)
        reqData = {
            "user": serializer.data,
            "phone": client.phone
        }
        return Response(reqData, status=status.HTTP_200_OK)
    elif user.type == "Worker":
        worker = Worker.objects.get(user=user)
        serializer = UserSerializer(user, many=False)
        reqData = {
            "user": serializer.data,
            "password": worker.password,
	        "avg_rating": worker.avg_rating,
        	"available": worker.available
        }
        return Response(reqData, status=status.HTTP_200_OK)
    else: 
        return Response({"error": True, "error_cause": 'Unauthorized role!'}, status=status.HTTP_404_NOT_FOUND)
    
# M??todo para que un trabador o cliente pueda leer en detalle un servicio prestado

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def read_detailed_service(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        service = Service.objects.filter(client_id=user.uid, sid = request.data["sid"])
        serializer = ServiceSerializerDetailed(service, many=True)
        if len(serializer.data) > 0 :
            try:
                work_job = Worker_Job.objects.get(worker_id=serializer.data[0]["worker"]["user_id"], jid = serializer.data[0]["job"]["jid"])
            except Worker_Job.DoesNotExist:
                return Response({"error": True, "error_cause": "Worker doesn't offer this job!"}, status=status.HTTP_404_NOT_FOUND)
            serializer.data[0]["price"] = work_job.price
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_404_NOT_FOUND)
    elif user.type == "Worker":
        service = Service.objects.filter(worker_id=user.uid, sid = request.data["sid"])
        serializer = ServiceSerializerDetailed(service, many=True)
        if len(serializer.data) > 0 :
            try:
                work_job = Worker_Job.objects.get(worker_id=user.uid, jid = serializer.data[0]["job"]["jid"])
            except Worker_Job.DoesNotExist:
                return Response({"error": True, "error_cause": "Worker doesn't offer this job!"}, status=status.HTTP_404_NOT_FOUND)
            serializer.data[0]["price"] = work_job.price
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_404_NOT_FOUND)
    
# M??todo para insertar registros en el historial de un cliente

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def view_history(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        history = History.objects.filter(client_id=user.uid)
        serializer = HistorySerializer(history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif user.type == "Worker":
        services_worker = Service.objects.filter(worker_id=user.uid)
        history_data = []
        for service in services_worker:
            history = History.objects.filter(sid=service.sid)
            serializer = HistorySerializer(history, many=True)
            for data in serializer.data:
                history_data.append(data)
        return Response(history_data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para que un trabador o cliente pueda leer en detalle un servicio prestado

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reject_service(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker":
        try:
            service = Service.objects.get(sid=request.data["sid"], worker_id=user.uid) 
            service.delete()
            return Response({"detail": "The service was successfully removed!"}, status=status.HTTP_404_NOT_FOUND)
        except Service.DoesNotExist:
            return Response({"error": True, "error_cause": "This service doesn't exist!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": "Only workers can reject services!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# M??todo para registrar un servicio en el historial del cliente

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_history(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client":
        request.data["client_id"] = user.uid
        serializer = HistorySerializerSimple(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": True, "error_cause": serializer.errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para actualizar la informaci??n de un trabajo en la BD

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_job(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Client" or user.type == "Worker":
        job = Job.objects.get(jid=request.data["jid"])
        serializer = JobSerializer(
            job, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": "Invalid role!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para enviar un correo

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_email(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    try:
        if user.type == "Client":
            service = Service.objects.get(sid=request.data["sid"], client_id=user.uid) 
        elif user.type == "Worker":
            service = Service.objects.get(sid=request.data["sid"], worker_id=user.uid) 
    except Service.DoesNotExist:
        return Response({"error": True, "error_cause": "This service doesn't exist!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Setup the MIME
    message = MIMEMultipart()

    sender = 'pruebapruebas205'
    password = 'onupdrtfvpvvhasr'

    if user.type == "Client":
        message['Subject'] = "Nueva solicitud de trabajo"
        body = '''
            Estimad@ {name} {lastName}.

            Gracias por apoyar nuestros servicios.

            Le notificamos que se ha registrado en su cuenta una nueva solicitud para
            el trabajo de {job}, esperamos que pueda aceptarla lo m??s pronto posible.

            Atentamente,
            Mande team
        '''.format(name=service.worker_id.user.f_name, lastName=service.worker_id.user.l_name, job=service.jid.occupation)

        receiver = service.worker_id.user.email

    elif user.type == "Worker":
        message['Subject'] = "Respuesta del mande-trabajador"
        body = '''
            Estimad@ {name} {lastName}.

            Gracias por adquirir nuestros servicios.

            Le notificamos que el estado de su pedido es: {status}, si desea
            puede comuncicarse con uno de nuestros operadores para m??s informacion sobre
            su pedido.

            Atentamente,
            Mande team
        '''.format(name=service.client_id.user.f_name, lastName=service.client_id.user.l_name, status=service.status)
        
        receiver = service.client_id.user.email
        
    message.attach(MIMEText(body, 'plain'))

    # use gmail with port
    session = smtplib.SMTP('smtp.gmail.com', 587)

    # enable security
    session.starttls()

    # login with mail_id and password
    ans = session.login(sender, password)
    print("sender data:",sender, password, ans)
    text = message.as_string()
    ans2 = session.sendmail(sender, receiver, text)
    print("sendmail:",sender, receiver, text, ans2)
    session.quit()

    return Response({ "detail": "Email sent successfully!" }, status=status.HTTP_200_OK)

# M??todo para actualizar un servicio

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_service(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    try:
        service = Service.objects.get(sid=request.data["sid"]) 
        serializer = ServiceSerializer(
            service, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({ "error": True, "error_cause": serializer.errors }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Service.DoesNotExist:
        return Response({"error": True, "error_cause": "This service doesn't exist!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M??todo para validar los datos ingresados de una tarjeta.

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def validate_card(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        hashedNum = hashlib.sha256()
        hashedNum.update(request.data["num"].encode())
        hexNum = hashedNum.hexdigest()
        request.data["num"] = hexNum
        hashedCvv = hashlib.sha256()
        hashedCvv.update(request.data["cvv"].encode())
        hexCvv = hashedCvv.hexdigest()
        request.data["cvv"] = hexCvv
        card = Payment_Method.objects.get(
            num = request.data["num"],
            type = request.data["type"],
            expiration_dt = request.data["expiration_dt"],
            cvv = request.data["cvv"],
            uid = user.uid,
        )
        return Response({"answer": True, "detail": 'Valid payment method!'}, status=status.HTTP_200_OK)
    except Payment_Method.DoesNotExist:
        return Response({"answer": False, "detail": 'Invalid payment method!'}, status=status.HTTP_404_NOT_FOUND)
    
# M??todo para validar los datos ingresados de una tarjeta.

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile_img(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker":
        image = Worker_img_data.objects.filter(worker_id=user.uid)
        serializer = WorkerImgSerializer(image, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": 'Only workers can have profile image!'}, status=status.HTTP_404_NOT_FOUND)
    

# M??todo para validar los datos ingresados de una tarjeta.

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_client_in_service(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
    except User.DoesNotExist:
        return Response({"error": True, "error_cause": 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if user.type == "Worker":
        print("request:",request.data["sid"])
        services = Service.objects.filter(sid = request.data["sid"])
        clients = []
        for serv in services:
            dataBody = {
                "client_id": serv.client_id.user.uid,
                "nombre": serv.client_id.user.f_name,
                "apellido": serv.client_id.user.l_name,
                "direccion": {
                    "calle": serv.client_id.user.address_id.street,
                    "ciudad": serv.client_id.user.address_id.city,
                    "pais": serv.client_id.user.address_id.country,
                    "cod_postal": serv.client_id.user.address_id.postal_code,
                },
                "email": serv.client_id.user.email,
            }
            clients.append(dataBody)
        return Response(clients, status=status.HTTP_200_OK)
    else:
        return Response({"error": True, "error_cause": 'Only workers allowed!'}, status=status.HTTP_404_NOT_FOUND)
