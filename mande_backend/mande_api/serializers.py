from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from mande_api.models import *
from dateutil.relativedelta import relativedelta

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
    phone=serializers.IntegerField(write_only=True,required=False)
    password=serializers.CharField(write_only=True,required=False)
    avg_rating=serializers.CharField(write_only=True,required=False)
    avaliable=serializers.BooleanField(write_only=True,required=False)

    def create(self, validated_data):
        type = validated_data.pop('type')

        if type == "Client":
            phone = validated_data.pop('phone')
            user = get_user_model().objects.create_user(**validated_data)
            user.save()
            user_cliente = Client.objects.create(
                user=user, phone=phone)

        elif type == "Worker":
            avg_rating=validated_data.pop('avg_rating')
            avaliable=validated_data.pop('avaliable')
            password=validated_data.pop('password')
            user = get_user_model().objects.create_user(**validated_data)
            user.save()
            user_worker = Worker.objects.create(user=user,
                                                  avg_rating=avg_rating, 
                                                  avaliable=avaliable,
                                                  password=password,
                                                  )
        return user

    class Meta:
        model = get_user_model()
        fields = ("uid", "type", "password", "f_name","l_name",
                  "birth_dt", "email", "address_id", "location_id", 
                  "phone", "avg_rating", "avaliable"
                  )

class GpsLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gps_location
        fields = ("id", "latitude","longitude", 
                    )

class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = ("house_id", "street", "city", "country", "postal_code", 
                    )