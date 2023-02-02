from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from mande_api.models import *
from dateutil.relativedelta import relativedelta
import hashlib

#Serializer para authenticacion del usuario
class AuthTokenSerializer(serializers.Serializer):
    """serializer for the user authentication object"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = _('Imposible autenticar con esas credenciales')
            raise serializers.ValidationError(msg, code='authentication')
        attrs['user'] = user
        return attrs

#Me recibe validated_data y me crea el usuario

class UserSerializer(serializers.ModelSerializer):
    type = serializers.CharField(write_only=True)
    phone=serializers.CharField(write_only=True,required=False)
    password=serializers.CharField(write_only=True,required=False)
    avg_rating=serializers.CharField(write_only=True,required=False)
    available=serializers.BooleanField(write_only=True,required=False)

    def create(self, validated_data):
        type = validated_data['type']

        if type == "Client":
            phone = validated_data.pop('phone')
            hashedPass = hashlib.sha256()
            hashedPass.update(phone.encode())
            fPass = hashedPass.hexdigest()
            user = get_user_model().objects.create_user(**validated_data)
            user.save()
            user_cliente = Client.objects.create(
                user=user, phone=fPass)

        elif type == "Worker":
            print("valid:",validated_data)
            avg_rating=validated_data.pop('avg_rating')
            available=validated_data.pop('available')
            password=validated_data.pop('password')
            hashedPass = hashlib.sha256()
            hashedPass.update(password.encode())
            fPass = hashedPass.hexdigest()
            user = get_user_model().objects.create_user(**validated_data)
            user.save()
            user_worker = Worker.objects.create(user=user,
                                                  avg_rating=avg_rating, 
                                                  available=available,
                                                  password=fPass,
                                                  )
        return user

    class Meta:
        model = get_user_model()
        fields = ("uid", "type", "password", "f_name","l_name",
                  "birth_dt", "email", "address_id", 
                  "phone", "avg_rating", "available"
                  )

class GpsLocationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Gps_location
        fields = ("uid", "latitude","longitude", 
                    )

class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = ("house_id", "street", "city", "country", "postal_code", 
                    )

class WorkerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Worker
        fields = ("user_id", "password", "avg_rating", "available"
                    )

class ClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Client
        fields = ("user_id", "phone"
                    )

class  WorkerImgSerializer(serializers.ModelSerializer):
    idc_img_data = models.ImageField(default="", blank = False, upload_to = 'worker_data')
    prof_img_data = models.ImageField(default="", blank = False, upload_to = 'worker_data')
    Worker_id = models.AutoField(primary_key=True)

    # def create(self, validated_data):
    #     receipt = Receipt.objects.create(
    #         idc_img_data = validated_data["idc_img_data"],
    #         prof_img_data = validated_data["prof_img_data"],
    #         Worker_id = validated_data["Worker_id"],
    #     )
    #     return receipt

    class Meta:
        model = Worker_img_data
        fields = ("idc_img_data", "prof_img_data", "worker_id"
                    )

class  ReceiptImgSerializer(serializers.ModelSerializer):
    rid = models.AutoField(primary_key=True)
    receipt_data = models.ImageField(default="", blank = False, upload_to = 'client_data')
    Worker_id = models.IntegerField()

    def create(self, validated_data):
        receipt = Receipt.objects.create(
            receipt_data = validated_data["receipt_data"],
            client_id = validated_data["client_id"]
        )
        return receipt

    class Meta:
        model = Receipt        
        fields = ("rid", "receipt_data", "client_id"
                    )

class JobSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Job
        fields = (
            "jid", "occupation"
        )

class WorkerJobSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Worker_Job
        fields = (
            "jid", "price", "worker_id"
        )

class WorkerJobSerializerDetailedJob(serializers.ModelSerializer):
    job = JobSerializer(many=False, read_only=True, source='jid')
    
    class Meta:
        model = Worker_Job
        fields = (
            "job", "price", "worker_id"
        )

class PaymentMethodSerializer(serializers.ModelSerializer):

     class Meta:
        model = Payment_Method
        fields = (
            "num", "type", "expiration_dt", "cvv", "funds", "uid"
        )

class WorkerJobSerializerDetailedWorker(serializers.ModelSerializer):
    worker = WorkerSerializer(many=False, read_only=True, source='worker_id')
    
    class Meta:
        model = Worker_Job
        fields = (
            "worker", "price", "jid"
        )

class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = (
            "sid", "rating", "description", "client_id", "worker_id", 
            "jid", "card_num"
        )