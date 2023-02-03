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
from mande_api.serializers import UserSerializer, GpsLocationSerializer, AddressSerializer, WorkerSerializer, WorkerImgSerializer, ReceiptImgSerializer, JobSerializer, ClientSerializer, WorkerJobSerializer, WorkerJobSerializerDetailedJob, WorkerJobSerializerDetailedWorker, PaymentMethodSerializer, ServiceSerializer, ServiceSerializerDetailed, HistorySerializer
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
def get_workers(request, jobid):
    user = Token.objects.get(key=request.auth.key).user
    if user.type == "Client":
        trabajadores = Worker_Job.objects.filter(jid=jobid)
        serializer = WorkerJobSerializerDetailedWorker(trabajadores, many=True)
        # se filtran a los trabajadores disponibles
        workersAvailable = []
        for worker in serializer.data:
            if worker["worker"]["available"]:
                workersAvailable.append(worker)
        return Response(workersAvailable, status=status.HTTP_200_OK)
    else: 
        return Response({"error": True}, status=status.HTTP_401_UNAUTHORIZED)

# Método para subir o actualizar imagenes al sistema

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

# Método para que se pueda visualiza

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

# Método para listar todos los trabajos disponibles

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

# Método para que el trabajador registre un trabajo (job)

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

# Método para listar todos los trabajos en los que está inscrito el trabajador

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

# Método para registrar un método de pago

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_payment_method(request):
    try:
        user = Token.objects.get(key=request.auth.key).user
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

# Método para que un usuario pueda visualizar sus métodos de pago registrados en
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

# Método para que un cliente pueda solicitar un servicio

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

# Método para que un usuario se logee

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
            client = Client.objects.get(phone = hexPhone)
            token = Token.objects.get(user_id=user.uid)
            return Response({"answer": True, "description": token.key }, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"answer": False, "description": 'Client does not exist'}, status=status.HTTP_404_NOT_FOUND)
    elif user.type == "Worker":
        hashedPassword = hashlib.sha256()
        hashedPassword.update(request.data["password"].encode())
        hexPassword = hashedPassword.hexdigest()
        try:
            worker = Worker.objects.get(password = hexPassword)
            token = Token.objects.get(user_id=user.uid)
            return Response({"answer": True, "description": token.key }, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"answer": False, "description": 'Worker does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
# Método para que un usuario pueda conocer sus datos

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
    
# Método para que un trabador o cliente pueda leer en detalle un servicio prestado

@api_view(['GET'])
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
        if len(serializer.data) > 0 :
            try:
                work_job = Worker_Job.objects.get(worker_id=user.uid, jid = serializer.data[0]["job"]["jid"])
            except Worker_Job.DoesNotExist:
                return Response({"error": True, "error_cause": "Worker doesn't offer this job!"}, status=status.HTTP_404_NOT_FOUND)
            serializer.data[0]["price"] = work_job.price
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_404_NOT_FOUND)
    
# Método para insertar registros en el historial de un cliente

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
    else:
        return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Método para que un trabador o cliente pueda leer en detalle un servicio prestado

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


# Método para registrar un servicio en el historial del cliente

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
        serializer = HistorySerializer(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": True, "error_cause": serializer.errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": True, "error_cause": "There're no available services!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
